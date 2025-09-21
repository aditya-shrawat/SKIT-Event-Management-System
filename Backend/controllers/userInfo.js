import User from "../models/userModel.js";



export const fetchUserInfo = async (req,res)=>{
    try {
        const userId = req.user._id;
        const user = await User.findById(userId).select('name collegeId branch email role collegeName');
        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }

        return res.status(200).json({message:"User fetched.",user});
    } catch (error) {
        console.log("Error fetching user info:", error);
        return res.status(500).json({ message: "Internal server error" });
    }
};