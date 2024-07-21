"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = __importStar(require("mongoose"));
// Define the Subscription schema
const subscriptionSchema = new mongoose_1.Schema({
    subscriptionType: { type: String, enum: ['Pro', 'Premium', 'Free'], default: 'Free' },
    isExpired: { type: Boolean, default: false },
}, { timestamps: true });
// Define the Developer schema
const DeveloperSchema = new mongoose_1.Schema({
    name: { type: String, required: true },
    email: { type: String, required: true },
    phoneNo: { type: String },
    password: { type: String, required: true },
    image: { type: String, default: 'https://res.cloudinary.com/dsnq2yagz/image/upload/v1720757628/userIcon-removebg-preview_blkbxz_c_crop_w_330_h_330_dahy2o.png' },
    role: { type: String, default: '' },
    description: { type: String, default: '' },
    skills: { type: [String] },
    savedJobs: [{ type: mongoose_1.default.Schema.Types.ObjectId, ref: 'Job' }],
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
const Developer = mongoose_1.default.model('Developer', DeveloperSchema);
exports.default = Developer;
