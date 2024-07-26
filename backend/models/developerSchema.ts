import mongoose, { Schema, Document } from 'mongoose';

interface Subscription{
    planName: 'Free' | 'Pro' | 'Premium',
    startDate:Date,
    endDate:Date,
    isExpired:boolean
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
    completedWorks?: string[];
    subscriptions:Subscription[]|undefined,
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
    subscriptions:{type:Array},
    appliedJobsCount:{type:Number,default:0},
    isVerified: { type: Boolean, default: false },
    isBlocked: { type: Boolean, default: false },
});

const Developer = mongoose.model<IDeveloper>('Developer', DeveloperSchema);

export default Developer;
