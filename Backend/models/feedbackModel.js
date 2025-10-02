import mongoose from "mongoose";


const feedbackSchema = mongoose.Schema({
    eventId: { type: mongoose.Schema.Types.ObjectId, ref: "Event", required: true },
    userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    reaction: { type: String, required: true,
        enum: ["like", "dislike"], default: "like"
    },
},{timestamps:true,})


const Feedback = mongoose.model('Feedback',feedbackSchema) ;

export default Feedback ;