import mongoose, { Schema, Document } from 'mongoose';

// Define the Subscription schema
const subscriptionSchema = new Schema({
    subscriptionType: { type: String, enum: ['Pro', 'Premium', 'Free'], default: 'Free' },
    isExpired: { type: Boolean, default: false },
}, { timestamps: true });

// Define the interface for Subscription
interface ISubscription extends Document {
    subscriptionType: string;
    isExpired: boolean;
    maxApplicationCount: number;
    createdAt: Date;
    updatedAt: Date;
}

// Define the interface for Developer
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
    subscriptions: ISubscription[];
    appliedJobsCount: number;
    isVerified: boolean;
    isBlocked: boolean;
}

// Define the Developer schema
const DeveloperSchema: Schema = new Schema({
    name: { type: String, required: true },
    email: { type: String, required: true },
    phoneNo: { type: String },
    password: { type: String, required: true },
    image: { type: String, default: 'https://res.cloudinary.com/dsnq2yagz/image/upload/v1720757628/userIcon-removebg-preview_blkbxz_c_crop_w_330_h_330_dahy2o.png' },
    role: { type: String, default: '' },
    description: { type: String, default: '' },
    skills: { type: [String] },
    savedJobs: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Job' }],
    completedWorks: { type: [String] },
    // subscriptions: { 
    //     type: [subscriptionSchema], 
    //     default: () => [{
    //         subscriptionType: 'free',
    //         isExpired: false,
    //         createdAt: new Date(),
    //         updatedAt: new Date()
    //     }]
    // }
    appliedJobsCount: { type: Number, default: 0 },
    isVerified: { type: Boolean, default: false },
    isBlocked: { type: Boolean, default: false },
});

// Create the Developer model
const Developer = mongoose.model<IDeveloper>('Developer', DeveloperSchema);

export default Developer;
