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
const companySchema_1 = __importDefault(require("../models/companySchema"));
const companyAuthorization = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const token = req.cookies.companyAccessToken;
    if (!token) {
        return res.status(401).send({ message: 'Token not provided' });
    }
    try {
        const tokenVerified = jsonwebtoken_1.default.verify(token, envvariables_1.accessTokenSecretKey);
        if (tokenVerified) {
            let isBlocked = yield isCompanyBlocked(tokenVerified);
            if (isBlocked === false) {
                next();
            }
            else {
                res.clearCookie('companyAccessToken');
                res.clearCookie('companyRefreshToken');
                return res.status(403).json({ message: 'user is blocked' });
            }
        }
    }
    catch (error) {
        if (error instanceof jsonwebtoken_1.default.TokenExpiredError) {
            let refreshToken = req.cookies.companyRefreshToken;
            if (!refreshToken) {
                return res.status(401).send({ message: 'Refresh token not provided' });
            }
            try {
                const refreshTokenVerified = jsonwebtoken_1.default.verify(refreshToken, envvariables_1.refreshTokenSecretKey);
                if (refreshTokenVerified) {
                    let isBlocked = yield isCompanyBlocked(refreshTokenVerified);
                    if (isBlocked === false) {
                        const token = registationHelper_1.registerHelper.generateToken(refreshTokenVerified.data);
                        res.cookie('companyAccessToken', token.accessToken, { httpOnly: true });
                        next();
                    }
                    else {
                        res.clearCookie('companyAccessToken');
                        res.clearCookie('companyRefreshToken');
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
const isCompanyBlocked = (data) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const company = yield companySchema_1.default.findOne({ companyName: data.data.companyName, email: data.data.email });
        return company.isBlocked;
    }
    catch (error) {
        return true;
    }
});
exports.default = companyAuthorization;
