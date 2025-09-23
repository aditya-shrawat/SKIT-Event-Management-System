import User from "../models/userModel.js";


export const searchUsers = async (req,res)=>{
    try {
        const {query} = req.query ;

        if(!query){
            return res.status(400).json({error:"Search query is required!"});
        }

        const users = await User.find({
            $or: [
                { name: { $regex: query, $options: "i" } },
                { collegeId: { $regex: query, $options: "i" } },
            ]
        }).select("name collegeId branch");

        return res.status(200).json({message:"Users found.",users});
    }catch (error) {
        return res.status(500).json({ error: "Internal server error" });
    }
}


export const searchAdmins = async (req,res)=>{
    try {
        const {query} = req.query ;

        if(!query){
            return res.status(400).json({error:"Search query is required!"});
        }

        const users = await User.find({
        role: "admin",
        $or: [
            { name: { $regex: query, $options: "i" } },
            { collegeId: { $regex: query, $options: "i" } },
        ],
        }).select("name collegeId branch");

        return res.status(200).json({message:"Users found.",users});
    }catch (error) {
        return res.status(500).json({ error: "Internal server error" });
    }
}
