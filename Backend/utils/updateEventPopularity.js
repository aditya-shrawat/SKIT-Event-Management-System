import Event from "../models/eventModel.js";
import Feedback from "../models/feedbackModel.js";
import Registration from "../models/registrationModel.js";



export const updateEventPopularity = async (eventId) => {
  try {
    const [likesCount, registrationsCount] = await Promise.all([
      Feedback.countDocuments({ eventId, reaction: "like" }),
      Registration.countDocuments({ eventId, status: "Registered" })
    ]);

    const popularityScore = likesCount + registrationsCount;

    await Event.findByIdAndUpdate(eventId, { popularityScore });
  } catch (error) {
    console.error('Error updating event popularity:', error);
  }
};