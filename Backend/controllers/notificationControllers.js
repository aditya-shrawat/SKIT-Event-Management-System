import Notification from '../models/notificationModel.js';

export const allRecivedNotifications = async (req, res) => {
  try {
    const user = req.user;

    if (!user) {
      return res.status(403).json({ error: "You are not authrized." });
    }

    const notifications = await Notification.find({ receiver: user._id,outcome:'pending' })  // only outcome==='pending notif. , bcs its for invitation notif. 
      .populate({ path: 'sender', select: 'name collegeId' }) 
      .populate({ path: 'receiver', select: 'name collegeId' }) 
      .populate({ path: 'eventId', select: 'name' }) 
      .sort({ createdAt: -1 }).lean();

    return res.status(200).json({
      count: notifications.length,
      notifications
    });
  } catch (error) {
    console.log("Error in fetching recived notifications - ", error);
    return res.status(500).json({ error: "Internal server error." });
  }
};


export const updateNotificationStatus = async (req,res)=>{
    try {
        const {status} = req.body.status ?? "seen";
        const notificationId = req.params.notificationId ;

        if(!notificationId) return res.status(400).json({error:"Notification Id is required."})
        
        const notification = await Notification.findById(notificationId);
        if(!notification) return res.status(404).json({error:"Notification not found."});

        notification.status = status;
        // only for invitation type notification , to soft delete them
        if(notification.type==='sub_admin_invitation' || notification.type==='admin_invitation'){
            notification.outcome = 'seen';
        }
        await notification.save();

        return res.status(200).json({message:"Notification status get updated."})
    } catch (error) {
        console.log("Error in updating notification status - ", error);
        return res.status(500).json({ error: "Internal server error." });
    }
}