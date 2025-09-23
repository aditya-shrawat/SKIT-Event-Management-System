import express from 'express';
import { checkTokenAuthentication } from '../middleware/authMiddleware.js';
import { createNewEvent_admin, createNewEvent_student } from '../controllers/eventControllers.js';

const route = express.Router();

route.post("/new/admin",checkTokenAuthentication,createNewEvent_admin);
route.post("/new/student",checkTokenAuthentication,createNewEvent_student);


export default route;