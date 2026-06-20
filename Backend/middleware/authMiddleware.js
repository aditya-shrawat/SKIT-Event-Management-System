import { auth } from 'express-oauth2-jwt-bearer';
import User from '../models/userModel.js';
import dotenv from 'dotenv';
dotenv.config();

// Combines cookieToHeader + requireAuth in one middleware
export const requireAuth = (req, res, next) => {
  const token = req.cookies['access_token'];
  
  if (token) {
    req.headers.authorization = `Bearer ${token}`;
  }
  
  // Auth0 validation
  auth({
    audience: process.env.AUTH0_AUDIENCE,
    issuerBaseURL: `https://${process.env.AUTH0_DOMAIN}/`,
  })(req, res, next);
};



export const attachUser = async (req, res, next) => {
  try {
    const auth0Id = req.auth.payload.sub;
    const user = await User.findOne({ auth0Id });
    if (!user) return res.status(404).json({ error: 'User not found' });
    req.user = user;
    next();
  } catch (error) {
    return res.status(500).json({ error: 'Failed to attach user' });
  }
};


export const requireRole = (role) => (req, res, next) => {
  if (req.user.role !== role) {
    return res.status(403).json({ error: 'Access denied.' });
  }
  next();
};