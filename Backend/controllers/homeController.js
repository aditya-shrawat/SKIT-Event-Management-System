import Event from "../models/eventModel.js";



export const fetchHomeFeed = async (req,res)=>{
    try {
        const events = await Event.find({}).select('name shortDescription image category eventDate eventStartTime eventEndTime venue club')
        .sort({ createdAt: -1 }).lean();

        return res.status(200).json({message:"Home feed fetched successfully.",events});
    } catch (error) {
        console.log("Error in fetching home feed - ",error);
        return res.status(500).json({error:"Internal server error."})
    }
}