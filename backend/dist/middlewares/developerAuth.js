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
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const envvariables_1 = require("../envVariables/envvariables");
const registationHelper_1 = require("../helper/registationHelper");
const developerSchema_1 = __importDefault(require("../models/developerSchema"));
const devAuthorization = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const token = req.cookies.accessToken;
    if (!token) {
        return res.status(401).json({ message: "Session expired please login" });
    }
    try {
        const tokenVerified = jsonwebtoken_1.default.verify(token, envvariables_1.accessTokenSecretKey);
        if (tokenVerified) {
            let isBlocked = yield isDeveloperBlocked(tokenVerified.data);
            if (isBlocked === false) {
                next();
            }
            else {
                return res.status(403).json({ message: 'user is blocked' });
            }
        }
    }
    catch (error) {
        if (error instanceof jsonwebtoken_1.default.TokenExpiredError) {
            let refreshToken = req.cookies.refreshToken;
            if (!refreshToken) {
                return res.status(401).send({ message: "Session expired please login" });
            }
            try {
                const refreshTokenVerified = jsonwebtoken_1.default.verify(refreshToken, envvariables_1.refreshTokenSecretKey);
                if (refreshTokenVerified) {
                    let isBlocked = yield isDeveloperBlocked(refreshTokenVerified.data);
                    if (isBlocked === false) {
                        const token = registationHelper_1.registerHelper.generateToken(refreshTokenVerified.data);
                        res.cookie("accessToken", token.accessToken, { httpOnly: true });
                        next();
                    }
                    else {
                        res.clearCookie('accessToken');
                        res.clearCookie('refreshToken');
                        return res.status(403).send('user is blocked');
                    }
                }
            }
            catch (refreshError) {
                return res.status(401).send({ message: "Session expired please login" });
            }
        }
        else {
            return res.status(401).send({ message: "Session expired please login" });
        }
    }
});
const isDeveloperBlocked = (data) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const developer = yield developerSchema_1.default.findOne({ name: data.name, email: data.email });
        return developer.isBlocked;
    }
    catch (error) {
        return false;
    }
});
exports.default = devAuthorization;
