import 'dotenv/config';
import express from 'express';
import cors from 'cors';
import cookieParser from 'cookie-parser';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { query, initDb } from './db.js';
import { seedDemoData } from './seed.js';
import { authenticateToken } from './middleware/auth.js';
import passport from './middleware/passport.js';

const app = express();
const PORT = process.env.PORT || 5000;

// Enable CORS with credential support for HTTP-Only cookies
app.use(cors({
  origin: ['http://localhost:5173', 'http://127.0.0.1:5173'],
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));

app.use(express.json());
app.use(cookieParser());
app.use(passport.initialize());

// Initialize Database and Seed Demo User on startup
const setupDatabase = async () => {
  await initDb();
  await seedDemoData();
};
setupDatabase();

// Email validation helper
const isValidEmail = (email) => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
};

// ==========================================
// AUTHENTICATION ROUTES
// ==========================================

// 1. Signup Route
app.post('/api/signup', async (req, res) => {
  const { email, password, name } = req.body;

  // Input Validation
  if (!email || !password) {
    return res.status(400).json({ error: 'Email and password are required.' });
  }

  if (!isValidEmail(email)) {
    return res.status(400).json({ error: 'Please enter a valid email address.' });
  }

  if (password.length < 8) {
    return res.status(400).json({ error: 'Password must be at least 8 characters long.' });
  }

  try {
    // Hash password with bcryptjs
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    // Insert user into PostgreSQL DB
    const result = await query(
      'INSERT INTO users (email, password, name) VALUES ($1, $2, $3) RETURNING id, email, name, created_at',
      [email.toLowerCase().trim(), hashedPassword, name || null]
    );

    const newUser = result.rows[0];

    res.status(201).json({
      message: 'Registration successful.',
      user: {
        id: newUser.id,
        email: newUser.email,
        name: newUser.name,
        createdAt: newUser.created_at
      }
    });
  } catch (err) {
    console.error('Signup Error:', err);
    
    // Check if error is due to email unique constraint violation (Postgres error code 23505)
    if (err.code === '23505') {
      return res.status(400).json({ error: 'An account with this email already exists.' });
    }
    
    res.status(500).json({ error: 'Internal server error during registration.' });
  }
});

// ==========================================
// GOOGLE OAUTH ROUTES
// ==========================================

// Initiate Google Authentication
app.get('/api/auth/google', passport.authenticate('google', {
  scope: ['profile', 'email'],
  session: false
}));

// Google Authentication Callback
app.get('/api/auth/google/callback', (req, res, next) => {
  console.log('[Google Callback] Initiating passport.authenticate handler');
  passport.authenticate('google', { session: false }, (err, user, info) => {
    console.log('[Google Callback] passport.authenticate returned:', { 
      err: err ? (err.stack || err.message || err) : null, 
      hasUser: !!user, 
      info 
    });
    
    if (err) {
      console.error('[Google Callback] Google Auth Strategy Error:', err);
      return res.redirect(`/login?error=${encodeURIComponent(err.message || 'Google authentication failed.')}`);
    }
    if (!user) {
      console.error('[Google Callback] Google Auth Failed: User object is empty.', info);
      const detail = info?.message || 'Google authentication failed: User not found.';
      return res.redirect(`/login?error=${encodeURIComponent(detail)}`);
    }

    try {
      // Generate JWT
      const token = jwt.sign(
        { userId: user.id, email: user.email },
        process.env.JWT_SECRET,
        { expiresIn: '24h' }
      );

      // Set httpOnly Cookie
      res.cookie('token', token, {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'lax',
        maxAge: 24 * 60 * 60 * 1000 // 24 hours
      });

      // Redirect to dashboard
      res.redirect('/dashboard');
    } catch (jwtErr) {
      console.error('Google Auth JWT signing error:', jwtErr);
      res.redirect(`/login?error=${encodeURIComponent('Failed to sign in. Internal session error.')}`);
    }
  })(req, res, next);
});

// 2. Login Route
app.post('/api/login', async (req, res) => {
  const { email, password } = req.body;

  // Basic validation
  if (!email || !password) {
    return res.status(400).json({ error: 'Email and password are required.' });
  }

  try {
    // Find user in database
    const result = await query(
      'SELECT id, email, password, name, created_at FROM users WHERE email = $1',
      [email.toLowerCase().trim()]
    );

    if (result.rows.length === 0) {
      return res.status(401).json({ error: 'Invalid email or password.' });
    }

    const user = result.rows[0];

    // Verify password
    if (!user.password) {
      return res.status(401).json({ error: 'This account uses Google Sign-in. Please log in with Google.' });
    }

    const isPasswordMatch = await bcrypt.compare(password, user.password);
    if (!isPasswordMatch) {
      return res.status(401).json({ error: 'Invalid email or password.' });
    }

    // Generate JWT
    const token = jwt.sign(
      { userId: user.id, email: user.email },
      process.env.JWT_SECRET,
      { expiresIn: '24h' }
    );

    // Set httpOnly Cookie
    res.cookie('token', token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: 24 * 60 * 60 * 1000 // 24 hours
    });

    // Send user data (omit password)
    res.status(200).json({
      message: 'Login successful.',
      user: {
        id: user.id,
        email: user.email,
        name: user.name,
        createdAt: user.created_at
      }
    });
  } catch (err) {
    console.error('Login Error:', err);
    res.status(500).json({ error: 'Internal server error during login.' });
  }
});

// 3. Logout Route
app.post('/api/logout', (req, res) => {
  res.clearCookie('token', {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax'
  });
  
  res.status(200).json({ message: 'Logged out successfully.' });
});

// 4. Get Current User Route
app.get('/api/me', authenticateToken, (req, res) => {
  // authenticateToken attaches the user object to req.user
  res.status(200).json({ user: req.user });
});

// 5. Get Cases Route for Logged-In User
app.get('/api/cases', authenticateToken, async (req, res) => {
  try {
    const result = await query(
      'SELECT id, case_number, court_name, status, next_hearing_date FROM cases WHERE user_id = $1 ORDER BY next_hearing_date ASC',
      [req.user.id]
    );
    const cases = result.rows.map(row => ({
      id: row.id,
      caseNumber: row.case_number,
      courtName: row.court_name,
      status: row.status,
      nextHearingDate: row.next_hearing_date
    }));
    res.status(200).json({ cases });
  } catch (err) {
    console.error('Fetch Cases Error:', err);
    res.status(500).json({ error: 'Internal server error while fetching case records.' });
  }
});

// Global Error Handler Middleware
app.use((err, req, res, next) => {
  console.error('Unhandled Error caught by global handler:', err);
  res.status(500).json({ error: err.message || 'An unexpected server error occurred.' });
});

// ==========================================
// START SERVER
// ==========================================
app.listen(PORT, () => {
  console.log(`Lexora Auth Server running on http://localhost:${PORT}`);
});
