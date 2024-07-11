"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = __importDefault(require("mongoose"));
// Define a sub-schema for individual notification content
const notificationContentSchema = new mongoose_1.default.Schema({
    content: {
        type: String,
        required: true
    },
    senderId: {
        type: mongoose_1.default.Schema.Types.ObjectId,
        required: true,
    },
    isViewed: {
        type: Boolean,
        default: false
    }
}, {
    timestamps: true
});
// Main notification schema
const notificationSchema = new mongoose_1.default.Schema({
    receiverId: {
        type: mongoose_1.default.Schema.Types.ObjectId,
        required: true
    },
    notifications: [notificationContentSchema] // Array of notifications
});
const Notification = mongoose_1.default.model('Notification', notificationSchema);
exports.default = Notification;
