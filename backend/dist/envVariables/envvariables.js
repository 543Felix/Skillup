"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.refreshTokenSecretKey = exports.accessTokenSecretKey = exports.connectionString = exports.senderMailPassword = exports.senderMail = void 0;
const dotenv_1 = __importDefault(require("dotenv"));
dotenv_1.default.config();
let senderMail = process.env.Sender_Email;
exports.senderMail = senderMail;
let senderMailPassword = process.env.Sender_Mail_Password;
exports.senderMailPassword = senderMailPassword;
let connectionString = process.env.Mongoosse_Conection_String;
exports.connectionString = connectionString;
let accessTokenSecretKey = process.env.accessToken_Secret_Key;
exports.accessTokenSecretKey = accessTokenSecretKey;
let refreshTokenSecretKey = process.env.refreshToken_Secret_Key;
exports.refreshTokenSecretKey = refreshTokenSecretKey;
