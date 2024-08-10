import { ObjectId } from 'mongodb'
import mongoose from 'mongoose'

const proposalSchema = new mongoose.Schema({
    jobId:{type:ObjectId,required:true,ref:'Job'},
    developerId:{type:ObjectId,required:true,ref:'Developer'},
    coverLetter:{type:String,required:true},
    resume:{type:String,required:true},
    score:{type:Number},
    status:{type:String,enum:['rejected','selectd','shortListed','send'],default:'send' }
},{timestamps:true})

const  Proposal = mongoose.model('Proposal',proposalSchema)

export default Proposal