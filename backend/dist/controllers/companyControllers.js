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
exports.companyController = void 0;
const companySchema_1 = __importDefault(require("../models/companySchema"));
const bcrypt_1 = __importDefault(require("bcrypt"));
const registationHelper_1 = require("../helper/registationHelper");
const otpSchema_1 = __importDefault(require("../models/otpSchema"));
const mongodb_1 = require("mongodb");
const chatSchema_1 = __importDefault(require("../models/chatSchema"));
const registation = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { companyName, companyType, noOfEmployes, email, phoneNo, password } = req.body;
    try {
        const data = yield companySchema_1.default.find({ companyName: companyName });
        if (!data || data.length === 0) {
            const hashedPassword = yield bcrypt_1.default.hash(password, 10);
            yield new companySchema_1.default({ companyName, companyType, noOfEmployes, email, phoneNo, password: hashedPassword }).save();
            req.session.companySessionData = {
                companyName: companyName,
                email: email,
            };
            let otp = registationHelper_1.registerHelper.generateOtp();
            console.log('Companyotp = ', otp);
            const expirationTime = new Date(Date.now() + 60000);
            new otpSchema_1.default({
                otp: otp,
                name: companyName,
                expiration: expirationTime
            }).save();
            yield registationHelper_1.registerHelper.sendOTP(email, otp);
            return res.status(200).json({ message: "check your mail for otp", });
        }
        else {
            return res.status(400).json({ message: "user already exists" });
        }
    }
    catch (error) {
        res.json(error);
    }
});
const verifyRegistration = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const data = req.session.companySessionData;
    let otp = req.body.otp;
    try {
        if (data) {
            let name = data.companyName;
            let email = data.email;
            let hasOtp = yield otpSchema_1.default.find({ name: name });
            if (hasOtp[hasOtp.length - 1].otp === Number(otp)) {
                companySchema_1.default.findOneAndUpdate({ companyName: name, email: email }, { isVerified: true }).then((response) => __awaiter(void 0, void 0, void 0, function* () {
                    delete req.session.companySessionData;
                    const token = registationHelper_1.registerHelper.generateToken(data);
                    res.cookie('companyAcessToken', token.accessToken, { httpOnly: true });
                    res.cookie('comapnyRefreshToken', token.refreshToken, { httpOnly: true });
                    return res.status(200).json({ message: 'Rgisteration successfull', data: { _id: response === null || response === void 0 ? void 0 : response._id, image: response === null || response === void 0 ? void 0 : response.image, name: response === null || response === void 0 ? void 0 : response.companyName } });
                }));
            }
            else {
                return res.status(401).json({ message: 'invalid otp' });
            }
        }
    }
    catch (error) {
        res.status(500).json(error);
    }
});
const Login = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { name, password } = req.body;
    try {
        let data = yield companySchema_1.default.findOne({ companyName: name });
        if (data) {
            const { _id, image } = data;
            const isBlocked = yield companySchema_1.default.findOne({ companyName: name, isBlocked: true });
            if (isBlocked) {
                res.status(401).json({ message: 'user is blocked from the website' });
            }
            else {
                let passwordMatch = yield bcrypt_1.default.compare(password, data.password);
                if (passwordMatch) {
                    let { companyName, email } = data;
                    const token = registationHelper_1.registerHelper.generateToken({ companyName, email });
                    res.cookie('companyAccessToken', token.accessToken, { httpOnly: true });
                    res.cookie('companyRefreshToken', token.refreshToken, { httpOnly: true });
                    return res.status(200).json({ message: 'login successful', data: { _id, image, name: companyName } });
                }
                else {
                    return res.status(400).json({ message: 'incorrect name and password' });
                }
            }
        }
        else {
            return res.status(404).json({ message: 'user not found' });
        }
    }
    catch (error) {
        res.status(500).json(error);
    }
});
const logOut = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        res.clearCookie('companyAccessToken');
        res.clearCookie('companyRefreshToken');
        res.status(200).json({ message: 'logout sucessful' });
    }
    catch (error) {
        res.status(500).json(error);
    }
});
const profile = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { id } = req.query;
        const objectId = new mongodb_1.ObjectId(id);
        companySchema_1.default.findOne({ _id: objectId })
            .then((data) => {
            if (data) {
                const { _id, email, phoneNo, companyType, noOfEmployes, image, website, overview, specialties, certificates, isVerified } = data;
                const name = data === null || data === void 0 ? void 0 : data.companyName;
                res.status(200).json({ data: { _id, name, email, phoneNo, companyType, noOfEmployes, image, website, overview, specialties, certificates, isVerified } });
            }
            else {
                res.status(404).json({ mesage: 'no data in database' });
            }
        });
    }
    catch (error) {
        res.status(500).json(error);
    }
});
const uploadProfilePic = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { id } = req.query;
        const url = req.body.url;
        const objectId = new mongodb_1.ObjectId(String(id));
        yield companySchema_1.default.updateOne({ _id: objectId }, { image: url });
        companySchema_1.default.findOne({ _id: objectId }).then((data) => {
            res.status(200).json({ message: 'image updated', data });
        });
    }
    catch (error) {
        res.status(500).json(error);
    }
});
const updateProfileData = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { id } = req.query;
        const { name, email, phoneNo } = req.body.formData;
        const objectId = new mongodb_1.ObjectId(String(id));
        const data = yield companySchema_1.default.findOne({ _id: objectId });
        if (data) {
            companySchema_1.default.findOneAndUpdate({ _id: objectId }, { companyName: name, email: email, phoneNo: phoneNo }).then(() => {
                companySchema_1.default.findOne({ _id: objectId }).select({ name: 1, email: 1, phoneNo: 1, _id: 0 }).then((data) => {
                    res.status(200).json({ message: 'profile updated', data });
                });
            });
        }
        else {
            res.status(404).json({ message: 'data not found' });
        }
    }
    catch (error) {
        res.status(500).json({ error });
    }
});
const updateAbout = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { id } = req.query;
        const objectId = new mongodb_1.ObjectId(id);
        const { companyType, noOfEmployes, website, overview } = req.body.formData;
        const data = yield companySchema_1.default.findOne({ _id: objectId });
        if (data) {
            companySchema_1.default.findOneAndUpdate({ _id: objectId }, { companyType, noOfEmployes, website, overview })
                .then((data) => {
                res.status(200).json({ data });
            });
        }
        else {
            res.status(404).json({ message: 'data not found ' });
        }
    }
    catch (error) {
        res.status(500).json({ error });
    }
});
const updateSpecialties = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { id } = req.query;
        const objectId = new mongodb_1.ObjectId(id);
        const specialties = req.body.data;
        let data = yield companySchema_1.default.findOneAndUpdate({ _id: objectId }, { specialties: specialties });
        if (data) {
            res.status(200).json({ data: data.specialties });
        }
    }
    catch (error) {
        res.status(500).json({ error });
    }
});
const uploadCertificates = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { id } = req.query;
        const objectId = new mongodb_1.ObjectId(id);
        const { data } = req.body;
        const Data = yield companySchema_1.default.findOne({ _id: objectId });
        if (Data) {
            companySchema_1.default.findOneAndUpdate({ _id: objectId }, { certificates: data })
                .then((data) => {
                res.status(200).json({ data });
            });
        }
    }
    catch (error) {
        res.status(500).json({ error });
    }
});
const resendOtp = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const data = req.session.companySessionData;
        if (data) {
            let otp = registationHelper_1.registerHelper.generateOtp();
            console.log('otp = ', otp);
            new otpSchema_1.default({
                otp: otp,
                name: data.companyName
            }).save();
            registationHelper_1.registerHelper.sendOTP(data.email, otp).then(() => {
                res.status(200).json({ message: "check your mail for otp" });
            });
        }
    }
    catch (error) {
        res.status(500).json(error);
    }
});
//chats 
const getChats = (req, res) => {
    const { Id } = req.params;
    const objectId = new mongodb_1.ObjectId(Id);
    chatSchema_1.default.aggregate([{ $match: { senderId: objectId } }]);
};
exports.companyController = {
    registation,
    verifyRegistration,
    Login,
    logOut,
    profile,
    uploadProfilePic,
    updateProfileData,
    updateAbout,
    uploadCertificates,
    updateSpecialties,
    resendOtp
};
