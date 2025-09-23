import express from 'express'
import { checkTokenAuthentication } from '../middleware/authMiddleware.js';
import { searchAdmins, searchUsers } from '../controllers/searchControllers.js';

const route = express.Router();

route.get('/global-users',checkTokenAuthentication,searchUsers)
route.get('/admin',checkTokenAuthentication,searchAdmins)


export default route ;

