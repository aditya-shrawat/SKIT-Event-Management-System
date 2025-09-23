import Event from "../models/eventModel.js";
import Notification from "../models/notificationModel.js";
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