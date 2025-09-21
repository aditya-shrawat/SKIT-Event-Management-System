import express from 'express';
import { handleSignin, handleSignUp } from '../controllers/userAuthController.js';

const route = express.Router();

route.post('/signup',handleSignUp);
route.post('/signin',handleSignin)


export default route;