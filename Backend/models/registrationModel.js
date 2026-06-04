import mongoose from "mongoose";


const registrationSchema = mongoose.Schema({
    eventId: { type: mongoose.Schema.Types.ObjectId, ref: "Event", required: true },

    userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },  // who is registring
    // userSemester: { type: String, required: true },

    registeredAt: { type: String, required: true },
    status: { type: String, enum: ["Registered", "Waitlist", "Cancelled"], default: "Registered" },
},{timestamps:true,})


const Registration = mongoose.model('Registration',registrationSchema) ;

export default Registration ;