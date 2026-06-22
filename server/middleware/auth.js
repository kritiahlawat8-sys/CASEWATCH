import jwt from 'jsonwebtoken';
import { query } from '../db.js';

export const authenticateToken = async (req, res, next) => {
  try {
    // Read token from cookies (primary) or Authorization header (fallback)
    let token = req.cookies?.token;

    if (!token && req.headers?.authorization?.startsWith('Bearer ')) {
      token = req.headers.authorization.split(' ')[1];
    }

    if (!token) {
      return res.status(401).json({ error: 'Authentication required. Please log in.' });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    
    // Query database to ensure user still exists
    const userResult = await query(
      'SELECT id, email, name, is_demo, google_id, created_at FROM users WHERE id = $1',
      [decoded.userId]
    );

    if (userResult.rows.length === 0) {
      return res.status(401).json({ error: 'User session invalid. Please register or log in again.' });
    }

    // Attach user information to request object
    req.user = userResult.rows[0];
    next();
  } catch (err) {
    console.error('JWT Verification Error:', err.message);
    if (err.name === 'TokenExpiredError') {
      return res.status(401).json({ error: 'Session expired. Please log in again.' });
    }
    return res.status(401).json({ error: 'Invalid or missing authentication token.' });
  }
};
