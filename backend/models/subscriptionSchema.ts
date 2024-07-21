import mongoose from 'mongoose'
import { ObjectId } from 'mongodb'

const subscriptionSchema = new mongoose.Schema({
    developerId:{type:ObjectId,ref:'Developer',required:true},
    subscriptionType:{type:String,enum:['pro','premium']},
    expired:{type:Boolean,default:false},
    applliedJobsCount:{type:Number,default:0}
},{
    timestamps:true
})

const Subscription = mongoose.model('Subscription',subscriptionSchema)
export default Subscription