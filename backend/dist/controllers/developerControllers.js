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
exports.developerController = void 0;
const developerSchema_1 = __importDefault(require("../models/developerSchema"));
const mongodb_1 = require("mongodb");
const bcrypt_1 = __importDefault(require("bcrypt"));
const registationHelper_1 = require("../helper/registationHelper");
const otpSchema_1 = __importDefault(require("../models/otpSchema"));
const stripe_1 = __importDefault(require("stripe"));
// import Proposal from "../models/proposalSchema";
const dotenv_1 = __importDefault(require("dotenv"));
dotenv_1.default.config();
const stripe = new stripe_1.default(process.env.stripe_Secret_Key);
const Registration = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { firstName, lastName, email, phoneNo, password } = req.body;
    const name = firstName + ' ' + lastName;
    try {
        let data = yield developerSchema_1.default.findOne({ name: name });
        if (data) {
            return res.status(400).json({ message: "user already exists" });
        }
        else {
            const hashedPassword = yield bcrypt_1.default.hash(password, 10);
            yield new developerSchema_1.default({
                name: name,
                email: email,
                phoneNo: phoneNo,
                password: hashedPassword,
            }).save();
            req.session.developersessionData = {
                name: name,
                email: email
            };
            let otp = registationHelper_1.registerHelper.generateOtp();
            console.log('otp = ', otp);
            yield new otpSchema_1.default({
                otp: otp,
                name: name
            }).save();
            registationHelper_1.registerHelper.sendOTP(email, otp).then(() => {
                res.status(200).json({ message: "check your mail for otp" });
            });
        }
    }
    catch (error) {
        res.status(500).json(error);
    }
});
const registerWithGoogle = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { name, email, password } = req.body;
        const Data = yield developerSchema_1.default.findOne({ name: name });
        if (!Data) {
            new developerSchema_1.default({
                name: name,
                email: email,
                password: password
            }).save()
                .then(() => {
                developerSchema_1.default.findOne({ name: name }).then((devData) => {
                    if (devData) {
                        const { name, email, _id, image } = devData;
                        const token = registationHelper_1.registerHelper.generateToken({ name, email });
                        res.cookie('accessToken', token.accessToken, { httpOnly: true });
                        res.cookie('refreshToken', token.refreshToken, { httpOnly: true });
                        return res.status(200).json({ message: 'Registeration successfull', data: { _id, image } });
                    }
                });
            });
        }
        else {
            res.status(400).json({ message: 'user Already exists' });
        }
    }
    catch (error) {
        res.status(500).json(error);
    }
});
const verifyRegistration = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const data = req.session.developersessionData;
    try {
        if (data) {
            let name = data.name;
            let email = data.email;
            let hasOtp = yield otpSchema_1.default.findOne({ name: name });
            if ((hasOtp === null || hasOtp === void 0 ? void 0 : hasOtp.otp) === Number(req.body.otp)) {
                let devData = yield developerSchema_1.default.findOneAndUpdate({ name: name, email: email }, { isVerified: true });
                if (devData) {
                    let { _id, image, name } = devData;
                    delete req.session.developersessionData;
                    const token = registationHelper_1.registerHelper.generateToken(data);
                    res.cookie('accessToken', token.accessToken, { httpOnly: true });
                    res.cookie('refreshToken', token.refreshToken, { httpOnly: true });
                    return res.status(200).json({ message: 'Rgisteration successfull', data: { _id, image, name } });
                }
                else {
                    res.status(404).json({ message: 'user verification failed' });
                }
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
        const data = yield developerSchema_1.default.find({ name: name });
        if (data.length > 0) {
            const passwordMatch = yield bcrypt_1.default.compare(password, data[0].password);
            if (passwordMatch) {
                let { name, email, _id, image } = data[0];
                const token = registationHelper_1.registerHelper.generateToken({ name, email });
                res.cookie('accessToken', token.accessToken, { httpOnly: true });
                res.cookie('refreshToken', token.refreshToken, { httpOnly: true });
                return res.status(200).json({ message: 'login successful', data: { name, email, _id, image } });
            }
            else {
                return res.status(401).json({ message: 'password and userName are incorrect' });
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
const logOut = (req, res) => {
    try {
        res.clearCookie('accessToken');
        res.clearCookie('refreshToken');
        res.status(200).json({ message: 'logOut sucessful' });
    }
    catch (error) {
        res.status(500).json(error);
    }
};
const uploadProfilePic = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { id } = req.query;
    const url = req.body.url;
    const objectId = new mongodb_1.ObjectId(String(id));
    yield developerSchema_1.default.updateOne({ _id: objectId }, { image: url });
    developerSchema_1.default.findOne({ _id: objectId }).then((data) => {
        res.status(200).json({ message: 'image updated', data });
    }).catch((error) => {
        res.status(500).json(error);
    });
});
const profile = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { id } = req.query;
        const objectId = new mongodb_1.ObjectId(String(id));
        let data = yield developerSchema_1.default.findOne({ _id: objectId });
        if (data) {
            res.status(200).json({ data });
        }
        else {
            res.status(404).json({ message: 'No valid data' });
        }
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
        let data = yield developerSchema_1.default.findOne({ _id: objectId });
        if (data) {
            developerSchema_1.default.findOneAndUpdate({ _id: objectId }, { name: name, email: email, phoneNo: phoneNo }).then(() => {
                developerSchema_1.default.findOne({ _id: objectId }).select({ name: 1, email: 1, phoneNo: 1, _id: 0 }).then((data) => {
                    res.status(200).json({ message: 'profile updated', data });
                });
            });
        }
    }
    catch (error) {
        res.status(500).json(error);
    }
});
const updateRoleandDescription = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { id } = req.query;
        const { role, description } = req.body.data;
        const objectId = new mongodb_1.ObjectId(id);
        const data = yield developerSchema_1.default.findOneAndUpdate({ _id: objectId }, { role: role, description: description });
        if (data) {
            return res.status(200).json({ message: 'role and describtion updated', data });
        }
        else {
            return res.status(404).json({ message: 'updataion failed' });
        }
    }
    catch (error) {
        res.status(500).json(error);
    }
});
const updateSkills = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const skills = req.body.data;
        const { id } = req.query;
        const objectId = new mongodb_1.ObjectId(id);
        const data = yield developerSchema_1.default.findOneAndUpdate({ _id: objectId }, { skills: skills });
        if (data) {
            res.status(200).json({ message: 'skills updated', data: data.skills });
        }
        else {
            res.status(404).json({ message: 'skills updation failed' });
        }
    }
    catch (error) {
        res.status(500).json(error);
    }
});
const resendOtp = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const data = req.session.developersessionData;
        const cookieData = req.cookies.registrationData;
        if (data) {
            let otp = registationHelper_1.registerHelper.generateOtp();
            console.log('otp = ', otp);
            yield new otpSchema_1.default({
                otp: otp,
                name: data.name
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
const HandleSubscription = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { subscriptionType, devId } = req.body;
        // const line_items =
        const session = yield stripe.checkout.sessions.create({
            payment_method_types: ['card'],
            line_items: [
                {
                    price_data: {
                        currency: 'usd',
                        product_data: {
                            name: subscriptionType.mode, // or another appropriate property
                        },
                        unit_amount: Math.round(subscriptionType.price * 100),
                    },
                    quantity: 1,
                },
            ],
            mode: 'payment',
            success_url: 'http://localhost:5173/dev/payment-success',
            cancel_url: 'http://localhost:5173/dev/payment-error',
        });
        if (session.id) {
            developerSchema_1.default.findOneAndUpdate({ _id: new mongodb_1.ObjectId(devId) }, { subscriptionType: subscriptionType.mode, appliedJobsCount: 0 })
                .then(() => {
                res.json({ id: session.id });
            });
        }
    }
    catch (error) {
    }
});
exports.developerController = {
    Registration,
    verifyRegistration,
    Login,
    logOut,
    uploadProfilePic,
    profile,
    updateProfileData,
    updateRoleandDescription,
    updateSkills,
    resendOtp,
    registerWithGoogle,
    HandleSubscription,
};
