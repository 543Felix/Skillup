import mongoose, { Schema, Document } from 'mongoose';

interface Subscription{
    planName: 'Free' | 'Pro' | 'Premium',
    startDate:Date,
    endDate:Date,
    isExpired:boolean
}
 
interface workExperience{
    companyName:string;
    role:string;
    startDate:string;
    endDate:string;
}

interface Certificate {
    url:string,
    certificateName:string
}

interface IDeveloper extends Document {
    name: string;
    email: string;
    phoneNo?: string;
    password: string;
    image?: string;
    role?: string;
    description?: string;
    skills?: string[];
    savedJobs?: mongoose.Types.ObjectId[];
    qualification:string
    certificates:Certificate[]|undefined
    subscriptions:Subscription[]|undefined,
    appliedJobsCount:number;
    appliedJobs?:mongoose.Types.ObjectId[]
    resume:string;
    isVerified: boolean;
    isBlocked: boolean;
    workExperience?:Array<workExperience>,
    createdAt:Date,
    updatedAt:Date
}

const workExperienceSchema:Schema<workExperience> = new Schema({
    companyName:{type:String,required:true},
    role:{type:String,required:true},
    startDate:{type:String,required:true},
    endDate:{type:String,required:true},
})


const DeveloperSchema: Schema<IDeveloper> = new Schema({
    name: { type: String, required: true },
    email: { type: String, required: true },
    phoneNo: { type: String },
    password: { type: String, required: true },
    image: { type: String, default: '' },
    role: { type: String, default: '' },
    description: { type: String, default: '' },
    qualification:{type:String},
    skills: { type: [String] },
    savedJobs: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Job' }],
    subscriptions:{type:Array},
    certificates:{type:Array},
    workExperience:{type:[workExperienceSchema]},
    resume:{type:String},
    appliedJobsCount:{type:Number,default:0},
    appliedJobs:[{ type: mongoose.Schema.Types.ObjectId, ref: 'Job' }],
    isVerified: { type: Boolean, default: false },
    isBlocked: { type: Boolean, default: false },
},{ timestamps: true });

const Developer = mongoose.model<IDeveloper>('Developer', DeveloperSchema);

export default Developer;
