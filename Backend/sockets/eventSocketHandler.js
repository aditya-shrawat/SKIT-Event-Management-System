import Event from "../models/eventModel.js";
import Notification from "../models/notificationModel.js";
import User from "../models/userModel.js";

export const eventSocketHandler = (io, socket) => {
  socket.on( "accept_subAdmin_invitation",
    async ({ eventId, userId, senderId }) => {
      try {
        // userId == who is accepting subadmin invite
        // senderId == who invited user as subadmin
        if (!eventId || !userId || !senderId) {
          socket.emit("error", { message: "Pass all required fields." });
          return;
        }

        const [event, user, sender] = await Promise.all([
          Event.findById(eventId).select(
            "name adminId pendingSubAdmins confirmedSubAdmins"
          ),
          User.findById(userId).select("name"),
          User.findById(senderId).select("_id"),
        ]);

        if (!event) {
          socket.emit("error", { message: "Event not found." });
          return;
        }
        if (!user) {
          socket.emit("error", { message: "User not found." });
          return;
        }
        if (!sender) {
          socket.emit("error", { message: "Sender not found." });
          return;
        }

        // only admin or confirmed sub-admins can invite
        const inviterIsAllowed =
          event.adminId?.toString?.() === senderId?.toString?.() ||
          event.confirmedSubAdmins?.some(
            (id) => id?.toString?.() === senderId?.toString?.()
          );
        if (!inviterIsAllowed) {
          socket.emit("error", {
            message: "Not authorized to invite sub-admins.",
          });
          return;
        }

        const exists = await Event.exists({
          _id: eventId,
          pendingSubAdmins: userId,
          confirmedSubAdmins: { $ne: userId },
        });
        if (!exists) {
          socket.emit("error", {
            message: "No invite found or already a Sub-Admin.",
          });
          return;
        }

        await Event.updateOne(
          { _id: eventId, pendingSubAdmins: userId },
          {
            $pull: { pendingSubAdmins: userId },
            $addToSet: { confirmedSubAdmins: userId },
          }
        );

        const updatedEvent = await Event.findById(eventId).select(
          "name adminId confirmedSubAdmins"
        );

        const sendNotification = async (receiverId,accepterId,accepterName ) => {
          // notification for accepter
          if (receiverId?.toString?.() === accepterId?.toString?.()){
            await Notification.create({
                sender: accepterId, // the accepter is the sender of this notification
                receiver: receiverId,
                type: "subAdmin_invitation_accepted",
                eventId,
                message: `You accepted Sub Admin invitaion for "${
                updatedEvent?.name ?? event.name
                }".`,
            });
          }
          else{
            await Notification.create({
                sender: accepterId, // the accepter is the sender of this notification
                receiver: receiverId,
                type: "subAdmin_invitation_accepted",
                eventId,
                message: `${accepterName} is now Sub Admin in "${
                updatedEvent?.name ?? event.name
                }".`,
            });
          }

          io.to(`user_${receiverId?.toString?.()}`).emit("new_notification", {
            type: "subAdmin_invitation_accepted",
            eventId: eventId?.toString?.(),
            message: `${accepterName} is now Sub Admin in "${
              updatedEvent?.name ?? event.name
            }".`,
          });
        };

        // notify admin
        await sendNotification(updatedEvent.adminId, userId, user.name);

        // notify confirmed sub-admins
        await Promise.all(
          (updatedEvent.confirmedSubAdmins || []).map((subAdminId) =>
            sendNotification(subAdminId, userId, user.name)
          )
        );

        socket.emit("accept_subAdmin_invitation:success", {
          eventId: eventId?.toString?.(),
          userId: userId?.toString?.(),
        });
      } catch (error) {
        console.log(
          "Error in accepting sub admin invitation.",
          error?.message || error
        );
        socket.emit("error", {
          message: "Failed to accept sub admin invitation.",
        });
      }
    }
  );


  socket.on("reject_subAdmin_invitation", async ({ eventId, userId, senderId }) => {
    try {
      // userId == who is rejecting subadmin invite
      // senderId == who invited user as subadmin
      if (!eventId || !userId || !senderId) {
        socket.emit("error", { message: "Pass all required fields." });
        return;
      }

      const [event, user, sender] = await Promise.all([
        Event.findById(eventId).select("name adminId pendingSubAdmins confirmedSubAdmins"),
        User.findById(userId).select("name"),
        User.findById(senderId).select("_id"),
      ]);

      if (!event) {
        socket.emit("error", { message: "Event not found." });
        return;
      }
      if (!user) {
        socket.emit("error", { message: "User not found." });
        return;
      }
      if (!sender) {
        socket.emit("error", { message: "Sender not found." });
        return;
      }

      // only admin or confirmed sub-admins can invite
      const inviterIsAllowed =
        event.adminId?.toString?.() === senderId?.toString?.() ||
        event.confirmedSubAdmins?.some(
          (id) => id?.toString?.() === senderId?.toString?.()
        );
      if (!inviterIsAllowed) {
        socket.emit("error", { message: "Not authorized to invite sub-admins." });
        return;
      }

      const exists = await Event.exists({
        _id: eventId,
        pendingSubAdmins: userId,
        confirmedSubAdmins: { $ne: userId },
      });
      if (!exists) {
        socket.emit("error", { message: "No invite found or already a Sub-Admin." });
        return;
      }

      const res = await Event.updateOne(
        { _id: eventId, pendingSubAdmins: userId },
        { $pull: { pendingSubAdmins: userId } }
      );

      const updatedEvent = await Event.findById(eventId).select(
        "name adminId confirmedSubAdmins"
      );

      // Notification helper
      const sendNotification = async (receiverId, rejectorId, rejectorName) => {
        if (receiverId?.toString() === rejectorId?.toString()) return;

        await Notification.create({
          sender: rejectorId, // the rejector is the sender
          receiver: receiverId,
          type: "subAdmin_invitation_rejected",
          eventId,
          message: `${rejectorName} rejected Sub Admin invitation for "${updatedEvent?.name ?? event.name}".`,
        });

        io.to(`user_${receiverId?.toString?.()}`).emit("new_notification", {
          type: "subAdmin_invitation_rejected",
          eventId: eventId?.toString?.(),
          message: `${rejectorName} rejected Sub Admin invitation for "${updatedEvent?.name ?? event.name}".`,
        });
      };

      // Notify admin
      await sendNotification(updatedEvent.adminId, userId, user.name);

      // Notify confirmed sub-admins
      await Promise.all(
        (updatedEvent.confirmedSubAdmins || []).map((subAdminId) =>
          sendNotification(subAdminId, userId, user.name)
        )
      );

      socket.emit("reject_subAdmin_invitation:success", {
        eventId: eventId?.toString?.(),
        userId: userId?.toString?.(),
      });
    } catch (error) {
      console.log("Error in rejecting sub admin invitation.", error?.message || error);
      socket.emit("error", { message: "Failed to reject sub admin invitation." });
    }
  });

// Admin approval and rejection
  socket.on( "approve_student_event",
    async ({ eventId, adminId, senderId }) => {
      try {
        // adminId == who is approving student event  (admin)
        // senderId == who requested event approval
        if (!eventId || !adminId || !senderId) {
          socket.emit("error", { message: "Pass all required fields." });
          return;
        }

        const [event, admin, sender] = await Promise.all([
          Event.findById(eventId),
          User.findById(adminId).select("name"),
          User.findById(senderId).select("_id"),
        ]);

        if (!event) {
          socket.emit("error", { message: "Event not found." });
          return;
        }
        if (!admin) {
          socket.emit("error", { message: "Admin not found." });
          return;
        }
        if (!sender) {
          socket.emit("error", { message: "Sender not found." });
          return;
        }

        // only admin or confirmed sub-admins can invite
        const isAdmin = event.assignedAdmin?.toString() === adminId?.toString()
        if (!isAdmin) {
          socket.emit("error", {
            message: "Not authorized to approve student events.",
          });
          return;
        }

        if (event.moderationStatus !== "PENDING") {
            socket.emit("error", { message: "Event already processed." });
            return;
        }

        const exists = await Event.exists({
          _id: eventId,
          submittedBy: senderId,
          assignedAdmin:adminId
        });
        if (!exists) {
          socket.emit("error", {
            message: "No event found.",
          });
          return;
        }

        await Event.updateOne(
          { _id: eventId, submittedBy: senderId },
          {
            $addToSet: { confirmedSubAdmins: senderId },
            moderationStatus: "APPROVED",
            reviewedBy: adminId,
            reviewedAt: new Date(),
          }
        );

        const updatedEvent = await Event.findById(eventId).lean();

        const sendNotification = async (receiverId,approverId,approverName ) => {
          // notification for accepter
          if (receiverId?.toString() === approverId?.toString()){
            await Notification.create({
                sender: approverId, // the approver is the sender of this notification
                receiver: receiverId,
                type: "approved_student_event",
                eventId,
                message: `You approved the event "${
                updatedEvent?.name ?? event.name
                }".`,
            });
          }
          else{
            await Notification.create({
                sender: approverId, // the approver is the sender of this notification
                receiver: receiverId,
                type: "approved_student_event",
                eventId,
                message: `${approverName} approved the event "${
                updatedEvent?.name ?? event.name
                }".`,
            });
          }

          io.to(`user_${receiverId?.toString?.()}`).emit("new_notification", {
            type: "approved_student_event",
            eventId: eventId?.toString?.(),
            message: `${approverName} approved the event "${
              updatedEvent?.name ?? event.name
            }".`,
          });
        };

        // notify sub-admin who requested event approval
        await sendNotification(updatedEvent.submittedBy, adminId, admin.name);
        //notify admin
        await sendNotification(updatedEvent.adminId, adminId, admin.name);

        socket.emit("approve_student_event:success", {
          eventId: eventId?.toString?.(),
          adminId: admin?.toString?.(),
        });
      } catch (error) {
        console.log(
          "Error in approving student event.",
          error?.message || error
        );
        socket.emit("error", {
          message: "Failed to approve student event.",
        });
      }
    }
  );


  socket.on( "reject_student_event",
    async ({ eventId, adminId, senderId }) => {
        try {
        // adminId == who is rejecting student event  (admin)
        // senderId == who requested event approval
        if (!eventId || !adminId || !senderId) {
            socket.emit("error", { message: "Pass all required fields." });
            return;
        }

        const [event, admin, sender] = await Promise.all([
            Event.findById(eventId),
            User.findById(adminId).select("name"),
            User.findById(senderId).select("_id"),
        ]);

        if (!event) {
            socket.emit("error", { message: "Event not found." });
            return;
        }
        if (!admin) {
            socket.emit("error", { message: "Admin not found." });
            return;
        }
        if (!sender) {
            socket.emit("error", { message: "Sender not found." });
            return;
        }

        // only admin can reject
        const isAdmin = event.assignedAdmin?.toString() === adminId?.toString()
        if (!isAdmin) {
            socket.emit("error", {
            message: "Not authorized to reject student events.",
            });
            return;
        }

        if (event.moderationStatus !== "PENDING") {
            socket.emit("error", { message: "Event already processed." });
            return;
        }

        const exists = await Event.exists({
            _id: eventId,
            submittedBy: senderId,
            assignedAdmin: adminId
        });
        if (!exists) {
            socket.emit("error", {
            message: "No event found.",
            });
            return;
        }

        await Event.updateOne(
            { _id: eventId, submittedBy: senderId },
            {
            moderationStatus: "REJECTED",
            reviewedBy: adminId,
            reviewedAt: new Date(),
            }
        );

        const updatedEvent = await Event.findById(eventId).lean();

        const sendNotification = async (receiverId, approverId, approverName ) => {
            // notification for rejector
            if (receiverId?.toString() === approverId?.toString()) return;
            
            await Notification.create({
                sender: approverId, // the rejector is the sender of this notification
                receiver: receiverId,
                type: "rejected_student_event",
                eventId,
                message: `${approverName} rejected the event "${
                updatedEvent?.name ?? event.name
                }".`,
            });

            io.to(`user_${receiverId?.toString?.()}`).emit("new_notification", {
            type: "rejected_student_event",
            eventId: eventId?.toString?.(),
            message: `${approverName} rejected the event "${
                updatedEvent?.name ?? event.name
            }".`,
            });
        };

        // notify student who requested event approval
        await sendNotification(updatedEvent.submittedBy, adminId, admin.name);
        //notify admin
        await sendNotification(updatedEvent.adminId, adminId, admin.name);

        socket.emit("reject_student_event:success", {
            eventId: eventId?.toString?.(),
            assignedAdmin: admin?.toString?.(),
        });
        } catch (error) {
        console.log(
            "Error in rejecting student event.",
            error?.message || error
        );
        socket.emit("error", {
            message: "Failed to reject student event.",
        });
        }
    }
  );
};
