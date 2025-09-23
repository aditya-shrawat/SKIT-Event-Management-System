import mongoose from "mongoose";


const eventSchema = mongoose.Schema({
    name: { type: String, required: true },
    shortDescription: { type: String, required: true },
    details: { type: String, required: true },
    capacity: { type: Number, default: 50 },
    image: { type: String },
    eventDate: { type: Date, required: true },
    eventStartTime: { type: String, required: true },
    eventEndTime: { type: String, required: true },

    adminId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    confirmedSubAdmins: [{ type: mongoose.Schema.Types.ObjectId, ref: "User" }],
    pendingSubAdmins: [{ type: mongoose.Schema.Types.ObjectId, ref: "User" }],

    category: { type: String, required: true },
    venue: { type: String, required: true },
    club: { type: String, required: true },

    eventMode: { type: String, enum: ["Online", "Offline", "Hybrid"], default: "offline" },
    status: { type: String, enum: ["upcoming", "completed", "cancelled"], default: "upcoming" },

    moderationStatus: { type: String, enum: ["PENDING", "APPROVED", "REJECTED"], default: "PENDING" },
    submittedBy: { type: mongoose.Schema.Types.ObjectId, ref: "User" },          // student creator
    assignedAdmin: { type: mongoose.Schema.Types.ObjectId, ref: "User" },        // reviewer admin chosen by student
    reviewedBy: { type: mongoose.Schema.Types.ObjectId, ref: "User" },           // admin who approved/rejected
    reviewedAt: { type: Date },
},{timestamps:true,})


const Event = mongoose.model('Event',eventSchema) ;

export default Event ;