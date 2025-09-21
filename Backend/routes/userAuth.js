import express from 'express';
import { handleSignUp } from '../controllers/userAuthController.js';

const route = express.Router();

route.post('/signup',handleSignUp);


export default route;