import express from 'express';
import { getMe, handleSignin, handleSignUp, logout } from '../controllers/userAuthController.js';
import { attachUser, requireAuth } from '../middleware/authMiddleware.js';

const route = express.Router();

route.post('/signup',handleSignUp);
route.post('/signin',handleSignin);
route.get('/me', requireAuth, attachUser,getMe)
route.post('/logout',logout)


export default route;