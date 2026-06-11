import mongoose from "mongoose";
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
            submittedBy: user._id,           // admin himself is the submitter for his created events
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
        const {eventId} = req.body;

        if(!eventId) return res.status(400).json({error:"Event ID is required."})
        
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
            // userSemester : semester,
            registeredAt: new Date()
        });

        await Notification.create({
            sender: userId, // the registrant is the sender of this notification
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

        const events = await Event.find({ adminId: userId, moderationStatus: "APPROVED" }).select('name shortDescription image adminId category eventDate eventStartTime eventEndTime venue club')
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



export const getEventAnalytics = async (req, res) => {
  try {
    const { eventId } = req.params;
    const userId = req.user._id;
    const userRole = req.user.role;

    const event = await Event.findById(eventId).select(
      "name shortDescription image category eventDate eventStartTime eventEndTime venue club submittedBy moderationStatus capacity adminId confirmedSubAdmins"
    );

    if (!event) {
      return res.status(404).json({ error: "Event not found." });
    }

    const isAuthorized =
      userRole === "admin" && event.adminId.equals(userId) ||
      event.confirmedSubAdmins?.some(id => id.equals(userId));

    if (!isAuthorized) {
      return res.status(403).json({ error: "Access denied." });
    }

    // get registered students
    const registrations = await Registration.aggregate([
      { $match: { eventId: new mongoose.Types.ObjectId(eventId) } },
      {
        $lookup: {
          from: "users",
          localField: "userId",
          foreignField: "_id",
          as: "user",
        },
      },
      { $unwind: "$user" },
      {
        $project: {
          _id: 0,
          name: "$user.name",
          collegeId: "$user.collegeId",
          branch: "$user.branch",
          registrationDate: "$createdAt",
          // semester: "$user.semester",
        },
      },
      { $sort: { registrationDate: -1 } },
    ]);


    const branchWiseCount = {};
    registrations.forEach((stu) => {
      if (stu.branch) {
        branchWiseCount[stu.branch] = (branchWiseCount[stu.branch] || 0) + 1;
      }
    });

    return res.status(200).json({
      eventDetails: event,
      analytics: {
        totalCapacity: event.capacity,
        totalRegisteredUsers: registrations.length,
        branchWiseCount,
        registeredStudents: registrations,
      },
    });

  } catch (error) {
    console.error("Error fetching event analytics:", error);
    return res.status(500).json({ error: "Internal server error." });
  }
};


// diffs old vs new subadmins
export const diffSubAdmins = (event, confirmedSubAdmins) => {
    const existingConfirmed = event.confirmedSubAdmins.map(id => id.toString());
    const existingPending = event.pendingSubAdmins.map(id => id.toString());
    const incomingIds = confirmedSubAdmins.map(id => id.toString());
    const alreadyProcessed = new Set([...existingConfirmed, ...existingPending]);

    return {
        newSubAdmins: incomingIds.filter(id => !alreadyProcessed.has(id)),
        removedSubAdmins: existingConfirmed.filter(id => !incomingIds.includes(id)),
    };
};

// sends new subadmin invitations
export const sendSubAdminInvitations = async (io, newSubAdmins, updatedEvent, userId) => {
    if (newSubAdmins.length === 0) return;

    await Notification.insertMany(newSubAdmins.map(subAdminId => ({
        sender: userId,
        receiver: subAdminId,
        type: "sub_admin_invitation",
        eventId: updatedEvent._id,
        message: `You have been invited as a sub-admin for the event "${updatedEvent.name}".`,
        status: "unseen",
        isArchived: false,
    })));

    newSubAdmins.forEach(subAdminId => {
        io.to(`user_${subAdminId}`).emit("new_notification", {
            type: "sub_admin_invitation",
            eventId: updatedEvent._id,
            eventName: updatedEvent.name,
            message: `You have been invited as a sub-admin for "${updatedEvent.name}".`,
        });
    });
};

// notifies all participants about the event update 
export const notifyEventUpdate = async (io, updatedEvent, userId, previousEventName, eventId) => {
    const registeredUserIds = (await Registration.distinct("userId", { eventId })).map(id => id.toString());
    const subAdminIds = updatedEvent.confirmedSubAdmins.map(id => id.toString());

    const recipientIds = [
        ...new Set([...registeredUserIds, ...subAdminIds])
    ].filter(id => id !== userId.toString());

    if (recipientIds.length === 0) return;

    const notificationMessage = `"${previousEventName}" event details have been updated. Check the latest information.`;

    await Notification.insertMany(recipientIds.map(receiverId => ({
        sender: userId,
        receiver: receiverId,
        type: "event_updated",
        eventId: updatedEvent._id,
        message: notificationMessage,
        status: "unseen",
    })));

    recipientIds.forEach(receiverId => {
        io.to(`user_${receiverId}`).emit("event_updated", {
            eventId: updatedEvent._id,
            eventName: updatedEvent.name,
            message: notificationMessage,
            updatedAt: new Date(),
        });
    });
};

export const updateEvent = async (req, res) => {
    try {
        const { eventId } = req.params;
        const userId = req.user._id;

        const event = await Event.findById(eventId);
        if (!event) return res.status(404).json({ message: "Event not found" });

        if (event.adminId.toString() !== userId.toString()) {
            return res.status(403).json({ message: "Access denied. Only the event admin can update this event." });
        }

        const previousEventName = event.name;

        const restrictedFields = ["adminId", "pendingSubAdmins", "submittedBy", "assignedAdmin", "reviewedBy", "reviewedAt", "moderationStatus", "popularityScore", "status"];
        const updateData = { ...req.body };
        restrictedFields.forEach((field) => delete updateData[field]);

        // validation
        if (updateData.eventDate && new Date(updateData.eventDate) < new Date()) {
            return res.status(400).json({ message: "Event date cannot be set to a past date." });
        }
        if (updateData.eventMode && !["Online", "Offline", "Hybrid"].includes(updateData.eventMode)) {
            return res.status(400).json({ message: "Invalid event mode. Must be Online, Offline, or Hybrid." });
        }
        if (updateData.capacity !== undefined && updateData.capacity <= 0) {
            return res.status(400).json({ message: "Capacity must be a positive number." });
        }

        // build update query
        const { confirmedSubAdmins, ...restUpdateData } = updateData;
        const updateQuery = { $set: restUpdateData };

        let newSubAdmins = [];
        if (confirmedSubAdmins !== undefined) {
            const { newSubAdmins: _new, removedSubAdmins } = diffSubAdmins(event, confirmedSubAdmins);
            newSubAdmins = _new;

            if (removedSubAdmins.length > 0) updateQuery.$pull = { confirmedSubAdmins: { $in: removedSubAdmins } };
            if (newSubAdmins.length > 0) updateQuery.$addToSet = { pendingSubAdmins: { $each: newSubAdmins } };

            delete updateQuery.$set.confirmedSubAdmins;
        }

        const updatedEvent = await Event.findByIdAndUpdate(eventId, updateQuery, { new: true, runValidators: true });

        await Promise.all([
            sendSubAdminInvitations(req.io, newSubAdmins, updatedEvent, userId),
            notifyEventUpdate(req.io, updatedEvent, userId, previousEventName, eventId),
        ]);

        return res.status(200).json({ message: "Event updated successfully.", data: updatedEvent });

    } catch (error) {
        return res.status(500).json({ message: "Internal server error.", error: error.message });
    }
};


export const deleteEvent = async (req, res) => {
  try {
    const { eventId } = req.params;
    const requestingUserId = req.user._id;

    const event = await Event.findById(eventId);
    if (!event) {
      return res.status(404).json({
        message: "Event not found.",
      });
    }

    if (event.adminId.toString() !== requestingUserId.toString()) {
      return res.status(403).json({
        message: "Access denied. Only the event admin can delete this event.",
      });
    }

    const registeredStudentIds = await Registration.distinct("userId", { eventId });

    const allRecipientIds = [
      ...new Set([
        ...event.confirmedSubAdmins,
        ...event.pendingSubAdmins,
        ...registeredStudentIds,
      ].map((id) => id.toString())) 
    ];

    await Promise.all([
      Registration.deleteMany({ eventId }),
      Event.findByIdAndDelete(eventId),
      Notification.deleteMany({ eventId })
    ]);

    // notifications 
    if (allRecipientIds.length > 0) {
      const notifications = allRecipientIds.map((recipientId) => ({
        sender: requestingUserId,
        receiver: recipientId,        
        type: "event_deleted",        
        eventId,
        message: `The event "${event.name}" has been deleted by the admin.`,
        status: "unseen",
        isArchived: false,
      }));

      await Notification.insertMany(notifications);
    }

    // real-time socket notifications
    const io = req.io;
    const basePayload = {
      type: "EVENT_DELETED",
      eventId,
      eventName: event.name,
      deletedAt: new Date(),
    };

    event.confirmedSubAdmins.forEach((subAdminId) => {
      io.to(`user_${subAdminId.toString()}`).emit("event_deleted", {
        ...basePayload,
        message: `The event "${event.name}" you were managing has been deleted.`,
      });
    });

    event.pendingSubAdmins.forEach((subAdminId) => {
      io.to(`user_${subAdminId.toString()}`).emit("event_deleted", {
        ...basePayload,
        message: `The event "${event.name}" you had a pending invitation for has been deleted.`,
      });
    });

    registeredStudentIds.forEach((studentId) => {
      io.to(`user_${studentId.toString()}`).emit("event_deleted", {
        ...basePayload,
        message: `The event "${event.name}" you registered for has been deleted.`,
      });
    });

    return res.status(200).json({
      message: "Event deleted successfully."
    });

  } catch (error) {
    console.error("deleteEvent error:", error);
    return res.status(500).json({
      message: "Internal server error while deleting the event.",
    });
  }
};