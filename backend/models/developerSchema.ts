import mongoose, { Schema, Document } from 'mongoose';

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
    completedWorks?: string[];
    subscriptionType:string,
    appliedJobsCount:number
    isVerified: boolean;
    isBlocked: boolean;
}

const DeveloperSchema: Schema<IDeveloper> = new Schema({
    name: { type: String, required: true },
    email: { type: String, required: true },
    phoneNo: { type: String },
    password: { type: String, required: true },
    image: { type: String, default: '' },
    role: { type: String, default: '' },
    description: { type: String, default: '' },
    skills: { type: [String] },
    savedJobs: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Job' }],
    completedWorks: { type: [String] },
    subscriptionType:{type:String,enum:['Free','Pro','Premium'],default:'Free'},
    appliedJobsCount:{type:Number,default:0},
    isVerified: { type: Boolean, default: false },
    isBlocked: { type: Boolean, default: false },
});

const Developer = mongoose.model<IDeveloper>('Developer', DeveloperSchema);

export default Developer;
