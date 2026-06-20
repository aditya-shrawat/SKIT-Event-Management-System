import express from 'express'
import { attachUser, requireAuth } from '../middleware/authMiddleware.js';
import { allRecivedNotifications, updateNotificationStatus } from '../controllers/notificationControllers.js';

const route = express.Router();

route.get('/all',requireAuth, attachUser,allRecivedNotifications)
route.post('/:notificationId/seen',requireAuth, attachUser,updateNotificationStatus)


export default route ;

