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
const companySchema = new mongoose_1.Schema({
    companyName: { type: String, required: true },
    companyType: { type: String },
    noOfEmployes: { type: String },
    email: { type: String, required: true },
    phoneNo: { type: String, required: true },
    password: { type: String, required: true },
    website: { type: String, default: '' },
    overview: { type: String, default: '' },
    specialties: { type: Array, default: [] },
    certificates: { type: Array, default: [] },
    image: { type: String, default: 'https://res.cloudinary.com/dsnq2yagz/image/upload/v1723824322/pdq9gbcco6l8mp1tjtvv.png' },
    isVerified: { type: Boolean, default: false },
    isBlocked: { type: Boolean, default: false }
}, { timestamps: true });
const Company = mongoose_1.default.model('Company', companySchema);
exports.default = Company;
