import express from 'express';
import { attachUser, requireAuth } from '../middleware/authMiddleware.js';
import { createNewEvent_admin, createNewEvent_student, deleteEvent, fetchEventDetails, getAllEvent_requests, getAllEvents_admin, getAllEvents_subAdmin, getAllRegisteredEvents, getEventAnalytics, registerForEvent, registrationStatusOfEvent, updateEvent } from '../controllers/eventControllers.js';

const route = express.Router();

route.post("/new/admin",requireAuth, attachUser,createNewEvent_admin);
route.post("/new/student",requireAuth, attachUser,createNewEvent_student);

route.get("/registered-events",requireAuth, attachUser,getAllRegisteredEvents);
route.get("/admin/my-events",requireAuth, attachUser,getAllEvents_admin);
route.get("/sub-admin/my-events",requireAuth, attachUser,getAllEvents_subAdmin);
route.get("/event-requests",requireAuth, attachUser,getAllEvent_requests);

route.get("/:eventId/analytics",requireAuth, attachUser,getEventAnalytics);

route.get("/:eventId/details",fetchEventDetails);

route.post("/:eventId/registration",requireAuth, attachUser,registerForEvent);
route.get("/:eventId/registration/status",requireAuth, attachUser,registrationStatusOfEvent);

route.patch("/:eventId/update",requireAuth, attachUser,updateEvent);
route.patch("/:eventId/delete",requireAuth, attachUser,deleteEvent);


export default route;