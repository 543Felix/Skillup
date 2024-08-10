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
exports.adminController = void 0;
const adminSchema_1 = __importDefault(require("../models/adminSchema"));
const developerSchema_1 = __importDefault(require("../models/developerSchema"));
const companySchema_1 = __importDefault(require("../models/companySchema"));
const jobsSchema_1 = __importDefault(require("../models/jobsSchema"));
const mongodb_1 = require("mongodb");
const registationHelper_1 = require("../helper/registationHelper");
const moment_1 = __importDefault(require("moment"));
const login = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    let { name, password } = req.body;
    let data = yield adminSchema_1.default.findOne({ name: name, password: password });
    if (data) {
        const token = registationHelper_1.registerHelper.generateToken({ name });
        res.cookie('adminAccessToken', token.accessToken, { httpOnly: true });
        res.cookie('adminRefreshToken', token.refreshToken, { httpOnly: true });
        return res.status(200).json({ message: 'logged in suuceessful' });
    }
    else {
        res.send({ message: 'incorrect email and password' });
    }
});
const showDevelopers = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    developerSchema_1.default.find({}).select({ password: 0 }).then((developers) => {
        res.status(200).json({ developers });
    }).catch((error) => {
        console.error(error.message);
    });
});
const showCompanies = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    companySchema_1.default.find({}).select({ password: 0 }).then((companies) => {
        res.status(200).json({ companies });
    }).catch((error) => {
        console.error(error.message);
    });
});
const blockDeveloper = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const id = new mongodb_1.ObjectId(req.query.id);
    if (id) {
        developerSchema_1.default.findOneAndUpdate({ _id: id }, { isBlocked: true }, { new: true }).then((data) => {
            developerSchema_1.default.find({}).select({ password: 0 }).then((developer) => {
                res.status(200).json({ developer });
            });
        }).catch((error) => {
            console.error(error.message);
        });
    }
});
const unblockDeveloper = (req, res) => {
    const id = new mongodb_1.ObjectId(req.query.id);
    if (id) {
        developerSchema_1.default.findOneAndUpdate({ _id: id }, { isBlocked: false }, { new: true }).then((data) => {
            developerSchema_1.default.find({}).select({ password: 0 }).then((developer) => {
                res.status(200).json({ developer });
            });
        }).catch((error) => {
            console.error(error.message);
        });
    }
};
const blockCompany = (req, res) => {
    const id = new mongodb_1.ObjectId(req.query.id);
    if (id) {
        companySchema_1.default.findOneAndUpdate({ _id: id }, { isBlocked: true }, { new: true }).then((data) => {
            companySchema_1.default.find({}).select({ password: 0 }).then((companies) => {
                res.status(200).json({ companies });
            });
        }).catch((error) => {
            console.error(error.message);
        });
    }
};
const unblockCompany = (req, res) => {
    const id = new mongodb_1.ObjectId(req.query.id);
    if (id) {
        companySchema_1.default.findOneAndUpdate({ _id: id }, { isBlocked: false }, { new: true }).then((data) => {
            companySchema_1.default.find({}).select({ password: 0 }).then((companies) => {
                res.status(200).json({ companies });
            });
        }).catch((error) => {
            console.error(error.message);
        });
    }
};
const verifyCompany = (req, res) => {
    const id = req.query.id;
    const objectId = new mongodb_1.ObjectId(id);
    companySchema_1.default.findOneAndUpdate({ _id: objectId }, { isVerified: true }).then((data) => {
        res.status(200).json({ data: data });
    }).catch((error) => {
        res.status(500).json({ message: error.message });
    });
};
const unverifyCompany = (req, res) => {
    const id = req.query.id;
    const objectId = new mongodb_1.ObjectId(id);
    companySchema_1.default.findOneAndUpdate({ _id: objectId }, { isVerified: false }).then((data) => {
        res.status(200).json({ data: data });
    }).catch((error) => {
        res.status(500).json({ message: error.message });
    });
};
const logOut = (req, res) => {
    try {
        res.clearCookie('adminAccessToken');
        res.clearCookie('adminRefreshToken');
        res.status(200).json({ message: 'successfully loogedout' });
    }
    catch (error) {
        res.status(500).json({ error });
    }
};
const getDetailsOnDashboard = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const DeveloperCount = yield developerSchema_1.default.find().countDocuments();
    const CompaniesCount = yield companySchema_1.default.find().countDocuments();
    const jobsCount = yield jobsSchema_1.default.find().countDocuments();
    const totalSubscriptionsEach = yield developerSchema_1.default.aggregate([
        { $unwind: '$subscriptions' },
        { $match: { 'subscriptions.planName': { $in: ['Pro', 'Premium'] } } },
        { $group: {
                _id: '$subscriptions.planName',
                count: { $sum: 1 }
            }
        }
    ]);
    const totalIncome = totalSubscriptionsEach.reduce((sum, item) => {
        if (item._id === 'Pro') {
            sum += 12 * item.count;
        }
        else if (item._id === 'Premium') {
            sum += 100 * item.count;
        }
        return sum;
    }, 0);
    res.status(200).json({ DeveloperCount, CompaniesCount, jobsCount, totalIncome });
});
const ChartData = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { period, role } = req.query;
    let matchCondition = {};
    let groupByCondition = { _id: null, count: { $sum: 1 } };
    let dateRange = {};
    switch (period) {
        case 'last7days':
            dateRange = {
                $gte: (0, moment_1.default)().subtract(7, 'days').startOf('day').toDate(),
                $lt: (0, moment_1.default)().endOf('day').toDate(),
            };
            break;
        case 'last30days':
            dateRange = {
                $gte: (0, moment_1.default)().subtract(30, 'days').startOf('day').toDate(),
                $lt: (0, moment_1.default)().endOf('day').toDate(),
            };
            break;
        case 'last90days':
            dateRange = {
                $gte: (0, moment_1.default)().subtract(90, 'days').startOf('day').toDate(),
                $lt: (0, moment_1.default)().endOf('day').toDate(),
            };
            break;
        case 'allTime':
            dateRange = null;
            break;
        default:
            return res.status(400).send('Invalid period');
    }
    if (dateRange && (period === 'last30days' || period === 'last90days')) {
        matchCondition.createdAt = dateRange;
        groupByCondition._id = {
            $subtract: [
                { $subtract: ["$createdAt", new Date(0)] },
                { $mod: [{ $subtract: ["$createdAt", new Date(0)] }, 1000 * 60 * 60 * 24 * 7] }
            ]
        };
    }
    else if (dateRange) {
        matchCondition.createdAt = dateRange;
        groupByCondition._id = { $dateToString: { format: "%Y-%m-%d", date: "$createdAt" } };
    }
    else {
        groupByCondition._id = { $dateToString: { format: "%Y-%m-%d", date: "$createdAt" } };
    }
    try {
        if (role === 'dev') {
            const data = yield developerSchema_1.default.aggregate([
                { $match: matchCondition },
                { $group: groupByCondition },
                { $sort: { _id: 1 } },
            ]);
            return res.json(data);
        }
        else if (role === 'companies') {
            const data = yield companySchema_1.default.aggregate([
                { $match: matchCondition },
                { $group: groupByCondition },
                { $sort: { _id: 1 } },
            ]);
            return res.json(data);
        }
    }
    catch (error) {
        console.error('Error fetching chart data:', error);
        res.status(500).send('Internal Server Error');
    }
});
exports.adminController = {
    login,
    showDevelopers,
    showCompanies,
    blockDeveloper,
    unblockDeveloper,
    blockCompany,
    unblockCompany,
    logOut,
    verifyCompany,
    unverifyCompany,
    getDetailsOnDashboard,
    ChartData
};
