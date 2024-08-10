import mongoose,{Schema} from 'mongoose'

const companySchema = new Schema({
    companyName:{type:String,required:true},
    companyType:{type:String},
    noOfEmployes:{type:String},
    email:{type:String,required:true},
    phoneNo:{type:String,required:true},
    password:{type:String,required:true},
    website:{type:String,default:''},
    overview:{type:String,default:''},
    specialties:{type:Array,default:[]},
    certificates:{type:Array,default:[]},
    image:{type:String,default:''},
    isVerified:{type:Boolean,default:false},
    isBlocked:{type:Boolean,default:false}
},{ timestamps: true })
const Company = mongoose.model('Company',companySchema)
export default Company