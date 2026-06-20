import express from 'express'
import { attachUser, requireAuth } from '../middleware/authMiddleware.js';
import { searchAdmins, searchUsers } from '../controllers/searchControllers.js';

const route = express.Router();

route.get('/global-users',requireAuth, attachUser,searchUsers)
route.get('/admin',requireAuth, attachUser,searchAdmins)


export default route ;

