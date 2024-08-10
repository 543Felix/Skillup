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
const jobsSchema_1 = __importDefault(require("../models/jobsSchema"));
const proposalSchema_1 = __importDefault(require("../models/proposalSchema"));
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
const isBlocked = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { id } = req.params;
    const comapny = yield companySchema_1.default.findOne({ _id: new mongodb_1.ObjectId(id) });
    if (comapny) {
        res.status(200).json({ isBlocked: comapny.isBlocked });
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
                console.log('upload certificatesdata = ', data);
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
const dashBoardData = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _a, _b, _c, _d, _e;
    const { id } = req.query;
    const jobsCount = yield jobsSchema_1.default.aggregate([
        { $match: { companyId: new mongodb_1.ObjectId(id) } },
        { $count: "totalJobs" }
    ]);
    const totalAppliedDevCounts = yield proposalSchema_1.default.aggregate([
        {
            $lookup: {
                from: 'jobs',
                localField: 'jobId',
                foreignField: '_id',
                as: 'jobDetails'
            }
        },
        {
            $unwind: "$jobDetails"
        },
        {
            $match: {
                "jobDetails.companyId": new mongodb_1.ObjectId(id)
            }
        },
        {
            $facet: {
                totalAppliedCount: [
                    {
                        $count: 'count'
                    }
                ],
                selectedAppliedCount: [
                    {
                        $match: {
                            status: 'selected'
                        }
                    },
                    {
                        $count: 'count'
                    }
                ]
            }
        }
    ]);
    const totaljobsApplied = (_b = (_a = totalAppliedDevCounts[0]) === null || _a === void 0 ? void 0 : _a.totalAppliedCount[0]) === null || _b === void 0 ? void 0 : _b.count;
    const selectedCount = (_d = (_c = totalAppliedDevCounts[0]) === null || _c === void 0 ? void 0 : _c.selectedAppliedCount[0]) === null || _d === void 0 ? void 0 : _d.count;
    res.json({ totaljobsApplied, selectedCount, jobsCount: (_e = jobsCount[0]) === null || _e === void 0 ? void 0 : _e.totalJobs });
});
const appliedJobsChart = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { companyId, range } = req.query;
    try {
        const validRanges = ["last7days", "last30days", "last90days", "allTime"];
        if (!validRanges.includes(range)) {
            return res.status(400).json({ error: "Invalid range parameter" });
        }
        const rangeFilter = range !== 'allTime' ? {
            createdAt: {
                $gte: new Date(new Date().setDate(new Date().getDate() - (range === "last7days" ? 7 : range === "last30days" ? 30 : 90)))
            }
        } : {};
        // Aggregate query to get the count of applied jobs grouped by job post name
        const totalAppliedDevCounts = yield proposalSchema_1.default.aggregate([
            {
                $lookup: {
                    from: 'jobs',
                    localField: 'jobId',
                    foreignField: '_id',
                    as: 'jobDetails'
                }
            },
            {
                $unwind: "$jobDetails"
            },
            {
                $match: Object.assign({ "jobDetails.companyId": new mongodb_1.ObjectId(companyId) }, rangeFilter)
            },
            {
                $group: {
                    _id: "$jobId", // Group by job post name
                    count: { $sum: 1 } // Count the number of proposals
                }
            }
        ]);
        res.json(totalAppliedDevCounts);
    }
    catch (error) {
        console.error('Error fetching applied dev counts:', error);
        res.status(500).json({ error: 'Server error' });
    }
});
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
    resendOtp,
    isBlocked,
    dashBoardData,
    appliedJobsChart
};
