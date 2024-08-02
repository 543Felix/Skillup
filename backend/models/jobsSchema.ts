import { ObjectId } from 'mongodb'
import mongoose,{Schema} from 'mongoose'



const jobSchema = new Schema({
   companyId :{type:ObjectId,required:true,ref:'Company'},
   jobTitle:{type:String,required:true},
   length:{type:String,required:true},
   workingHoursperWeek:{type:String,required:true},
   description:{type:String,required:true},
   qualification:{type:String,required:true},
   experienceLevel:{type:String,required:true},
   responsibilities:{type:String,required:true},
   skills:{type:Array,required:true},
   Quiz:{type:Object,default:{}},
   salary:{type:String,required:true},
  quizAttendedDevs: {
    type: [mongoose.Schema.Types.ObjectId],
    ref: 'Developer',
    default: []
  },
   createdAt:{type:Date,required:true},
   status:{type:String,enum:['open','closed'],default:'closed'}
})

const Job =  mongoose.model('Job',jobSchema)
export default Job