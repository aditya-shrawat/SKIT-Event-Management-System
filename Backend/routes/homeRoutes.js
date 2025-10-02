import express from 'express';
import { checkTokenAuthentication } from '../middleware/authMiddleware.js';
import { fetchHomeFeed } from '../controllers/homeController.js';

const route = express.Router();

route.get("/feed",checkTokenAuthentication,fetchHomeFeed);


export default route;