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
exports.jobController = void 0;
const mongodb_1 = require("mongodb");
const jobsSchema_1 = __importDefault(require("../models/jobsSchema"));
const developerSchema_1 = __importDefault(require("../models/developerSchema"));
const proposalSchema_1 = __importDefault(require("../models/proposalSchema"));
const setAppliedJobCount = (id) => __awaiter(void 0, void 0, void 0, function* () {
    let data = yield developerSchema_1.default.findOneAndUpdate({ _id: new mongodb_1.ObjectId(id) }, { $inc: { appliedJobsCount: 1 } });
    return data;
});
const createJob = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { jobTitle, length, workingHoursperWeek, salary, description, responsibilities, skills, createdAt, experienceLevel, qualification } = req.body;
        const { id } = req.params;
        const companyId = new mongodb_1.ObjectId(String(id));
        const data = yield jobsSchema_1.default.findOne({ companyId: companyId, jobTitle: jobTitle });
        const convertedSkills = skills.split(',').filter((item) => item.trim().length !== 0);
        if (data) {
            res.status(404).json({ message: 'Job with this name already exists' });
        }
        else {
            new jobsSchema_1.default({
                companyId,
                jobTitle,
                length,
                workingHoursperWeek,
                salary,
                description,
                experienceLevel,
                qualification,
                responsibilities,
                createdAt,
                skills: convertedSkills
            }).save().then((data) => {
                res.status(200).json({ message: 'job successfully created', jobId: data._id });
            });
        }
    }
    catch (error) {
        res.status(500).json({ message: 'An unexpected error ocuured while creating job' });
    }
});
const JobsToDisplayDev = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { id } = req.params;
        const objectId = new mongodb_1.ObjectId(id);
        const qualification = req.query.qualification;
        const experienceLevel = req.query.experienceLevel;
        const search = req.query.search;
        const sort = req.query.sort;
        const match = { status: 'open' };
        const Sort = { jobTitle: 1 };
        if (qualification && qualification.length > 0) {
            match.qualification = { $in: qualification };
        }
        if (experienceLevel && experienceLevel.length > 0) {
            match.experienceLevel = { $in: experienceLevel };
        }
        if (search && search.trim().length > 0) {
            match.$or = [
                { jobTitle: { $regex: search, $options: "i" } },
                { skills: { $elemMatch: { $regex: search, $options: "i" } } }
            ];
        }
        if (sort) {
            Sort.jobTitle = Number(sort);
        }
        const devData = yield developerSchema_1.default.findOne({ _id: objectId }, { savedJobs: 1, appliedJobs: 1, _id: 0 });
        if ((devData === null || devData === void 0 ? void 0 : devData.appliedJobs) && devData.appliedJobs.length > 0) {
            match._id = { $nin: devData.appliedJobs };
        }
        if (devData !== (undefined || null)) {
            jobsSchema_1.default.aggregate([
                {
                    $match: match
                },
                {
                    $lookup: {
                        from: 'companies',
                        localField: 'companyId',
                        foreignField: '_id',
                        as: 'companyDetails'
                    }
                }, {
                    $sort: Sort !== null && Sort !== void 0 ? Sort : 1
                }, {
                    $sort: { createdAt: -1 }
                }
            ], { collation: { locale: "en", strength: 2 } })
                .then((data) => {
                const savedJobs = devData === null || devData === void 0 ? void 0 : devData.savedJobs;
                res.status(200).json({ data, savedJobs });
            });
        }
    }
    catch (error) {
        res.status(500).json({ message: 'Error occured while fetching data' });
    }
});
const saveJob = (req, res) => {
    try {
        const { id } = req.params;
        const { jobId } = req.body;
        const devId = new mongodb_1.ObjectId(String(id));
        developerSchema_1.default.findOneAndUpdate({ _id: devId }, { $addToSet: { savedJobs: jobId } })
            .then((data) => {
            let savedJobs = data === null || data === void 0 ? void 0 : data.savedJobs;
            res.status(200).json({ message: 'data updated successfully', savedJobs });
        });
    }
    catch (error) {
        res.status(500).json({ message: 'Error occured on datyabase update' });
    }
};
const unSaveJob = (req, res) => {
    try {
        const { id } = req.params;
        const objectId = new mongodb_1.ObjectId(id);
        const { jobId } = req.body;
        developerSchema_1.default.findOneAndUpdate({ _id: objectId }, { $pull: { savedJobs: jobId } })
            .then(() => {
            res.status(200).json({ message: 'job removed from saved Jobs' });
        });
    }
    catch (error) {
        res.status(500).json({ message: 'Error occured on datyabase update' });
    }
};
const SavedJobs = (req, res) => {
    try {
        const { id } = req.params;
        const objectId = new mongodb_1.ObjectId(id);
        const qualification = req.query.qualification;
        const experienceLevel = req.query.experienceLevel;
        const search = req.query.search;
        const sort = req.query.sort;
        const match = {};
        const Sort = { "jobs.jobTitle": 1 };
        if (qualification && qualification.length > 0) {
            match["jobs.qualification"] = { $in: qualification };
        }
        if (experienceLevel && experienceLevel.length > 0) {
            match["jobs.experienceLevel"] = { $in: experienceLevel };
        }
        if (search && search.trim().length > 0) {
            match.$or = [
                { "jobs.jobTitle": { $regex: search, $options: "i" } },
                { "jobs.skills": { $elemMatch: { $regex: search, $options: "i" } } }
            ];
        }
        if (sort) {
            Sort["jobs.jobTitle"] = Number(sort);
        }
        developerSchema_1.default.aggregate([
            { $match: {
                    _id: objectId,
                    savedJobs: { $exists: true, $type: 'array', $ne: [] }
                } },
            {
                $lookup: {
                    from: "jobs",
                    let: { savedJobs: "$savedJobs" },
                    pipeline: [
                        {
                            $match: {
                                $expr: { $in: ["$_id", "$$savedJobs"] }
                            }
                        },
                        {
                            $lookup: {
                                from: "companies",
                                localField: "companyId",
                                foreignField: "_id",
                                as: "companyDetails"
                            }
                        }
                    ],
                    as: "jobs"
                }
            },
            { $unwind: "$jobs" },
            {
                $match: Object.assign({ "jobs.status": "open" }, match)
            }, {
                $sort: Sort
            },
            { $project: { job: "$jobs", _id: 0 } }
        ], { collation: { locale: "en", strength: 2 } }).then((response) => {
            if (response.length === 0) {
                return res.status(200).json({ data: response });
            }
            const data = response.map((item) => item.job);
            res.status(200).json({ data });
        }).catch((error) => {
            res.status(500).json({ message: error.message });
        });
    }
    catch (error) {
        res.status(500).json({ message: 'Error occurred while aggregating data from database' });
    }
};
const deleteJob = (req, res) => {
    try {
        const { id } = req.params;
        const objectId = new mongodb_1.ObjectId(id);
        jobsSchema_1.default.deleteOne({ _id: objectId }).then(() => {
            res.status(200).json({ message: 'job Deleted sucessfully' });
        });
    }
    catch (error) {
        res.status(500).json({ message: 'Errro occured while deleting from database' });
    }
};
const companyJobs = (req, res) => {
    try {
        const { id } = req.params;
        const objectId = new mongodb_1.ObjectId(String(id));
        jobsSchema_1.default.aggregate([{ $match: { companyId: objectId } }]).then((response) => {
            return res.status(200).json({ response });
        });
    }
    catch (error) {
        return res.status(500).send({ message: 'An Error occured while fetching Data' });
    }
};
const getJob = (req, res) => {
    try {
        const { id } = req.params;
        const objectId = new mongodb_1.ObjectId(String(id));
        jobsSchema_1.default.findOne({ _id: objectId }).then((data) => {
            res.status(200).json({ data });
        });
    }
    catch (error) {
        res.status(500).json({ message: 'An error occured on finding particular job' });
    }
};
const getIndividualJob = (req, res) => {
    const { id } = req.params;
    jobsSchema_1.default.aggregate([
        {
            $match: { _id: new mongodb_1.ObjectId(id) }
        }, {
            $lookup: {
                from: 'companies',
                localField: 'companyId',
                foreignField: '_id',
                as: 'companyDetails'
            }
        }
    ]).then((data) => {
        res.status(200).json({ data });
    });
};
const editJob = (req, res) => {
    try {
        const { id } = req.params;
        const jobId = new mongodb_1.ObjectId(id);
        const { jobTitle, length, workingHoursperWeek, description, responsibilities, skills, salary, experienceLevel, qualification } = req.body;
        let Skills;
        if (typeof skills === 'string') {
            Skills = skills.split(',').filter((item) => item.trim().length !== 0);
        }
        else {
            Skills = skills;
        }
        jobsSchema_1.default.findOneAndUpdate({ _id: jobId }, {
            jobTitle,
            length,
            workingHoursperWeek,
            description,
            responsibilities,
            salary,
            experienceLevel,
            qualification,
            skills: Skills
        }).then((data) => {
            res.status(200).json({ message: 'job updation successfull' });
        });
    }
    catch (error) {
        res.status(500).json({ message: 'An error occured on updating job' });
    }
};
const sendProposal = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { developerId, coverLetter, score, resume } = req.body;
        const { jobId } = req.params;
        const DeveloperId = new mongodb_1.ObjectId(developerId);
        const JobId = new mongodb_1.ObjectId(jobId);
        proposalSchema_1.default.findOne({ jobId: JobId, developerId: DeveloperId })
            .then((data) => __awaiter(void 0, void 0, void 0, function* () {
            if (!data) {
                yield setAppliedJobCount(developerId);
                new proposalSchema_1.default({
                    jobId,
                    developerId,
                    coverLetter,
                    resume,
                    score
                }).save().then((data) => __awaiter(void 0, void 0, void 0, function* () {
                    yield developerSchema_1.default.updateOne({ _id: DeveloperId }, { $addToSet: { appliedJobs: JobId } });
                    let Data = yield jobsSchema_1.default.aggregate([
                        {
                            $match: {
                                _id: data.jobId
                            }
                        }, {
                            $lookup: {
                                from: 'companies',
                                localField: 'companyId',
                                foreignField: '_id',
                                as: 'companyDetails'
                            }
                        },
                        {
                            $unwind: "$companyDetails"
                        },
                        {
                            $project: {
                                _id: 0,
                                companyName: "$companyDetails.companyName",
                                companyId: "$companyDetails._id",
                                jobTitle: 1
                            }
                        }
                    ]);
                    res.status(200).json({ message: 'sucessfully submited your Proposal', Data });
                }));
            }
            else {
                res.status(404).json({ message: 'you have already applied for the job' });
            }
        }));
    }
    catch (error) {
        res.status(500).json({ message: 'An error occured while submitting your proposal' });
    }
});
const createQuiz = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { id } = req.params;
        const objectId = new mongodb_1.ObjectId(id);
        const { questions, passingScore } = req.body;
        jobsSchema_1.default.findOneAndUpdate({ _id: objectId }, { Quiz: { questions, passingScore } })
            .then(() => {
            res.status(200).json({ message: 'Question for quiz added successfully ' });
        });
    }
    catch (error) {
        res.status(500).json({ message: 'invalid error occurs' });
    }
});
const getQuiz = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { jobId, devId } = req.params;
        const objectId = new mongodb_1.ObjectId(String(jobId));
        yield developerSchema_1.default.updateOne({ _id: new mongodb_1.ObjectId(devId) }, { $addToSet: { appliedJobs: objectId } });
        jobsSchema_1.default.findOne({ _id: objectId })
            .then((response) => {
            const Quiz = response === null || response === void 0 ? void 0 : response.Quiz;
            return res.status(200).json({ Quiz });
        });
    }
    catch (error) {
        res.status(500).json({ message: 'An error occured while fetching data' });
    }
});
const setJobStatus = (req, res) => {
    try {
        const { id } = req.query;
        const objectId = new mongodb_1.ObjectId(String(id));
        const { status } = req.body;
        jobsSchema_1.default.findOneAndUpdate({ _id: objectId }, { status }).then(() => {
            res.status(200).json({ message: `status updated to ${status} job vaccancy successfully` });
        }).catch(() => {
            res.status(404).json({ message: 'invalid credentials' });
        });
    }
    catch (error) {
        return res.status(500).json({ message: 'internal server error' });
    }
};
const getAppliedDevelopers = (req, res) => {
    const jobId = req.params.jobId;
    const objectId = new mongodb_1.ObjectId(jobId);
    proposalSchema_1.default.aggregate([{ $match: { jobId: objectId } },
        {
            $lookup: {
                from: 'developers',
                localField: 'developerId',
                foreignField: '_id',
                as: 'developer'
            }
        },
        {
            $unwind: '$developer'
        },
        {
            $project: {
                _id: 0,
                developerId: 1,
                resume: 1,
                createdAt: 1,
                status: 1,
                coverLetter: 1,
                name: '$developer.name',
                email: '$developer.email',
                image: '$developer.image'
            }
        },
        {
            $sort: { createdAt: -1 } // Sort by createdAt in descending order
        }
    ]).then((data) => {
        res.status(200).json({ data });
    }).catch(() => {
        res.status(404).json({ message: 'No one applied for the job' });
    });
};
const changeProposalStatus = (req, res) => {
    const { jobId } = req.params;
    const { status, devId } = req.body;
    const jobObjectId = new mongodb_1.ObjectId(jobId);
    const devObjectId = new mongodb_1.ObjectId(devId);
    proposalSchema_1.default.findOneAndUpdate({ jobId: jobObjectId, developerId: devObjectId }, { status })
        .then(() => {
        res.status(200).json({ message: 'job updated successfully' });
    })
        .catch(() => {
        res.status(500).json({ message: 'Failed to update job status' });
    });
};
const getSubmitedProposal = (req, res) => {
    const { devId } = req.params;
    const objectId = new mongodb_1.ObjectId(devId);
    proposalSchema_1.default.aggregate([
        {
            $match: { developerId: objectId }
        },
        {
            $lookup: {
                from: 'jobs', // Collection name for jobs
                localField: 'jobId',
                foreignField: '_id',
                as: 'job'
            }
        },
        {
            $unwind: '$job'
        },
        {
            $lookup: {
                from: 'companies', // Collection name for companies
                localField: 'job.companyId',
                foreignField: '_id',
                as: 'company'
            }
        },
        {
            $unwind: '$company'
        },
        {
            $sort: { 'createdAt': -1 }
        },
        {
            $project: {
                _id: 1,
                jobId: 1,
                jobName: '$job.jobTitle',
                createdAt: 1,
                resume: 1,
                coverLetter: 1,
                status: 1,
                companyName: '$company.companyName',
            }
        }
    ]).then((data) => {
        res.status(200).json({ data });
    });
};
const getAppliedJobsCount = (req, res) => {
    const { devId } = req.params;
    developerSchema_1.default.aggregate([{
            $match: { _id: new mongodb_1.ObjectId(devId) }
        }, {
            $project: {
                _id: 0,
                appliedJobsCount: 1,
                subscriptions: 1
            }
        }]).then((data) => {
        if (data[0].subscriptions[data[0].subscriptions.length - 1].planName === 'Free' && data[0].appliedJobsCount < 5) {
            return res.status(200).json({ message: 'You are elligible to apply ' });
        }
        else if (data[0].subscriptions[data[0].subscriptions.length - 1].planName === 'Pro' && data[0].appliedJobsCount < 15) {
            return res.status(200).json({ message: 'You are elligible to apply ' });
        }
        else if (data[0].subscriptions[data[0].subscriptions.length - 1].planName === 'Premium') {
            return res.status(200).json({ message: 'You are elligible to apply ' });
        }
        else {
            return res.status(401).json({ message: 'your subscription plan expired' });
        }
    });
};
exports.jobController = {
    JobsToDisplayDev,
    createJob,
    getQuiz,
    companyJobs,
    setJobStatus,
    getJob,
    saveJob,
    unSaveJob,
    SavedJobs,
    deleteJob,
    editJob,
    createQuiz,
    sendProposal,
    getAppliedDevelopers,
    changeProposalStatus,
    getSubmitedProposal,
    getIndividualJob,
    getAppliedJobsCount,
};
