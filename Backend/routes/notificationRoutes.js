import express from 'express'
import { checkTokenAuthentication } from '../middleware/authMiddleware.js';
import { allRecivedNotifications, updateNotificationStatus } from '../controllers/notificationControllers.js';

const route = express.Router();

route.get('/all',checkTokenAuthentication,allRecivedNotifications)
route.post('/:notificationId/seen',checkTokenAuthentication,updateNotificationStatus)


export default route ;

