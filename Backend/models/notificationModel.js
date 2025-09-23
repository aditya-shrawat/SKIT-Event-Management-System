import mongoose from "mongoose";

const notificationSchema = mongoose.Schema({
  sender: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  receiver: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  type: { 
    type: String, 
    enum: ['sub_admin_invitation', 'invitation_accepted', 'invitation_rejected','admin_invitation'],
    required: true 
  },
  eventId: { type: mongoose.Schema.Types.ObjectId, ref: 'Event' },
  message: {type:String,require:true},
  status: { 
    type: String, 
    enum: ['pending', 'accepted', 'rejected', 'seen'],
    default: 'pending' 
  },
},{timestamps:true,});


const Notification = mongoose.model('Notification',notificationSchema) ;

export default Notification ;
