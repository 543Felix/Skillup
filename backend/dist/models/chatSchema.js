"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = __importDefault(require("mongoose"));
const chatSchema = new mongoose_1.default.Schema({
    senderId: {
        type: mongoose_1.default.Schema.Types.ObjectId,
        required: true,
        refPath: 'senderModel'
    },
    receiverId: {
        type: mongoose_1.default.Schema.Types.ObjectId,
        required: true,
        refPath: 'receiverModel'
    },
    senderModel: {
        type: String,
        required: true,
        enum: ['developers', 'companies']
    },
    receiverModel: {
        type: String,
        required: true,
        enum: ['developers', 'companies']
    },
    content: {
        type: String,
        required: true
    },
    isViewed: {
        type: Boolean,
        default: false
    },
}, { timestamps: true });
const Chat = mongoose_1.default.model('Chat', chatSchema);
exports.default = Chat;
