"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = __importDefault(require("mongoose"));
const meetingSchema = new mongoose_1.default.Schema({
    roomId: { type: String, required: true },
    createdBy: { type: String, required: true },
    callDuration: { type: String },
    members: { type: Array },
    isCallEnded: { type: Boolean, default: false }
}, { timestamps: true });
const Meeting = mongoose_1.default.model('Meeting', meetingSchema);
exports.default = Meeting;
