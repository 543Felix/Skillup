"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const developerSchema_1 = __importDefault(require("../models/developerSchema"));
const companySchema_1 = __importDefault(require("../models/companySchema"));
const mongodb_1 = require("mongodb");
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const dotenv_1 = __importDefault(require("dotenv"));
const fs_1 = __importDefault(require("fs"));
const path_1 = __importDefault(require("path"));
dotenv_1.default.config();
const generateTokenForJass = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { id, role } = req.query;
    const objectId = new mongodb_1.ObjectId(id);
    const data = role === 'dev' ? yield developerSchema_1.default.findOne({ _id: objectId }) : yield companySchema_1.default.findOne({ _id: objectId });
    if (data) {
        const { _id, image, email } = data;
        let name;
        if (role === 'dev' && data.name) {
            name = data.name;
        }
        else if (role === 'company' && data.companyName) {
            name = data.companyName;
        }
        else {
            throw new Error('Invalid data provided');
        }
        const api_key = process.env.Jass_Api_Key;
        const appId = process.env.Jass_App_Id;
        const privateKeyPath = process.env.Jass_private_Key_path;
        const privateKey = fs_1.default.readFileSync(path_1.default.resolve(__dirname, privateKeyPath), 'utf8');
        const generate = (privateKey, { id, name, email, avatar, appId }) => {
            const now = new Date();
            const signOptions = {
                algorithm: 'RS256',
                header: { kid: api_key, alg: 'RS256' }
            };
            const payload = {
                aud: 'jitsi',
                context: {
                    user: {
                        id,
                        name,
                        avatar,
                        email: email,
                        moderator: 'true'
                    },
                    features: {
                        livestreaming: 'true',
                        recording: 'true',
                        transcription: 'true',
                        "outbound-call": 'true'
                    }
                },
                iss: 'chat',
                room: '*',
                sub: appId,
                exp: Math.round(now.setHours(now.getHours() + 3) / 1000),
                nbf: (Math.round((new Date).getTime() / 1000) - 10)
            };
            const Jwt = jsonwebtoken_1.default.sign(payload, privateKey, signOptions);
            return Jwt;
        };
        const token = generate(privateKey, {
            id: String(_id),
            name: name,
            email: email,
            avatar: image,
            appId: appId,
        });
        res.status(200).json({ token });
    }
});
exports.default = generateTokenForJass;
