import { ObjectId } from "mongodb";
import mongoose,{Schema} from "mongoose";

const slotSchema = new Schema({
    job_id:{type:ObjectId,required:true,ref:'Job'},
    Date:{type:Date,required:true},
    time:{type:String,required:true},
    isAvailable: { type: Boolean, default: true }
})

const Slot = mongoose.model('Slot',slotSchema)

export default Slot