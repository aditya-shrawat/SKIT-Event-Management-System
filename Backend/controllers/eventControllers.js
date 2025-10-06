import Event from "../models/eventModel.js";
import Feedback from "../models/feedbackModel.js";
import Notification from "../models/notificationModel.js";
import Registration from "../models/registrationModel.js";
import User from "../models/userModel.js";
import { updateEventPopularity } from "../utils/updateEventPopularity.js";


// admin new event
export const createNewEvent_admin = async (req,res)=>{
    try {
        const {name, shortDescription, details, capacity, image,eventDate, eventStartTime, eventEndTime, category, venue, club, eventMode, status,selectedSubAdmins } = req.body;

        if(!name || !details || !shortDescription || !eventDate || !eventStartTime || !eventEndTime || !category || !venue || !club || !eventMode){
            return res.status(400).json({error:"All fields are required!"})
        }

        const user = req.user;
        if(user.role !== 'admin'){
            return res.status(401).json({error:"Only admins are allowed."})
        }

        const newEvent = await Event.create({
            name,shortDescription,details,capacity,image,
            eventDate,eventStartTime,eventEndTime,
            category, venue,club,eventMode,status,

            adminId : user._id,
            pendingSubAdmins:selectedSubAdmins,
            
            moderationStatus: "APPROVED",
            reviewedBy: user._id,
            reviewedAt: new Date(),
        });

        // Notify all selected sub-admins
        if (selectedSubAdmins && selectedSubAdmins.length > 0) {
            for (const subAdminId of selectedSubAdmins) {
                const notif = await Notification.create({
                    sender: user._id,
                    receiver: subAdminId,
                    type: "sub_admin_invitation",
                    eventId: newEvent._id,
                    message: `You have been invited as a sub-admin for the event "${newEvent.name}".`,
                });

                // Emit socket notification to each sub-admin
                req.io.to(`user_${subAdminId}`).emit("new_notification", notif);
            }
        }

        // Emit socket event for admin
        req.io.to(`user_${user._id}`).emit("new_event_created", {
            newEvent,
            message: "New event created.",
        });

        return res.status(201).json({message:"Event created successfully.",newEvent});
    } catch (error) {
        console.log("Error in creating new event (Admin) :- ",error)
        return res.status(500).json({error:"Internal server error."});
    }
}


// student new event
export const createNewEvent_student = async (req,res)=>{
    try {
        const {name, shortDescription, details, capacity, image,eventDate, eventStartTime, eventEndTime, category, venue, club, eventMode, status,selectedAdmin } = req.body;

        if(!name || !details || !shortDescription || !eventDate || !eventStartTime || !eventEndTime || !category || !venue || !club || !eventMode){
            return res.status(400).json({error:"All fields are required!"})
        }
        if(!selectedAdmin){
            return res.status(400).json({error:"Select a faculty (Admin)."})
        }

        const user = req.user;
        if(user.role !== 'student'){
            return res.status(401).json({error:"Only students are allowed."})
        }

        const adminUser = await User.findById(selectedAdmin).select("_id role");
        if (!adminUser || adminUser.role !== "admin") {
        return res.status(400).json({ error: "Selected faculty is invalid." });
        }

        const newEvent = await Event.create({
            name,shortDescription,details,capacity,image,
            eventDate,eventStartTime,eventEndTime,
            category,venue,club,eventMode,status,

            adminId: selectedAdmin,
            
            moderationStatus: "PENDING",
            submittedBy: user._id,           // student
            assignedAdmin: selectedAdmin,
        });

        // Notify the selected admin
        if (selectedAdmin) {
            const notif = await Notification.create({
                sender: user._id,
                receiver: selectedAdmin,
                type: "admin_invitation",
                eventId: newEvent._id,
                message: `A student submitted a new event "${newEvent.name}" for your review.`,
            });

            req.io.to(`user_${selectedAdmin}`).emit("new_notification", notif);
        }

        // notify the student that their event was created
        req.io.to(`user_${user._id}`).emit("new_event_created", {
            newEvent,
            message: "Your event has been submitted successfully.",
        });

        return res.status(201).json({message:"Event created successfully.",newEvent});
    } catch (error) {
        console.log("Error in creating new event (student) :- ",error)
        return res.status(500).json({error:"Internal server error."});
    }
}

export const fetchEventDetails = async (req,res)=>{
    try {
        const eventId = req.params.eventId;

        if(!eventId) return res.status(400).json({error:"Event Id is required."})

        const event = await Event.findById(eventId)
        .select('name shortDescription details capacity image eventDate eventStartTime eventEndTime adminId category venue club eventMode status submittedBy moderationStatus confirmedSubAdmins')
        .populate("adminId","_id name branch role")
        .populate("confirmedSubAdmins", "_id name branch role")
        .lean();
        if(!event) return res.status(404).json({error:"Event not found."})

        return res.status(200).json({message:"Event details fetched successfully.",event});
    } catch (error) {
        console.log("Error in fetching event details - ",error);
        return res.status(500).json({error:"Internal server error."})
    }
}


export const registerForEvent = async (req,res)=>{
    try {
        const {phone,semester,eventId} = req.body;

        if(!phone || !semester || !eventId) return res.status(400).json({error:"All fields are required."})
        
        const event = await Event.findById(eventId);
        if(!event) return res.status(404).json({error:"Event not found."})

        const userId = req.user._id;
        if(userId.toString()===event.adminId?.toString()) return res.status(400).json({error:"Admin cann't register for the event."})

        if ( event.confirmedSubAdmins?.some(id => id.toString() === userId.toString()) ) 
            return res.status(400).json({ error: "Sub-admins can't register for this event." });

        const alreadyRegistered = await Registration.findOne({ eventId, userId });
        if (alreadyRegistered) return res.status(400).json({ error: "You have already registered for this event." });

        const isPast = (date) => new Date(date).setHours(0, 0, 0, 0) < new Date().setHours(0, 0, 0, 0);
        if (isPast(event.eventDate)) return res.status(400).json({ error: "Registration closed. Event already ended." });

        const registration = await Registration.create({
            eventId: eventId,
            userId : userId,
            userPhone : phone,
            userSemester : semester,
            registeredAt: new Date()
        });

        await Notification.create({
            sender: userId, // the rejector is the sender of this notification
            receiver: userId,
            type: "registration_successful",
            eventId,
            message: `You have successfully registered for the event "${event.name}".`,
        });

        updateEventPopularity(eventId).catch(err => console.error(err));
        return res.status(200).json({message:"Registration successful."});
    } catch (error) {
        console.log("Error while registration - ",error);
        return res.status(500).json({error:"Internal server error."})
    }
}


export const registrationStatusOfEvent = async (req, res) => {
  try {
    const { eventId } = req.params;
    const userId = req.user._id;

    if (!eventId) {
      return res.status(400).json({ error: "Event ID is required." });
    }

    const event = await Event.findById(eventId);
    if (!event) return res.status(404).json({ error: "Event not found." });

    if (userId.toString() === event.adminId?.toString()) return res.status(200).json({ status: "Admin", message: "You are the admin of this event." });

    if (event.confirmedSubAdmins?.some(id => id.toString() === userId.toString())) 
      return res.status(200).json({ status: "Sub-admin", message: "You are a sub-admin of this event." });

    const registration = await Registration.findOne({ eventId, userId });
    if (registration) return res.status(200).json({ status: registration.status, message: "You are registered for this event." });

    return res.status(200).json({ status: "not-registered", message: "You have not registered for this event." });
  } catch (error) {
    console.log("Error while checking event registration status - ", error);
    return res.status(500).json({ error: "Internal server error." });
  }
};


export const toggleLikeEvent = async (req, res) => {
  try {
    const { eventId } = req.params;
    const userId = req.user._id;

    if (!eventId) return res.status(400).json({ error: "Event ID is required." });

    const event = await Event.findById(eventId);
    if (!event) return res.status(404).json({ error: "Event not found." });

    const existing = await Feedback.findOne({ eventId, userId });

    if (existing && existing.reaction === "like") {
        await Feedback.deleteOne({ _id: existing._id });

        updateEventPopularity(eventId).catch(err => console.error(err));
        return res.status(200).json({ message: "Like removed.", isLiked: false });
    } 
    else {
        const feedback = await Feedback.findOneAndUpdate(
            { eventId, userId },
            { reaction: "like" },
            { new: true, upsert: true, setDefaultsOnInsert: true }
        );

        updateEventPopularity(eventId).catch(err => console.error(err));
        return res.status(200).json({ message: "Event liked.", isLiked: true });
    }
  } catch (error) {
    console.log("Error in toggling like - ", error);
    return res.status(500).json({ error: "Internal server error." });
  }
};


export const getFeedbackStatus = async (req, res) => {
  try {
    const { eventId } = req.params;
    const userId = req.user._id;

    if (!eventId) return res.status(400).json({ error: "Event ID is required." });

    const event = await Event.findById(eventId);
    if (!event) return res.status(404).json({ error: "Event not found." });

    const feedback = await Feedback.findOne({ eventId, userId });

    return res.status(200).json({
      isLiked: !!(feedback && feedback.reaction === "like"),
    });
  } catch (error) {
    console.log("Error while fetching feedback status - ", error);
    return res.status(500).json({ error: "Internal server error." });
  }
};


export const getAllRegisteredEvents = async (req, res, next) => {
    try {
        const userId = req.user._id;

        if(req.user.role !=='student'){
            return res.status(401).json({error:"Only registered students are allowed."})
        }

        const registeredEvents = await Registration.find({ userId })
        .select('eventId status createdAt')
        .populate({
            path: 'eventId',
            select: 'name shortDescription image category eventDate eventStartTime eventEndTime venue club',
            options: { lean: true },
        })
        .sort({ createdAt: -1 })
        .lean();

        return res.status(200).json({message: 'Registered events fetched successfully.',registeredEvents});
    } catch (error) {
        console.log('Error in fetching registered events - ', error);
        return res.status(500).json({ error: 'Internal server error.' });
    }
};


export const getAllEvents_admin = async (req,res)=>{
    try {
        const userId = req.user._id;

        if(req.user.role !=='admin'){
            return res.status(401).json({error:"Only admins are allowed."})
        }

        const events = await Event.find({ adminId: userId }).select('name shortDescription image category eventDate eventStartTime eventEndTime venue club')
        .sort({ createdAt: -1 }).lean();

        return res.status(200).json({message:"Admin events fetched successfully.",events});
    } catch (error) {
        console.log("Error in fetching admins events - ",error);
        return res.status(500).json({error:"Internal server error."})
    }
}


export const getAllEvents_subAdmin = async (req, res) => {
  try {
    const userId = req.user._id;

    if (req.user.role !== "student") {
      return res.status(401).json({ error: "Only sub admins are allowed." });
    }

    // fetch only events where this user is a confirmed sub admin
    const events = await Event.find({
        $or: [
            { confirmedSubAdmins: userId },
            { submittedBy: userId }
        ]
      })
      .select(
        "name shortDescription image category eventDate eventStartTime eventEndTime venue club submittedBy moderationStatus"
      )
      .sort({ createdAt: -1 })
      .lean();

    return res.status(200).json({
      message: "Sub-admin events fetched successfully.",
      events,
    });
  } catch (error) {
    console.log("Error in fetching sub-admin events - ", error);
    return res.status(500).json({ error: "Internal server error." });
  }
};


export const getAllEvent_requests = async (req, res) => {
  try {
    const adminId = req.user._id;

    if (req.user.role !== "admin") {
      return res.status(401).json({ error: "Only admins are allowed." });
    }

    const events = await Event.find({
      $and: [
        {
          $or: [
            { assignedAdmin: adminId },
            { adminId: adminId }
          ]
        },
        { submittedBy: { $exists: true, $ne: null } }  // exclude admin-created events
      ]
    })
      .select(
        "name shortDescription image category eventDate eventStartTime eventEndTime venue club adminId submittedBy moderationStatus confirmedSubAdmins"
      )
      .sort({ createdAt: -1 })
      .populate("submittedBy", "name email role")
      .lean();

    return res.status(200).json({
      message: "Admins event requests fetched successfully.",
      events,
    });
  } catch (error) {
    console.log("Error in fetching event requests - ", error);
    return res.status(500).json({ error: "Internal server error." });
  }
};


export const getPopularEvents = async (req, res) => {
  try {
    const popularEvents = await Event.find({ 
      popularityScore: { $gt: 0 },
      eventDate: { $gte: new Date() }
    })
    .sort({ popularityScore: -1 })
    .limit(50)
    .select('name shortDescription image category eventDate eventStartTime eventEndTime venue club popularityScore')
    .lean();

    return res.status(200).json({
      message: "Popular events fetched successfully.",
      popularEvents,
    });
  } catch (error) {
    console.error("Error fetching popular events:", error);
    return res.status(500).json({ error: "Internal server error." });
  }
};
