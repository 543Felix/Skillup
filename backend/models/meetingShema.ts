import mongoose from 'mongoose'

const meetingSchema = new mongoose.Schema({
    roomId:{type:String,required:true},
    createdBy:{type:String,required:true},
    callDuration:{type:String},
    members:{type:Array},
    isCallEnded:{type:Boolean,default:false}
},{timestamps:true})

const Meeting = mongoose.model('Meeting',meetingSchema)

export default Meeting  