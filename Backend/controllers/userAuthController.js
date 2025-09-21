import User from '../models/userModel.js';
import bcrypt from 'bcrypt' 
import  {createToken}  from '../services/authentication.js';


export const handleSignUp =async (req,res)=>{
    try {
        const {name,email,password,collegeId,branch,role} = req.body ;

        if(!name || !email || !password || !collegeId || !branch || !role){
            return res.status(400).json({error:"All fields are required."});
        }

        const hashedPassword = await bcrypt.hash(password,12) ;
    
        const newUser = await User.create({
            collegeId,
            email:email.toLowerCase(),
            password:hashedPassword,
            name,
            branch,
            role,
        })

        const token = createToken(newUser) ;
    
        return res.status(201).cookie('token',token,).json({message:"signup successfully."}) ;
    } catch (error) {
        console.error("Error during user signup:", error);
        return res.status(500).json({error:`something went wrong,try again later.`})
    }
}