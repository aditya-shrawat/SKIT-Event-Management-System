import mongoose from "mongoose";

const notificationSchema = mongoose.Schema({
  sender: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  receiver: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  type: { 
    type: String, 
    enum: ['sub_admin_invitation', 'subAdmin_invitation_accepted', 'subAdmin_invitation_rejected','admin_invitation','approved_student_event','rejected_student_event'],
    required: true 
  },
  eventId: { type: mongoose.Schema.Types.ObjectId, ref: 'Event' },
  message: {type:String,require:true},
  status: { 
    type: String, 
    enum: ['unseen', 'seen'],
    default: 'unseen' 
  },
  outcome:{ // for invitation type notification , to soft delete them
    type:String,
    enum:['pending','seen'],
    default:'pending'
  }
},{timestamps:true,});


const Notification = mongoose.model('Notification',notificationSchema) ;

export default Notification ;
