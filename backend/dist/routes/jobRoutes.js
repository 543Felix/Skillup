"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const jobControllers_1 = require("../controllers/jobControllers");
const jobRoute = (0, express_1.default)();
jobRoute.post('/createJob/:id', jobControllers_1.jobController.createJob);
// jobRoute.post('/updateJob',jobController.updateJob)
jobRoute.get('/dev/:id/:pageNo', jobControllers_1.jobController.JobsToDisplayDev);
jobRoute.get('/getJob/:id', jobControllers_1.jobController.getJob);
jobRoute.get('/getQuiz/:devId/:jobId', jobControllers_1.jobController.getQuiz);
jobRoute.get('/slots', jobControllers_1.jobController.getSlots);
jobRoute.get('/company/:id', jobControllers_1.jobController.companyJobs);
jobRoute.patch('/setStatus', jobControllers_1.jobController.setJobStatus);
jobRoute.patch('/saveJob/:id', jobControllers_1.jobController.saveJob);
jobRoute.patch('/unSaveJob/:id', jobControllers_1.jobController.unSaveJob);
jobRoute.get('/savedJobs/:id', jobControllers_1.jobController.SavedJobs);
jobRoute.delete('/deleteJob/:id', jobControllers_1.jobController.deleteJob);
jobRoute.post('/editJob/:id', jobControllers_1.jobController.editJob);
jobRoute.post('/createQuiz/:id', jobControllers_1.jobController.createQuiz);
jobRoute.post('/sendProposal/:jobId', jobControllers_1.jobController.sendProposal);
jobRoute.get('/appliedDevelopers/:jobId', jobControllers_1.jobController.getAppliedDevelopers);
jobRoute.patch('/changeProposalStatus/:jobId', jobControllers_1.jobController.changeProposalStatus);
jobRoute.get('/quizAttendedDevs/:jobId/:devId', jobControllers_1.jobController.showQuizAttendedDevelopers);
jobRoute.get('/appliedJobsCount/:devId', jobControllers_1.jobController.getAppliedJobsCount);
exports.default = jobRoute;
