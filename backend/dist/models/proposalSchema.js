"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const mongodb_1 = require("mongodb");
const mongoose_1 = __importDefault(require("mongoose"));
const proposalSchema = new mongoose_1.default.Schema({
    jobId: { type: mongodb_1.ObjectId, required: true, ref: 'Job' },
    developerId: { type: mongodb_1.ObjectId, required: true, ref: 'Developer' },
    coverLetter: { type: String, required: true },
    resume: { type: String, required: true },
    score: { type: Number },
    status: { type: String, enum: ['rejected', 'selectd', 'shortListed', 'send'], default: 'send' }
}, { timestamps: true });
const Proposal = mongoose_1.default.model('Proposal', proposalSchema);
exports.default = Proposal;
