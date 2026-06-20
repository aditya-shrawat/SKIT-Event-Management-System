import mongoose from 'mongoose'

const UserSchema = mongoose.Schema({
    auth0Id:   { 
        type: String, required: true, unique: true 
    },
    collegeId: {
        type: String,
        required: true,
        unique: true,
        uppercase: true,
        trim: true
    },
    name: { 
        type: String, 
        required: true 
    },
    email:{
        type:String,required:true,unique:true,lowercase: true,trim: true 
    },
    // collegeName: {
    //     type: String,
    //     required: true,
    //     default: "SKIT"
    // },
    semester: {
        type: String,
        required: function() { return this.role === 'student'; },
    },
    branch: {
        type: String,
        enum: ["CSE", "IT", "ECE", "EE", "ME", "CE", "AI", "DS", "IOT"],
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


