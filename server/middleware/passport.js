import passport from 'passport';
import { Strategy as GoogleStrategy } from 'passport-google-oauth20';
import { query } from '../db.js';
import dotenv from 'dotenv';

dotenv.config();

const googleClientId = process.env.GOOGLE_CLIENT_ID;
const googleClientSecret = process.env.GOOGLE_CLIENT_SECRET;

if (!googleClientId || googleClientId === 'dummy_id') {
  console.warn('\n[WARNING] Google OAuth Client ID is not configured. Google sign-in will not function correctly.');
}

passport.use(new GoogleStrategy({
    clientID: googleClientId || 'dummy_id',
    clientSecret: googleClientSecret || 'dummy_secret',
    callbackURL: process.env.GOOGLE_CALLBACK_URL || 'http://localhost:5173/api/auth/google/callback',
    passReqToCallback: true
  },
  async (req, accessToken, refreshToken, profile, done) => {
    try {
      console.log('--- Google OAuth Profile Received ---');
      console.log(JSON.stringify(profile, null, 2));

      const email = profile.emails?.[0]?.value;
      if (!email) {
        console.error('Google OAuth Error: No email address returned from Google.');
        return done(new Error('No email address returned from Google.'));
      }
      const googleId = profile.id;
      const name = profile.displayName || profile.name?.givenName || 'Google User';

      // 1. Check if user already exists by google_id
      console.log(`[Google Auth] Checking database for existing user with google_id: ${googleId}`);
      let result;
      try {
        result = await query('SELECT id, email, name, created_at FROM users WHERE google_id = $1', [googleId]);
      } catch (dbErr) {
        console.error('[Google Auth] Database Error checking google_id:', dbErr);
        throw dbErr;
      }
      
      if (result.rows.length > 0) {
        console.log(`[Google Auth] Found existing user by google_id: ${result.rows[0].email}`);
        return done(null, result.rows[0]);
      }

      // 2. Check if user already exists by email (link Google ID to standard account)
      console.log(`[Google Auth] Checking database for existing user with email: ${email}`);
      try {
        result = await query('SELECT id, email, name, password, created_at FROM users WHERE email = $1', [email.toLowerCase().trim()]);
      } catch (dbErr) {
        console.error('[Google Auth] Database Error checking email:', dbErr);
        throw dbErr;
      }
      
      if (result.rows.length > 0) {
        const user = result.rows[0];
        console.log(`[Google Auth] Linking Google ID ${googleId} to existing email account: ${email}`);
        // Link Google ID to existing account and update name if it was null
        try {
          const updateResult = await query(
            'UPDATE users SET google_id = $1, name = COALESCE(name, $2) WHERE id = $3 RETURNING id, email, name, created_at',
            [googleId, name, user.id]
          );
          console.log(`[Google Auth] Linked Google account for existing email successfully: ${email}`);
          return done(null, updateResult.rows[0]);
        } catch (dbErr) {
          console.error('[Google Auth] Database Error during UPDATE query to link Google account:', dbErr);
          throw dbErr;
        }
      }

      // 3. Create a brand new user
      console.log(`[Google Auth] Creating brand new user record for: ${email}`);
      try {
        const insertResult = await query(
          'INSERT INTO users (email, name, google_id) VALUES ($1, $2, $3) RETURNING id, email, name, created_at',
          [email.toLowerCase().trim(), name, googleId]
        );
        console.log(`[Google Auth] Registered new user via Google OAuth successfully: ${email}`);
        return done(null, insertResult.rows[0]);
      } catch (dbErr) {
        console.error('[Google Auth] Database Error during INSERT query for new Google user:', dbErr);
        throw dbErr;
      }
    } catch (err) {
      console.error('[Google Auth] Error during Google authentication strategy callback:', err);
      return done(err);
    }
  }
));

export default passport;
