"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = __importDefault(require("mongoose"));
const mongodb_1 = require("mongodb");
const subscriptionSchema = new mongoose_1.default.Schema({
    developerId: { type: mongodb_1.ObjectId, ref: 'Developer', required: true },
    subscriptionType: { type: String, enum: ['pro', 'premium'] },
    expired: { type: Boolean, default: false },
    applliedJobsCount: { type: Number, default: 0 }
}, {
    timestamps: true
});
const Subscription = mongoose_1.default.model('Subscription', subscriptionSchema);
exports.default = Subscription;
