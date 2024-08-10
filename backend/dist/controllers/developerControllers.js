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
// import Meeting from '../models/meetingShema'
const node_cron_1 = __importDefault(require("node-cron"));
const dotenv_1 = __importDefault(require("dotenv"));
dotenv_1.default.config();
const cloudinary_1 = __importDefault(require("../helper/cloudinary"));
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
            const startDate = new Date();
            let endDate = new Date(startDate);
            endDate.setDate(endDate.getDate() + 28);
            yield new developerSchema_1.default({
                name: name,
                email: email,
                phoneNo: phoneNo,
                password: hashedPassword,
                subscriptions: [
                    {
                        planName: 'Free',
                        startDate: startDate,
                        endDate: endDate,
                        isExpired: false
                    }
                ]
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
            const startDate = new Date();
            let endDate = new Date(startDate);
            endDate.setDate(endDate.getDate() + 28);
            new developerSchema_1.default({
                name: name,
                email: email,
                password: password,
                subscriptions: [
                    {
                        planName: 'Free',
                        startDate: startDate,
                        duration: endDate,
                        isExpired: false
                    }
                ]
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
const isBlocked = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { id } = req.params;
    const developer = yield developerSchema_1.default.findOne({ _id: new mongodb_1.ObjectId(id) });
    res.status(200).json({ isBlocked: developer === null || developer === void 0 ? void 0 : developer.isBlocked });
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
// Profile 
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
        const { role, description, qualification } = req.body.data;
        const objectId = new mongodb_1.ObjectId(id);
        const data = yield developerSchema_1.default.findOneAndUpdate({ _id: objectId }, { role: role, description: description, qualification: qualification });
        if (data) {
            return res.status(200).json({ message: 'role and describtion updated' });
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
const getWorkExperience = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { id } = req.params;
    developerSchema_1.default.aggregate([
        { $match: { _id: new mongodb_1.ObjectId(id) } },
        {
            $addFields: {
                workExperience: {
                    $map: {
                        input: {
                            $sortArray: {
                                input: "$workExperience",
                                sortBy: {
                                    startDate: -1
                                }
                            }
                        },
                        as: "we",
                        in: "$$we"
                    }
                }
            }
        }, {
            $project: { _id: 0, workExperience: 1 }
        }
    ])
        .then((data) => {
        res.status(200).json({ workExperience: data[0].workExperience });
    });
});
const addWorkExpirence = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { id, workData } = req.body;
    const { companyName, role, startDate, endDate } = workData;
    developerSchema_1.default.findOneAndUpdate({ _id: new mongodb_1.ObjectId(id) }, {
        $push: { workExperience: { companyName, role, startDate, endDate } }
    }, {
        new: true
    }).then((data) => {
        res.status(200).json({ data });
    }).catch(() => {
        res.status(404).json({ message: 'user not found' });
    });
});
const deleteWorkExperience = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { id, workId } = req.params;
    developerSchema_1.default.findOneAndUpdate({ _id: new mongodb_1.ObjectId(id) }, {
        $pull: { workExperience: { _id: new mongodb_1.ObjectId(workId) } }
    }).then(() => {
        res.status(200).json({ messsage: 'work experience deleted successfully' });
    })
        .catch(() => {
        res.status(500).json({ messsage: 'An error occured while updating' });
    });
});
const updateWorkExperience = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { id, workData } = req.body;
    let data = yield developerSchema_1.default.updateOne({ _id: new mongodb_1.ObjectId(id), "workExperience._id": new mongodb_1.ObjectId(workData._id) }, { $set: { "workExperience.$": workData } });
    if (data) {
        res.status(200).json({ message: 'successfully updated your  workExperience' });
    }
});
const uploadCertificates = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { id, url, certificateName } = req.body;
    console.log('data = ', { id, url, certificateName });
    developerSchema_1.default.findOneAndUpdate({ _id: new mongodb_1.ObjectId(id) }, { $addToSet: { certificates: { url, certificateName } } })
        .then((data) => {
        console.log('updated Data = ', data);
        res.status(200).json({ message: 'certificate Succesfully updated' });
    })
        .catch(() => {
        res.status(500).json({ message: 'An unexpected error occured while updating data' });
    });
});
const deleteCertificate = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { id, url, resourcetype } = req.body;
    console.log('data = ', { id, url, resourcetype });
    const data = yield (0, cloudinary_1.default)(url, resourcetype);
    console.log('data = ', data);
    if (data.result === 'ok') {
        developerSchema_1.default.findOneAndUpdate({ _id: new mongodb_1.ObjectId(id) }, {
            $pull: { certificates: { url: url } }
        }).then((data) => {
            console.log('successfully updated  =  ', data);
            res.status(200).json({ message: 'certificate sucessfully deleted' });
        }).catch((error) => {
            console.log('An error occured while editing data = ', error);
        });
    }
});
const uploadResume = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { id, url } = req.body;
    console.log('data on upload Resume = ', { id, url });
    developerSchema_1.default.findOneAndUpdate({ _id: new mongodb_1.ObjectId(id) }, { $set: { resume: url } })
        .then(() => {
        res.status(200).json({ message: 'resume uploaded successfully' });
    }).catch(() => {
        res.status(500).json({ message: 'An unexpected error occured while updating resume' });
    });
});
const getResume = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { id } = req.params;
    let data = yield developerSchema_1.default.findOne({ _id: new mongodb_1.ObjectId(id) });
    if (data) {
        const { resume } = data;
        res.status(200).json({ resume });
    }
});
const getDevelopers = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    developerSchema_1.default.aggregate([
        {
            $match: {
                role: { $exists: true, $ne: "" },
                description: { $exists: true, $ne: "" },
                skills: { $exists: true, $not: { $size: 0 } }
            }
        }, { $project: { name: 1, role: 1, image: 1 } }
    ])
        .then((data) => {
        res.status(200).json(data);
    });
});
//  Subscription 
const HandleSubscription = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { subscriptionType, devId } = req.body;
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
            success_url: `${process.env.FrontEndUrl}/dev/payment-success`,
            cancel_url: `${process.env.FrontEndUrl}/dev/payment-error`,
        });
        if (session.id) {
            const duration = subscriptionType.mode === 'Pro' ? 28 : 364;
            const startDate = new Date();
            let endDate = new Date(startDate);
            endDate.setDate(endDate.getDate() + duration);
            const subscription = {
                planName: subscriptionType.mode,
                endDate: endDate,
                startDate: startDate,
                isExpired: false
            };
            yield developerSchema_1.default.findOneAndUpdate({ _id: new mongodb_1.ObjectId(devId) }, {
                $set: { 'subscriptions.$[elem].isExpired': true }
            }, {
                arrayFilters: [{ 'elem.isExpired': false }]
            });
            developerSchema_1.default.findOneAndUpdate({ _id: new mongodb_1.ObjectId(devId) }, {
                $push: { subscriptions: subscription },
                $set: { appliedJobsCount: 0 }
            })
                .then(() => {
                res.json({ id: session.id });
            });
        }
    }
    catch (error) {
    }
});
const checkSubscription = () => __awaiter(void 0, void 0, void 0, function* () {
    const todaysDate = new Date();
    console.log('function is inwoked');
    yield developerSchema_1.default.updateMany({
        'subscriptions.endDate': { $lt: todaysDate },
        'subscriptions.isExpired': true
    }, {
        $set: {
            'subscriptions.$[elem].isExpired': false
        }
    }, {
        arrayFilters: [{ 'elem.endDate': { $lt: todaysDate } }],
        multi: true
    });
});
node_cron_1.default.schedule('0 0 * * * ', () => {
    checkSubscription();
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
    addWorkExpirence,
    getWorkExperience,
    deleteWorkExperience,
    updateWorkExperience,
    uploadCertificates,
    deleteCertificate,
    uploadResume,
    getResume,
    resendOtp,
    registerWithGoogle,
    HandleSubscription,
    isBlocked,
    getDevelopers
};
