import express from 'express';
import { checkTokenAuthentication } from '../middleware/authMiddleware.js';
import { createNewEvent_admin, createNewEvent_student, fetchEventDetails, registerForEvent, registrationStatusOfEvent } from '../controllers/eventControllers.js';

const route = express.Router();

route.post("/new/admin",checkTokenAuthentication,createNewEvent_admin);
route.post("/new/student",checkTokenAuthentication,createNewEvent_student);

route.get("/:eventId/details",fetchEventDetails);
route.post("/:eventId/registration",checkTokenAuthentication,registerForEvent);
route.get("/:eventId/registration/status",checkTokenAuthentication,registrationStatusOfEvent);


export default route;