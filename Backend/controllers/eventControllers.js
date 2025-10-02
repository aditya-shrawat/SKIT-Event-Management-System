import Event from "../models/eventModel.js";
import Notification from "../models/notificationModel.js";
import Registration from "../models/registrationModel.js";
import User from "../models/userModel.js";


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
        .select('name shortDescription details capacity image eventDate eventStartTime eventEndTime adminId category venue club eventMode status')
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
