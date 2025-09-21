import mongoose from 'mongoose'

const UserSchema = mongoose.Schema({
    collegeId: {
        type: String,
        required: true,
        unique: true,
        lowercase: true
    },
    name: { 
        type: String, 
        required: true 
    },
    email:{
        type:String,required:true,unique:true,lowercase: true 
    },
    collegeName: {
        type: String,
        required: true,
        default: "SKIT"
    },
    password: {  
        type: String,
        required: true
    },
    branch: {
        type: String,
        required: true
    },
    role: {
        type: String,
        enum: ['student', 'admin'],
        default: 'student'
    }
},{timestamps:true,});

const User = mongoose.model('User',UserSchema) ;

export default User ;


