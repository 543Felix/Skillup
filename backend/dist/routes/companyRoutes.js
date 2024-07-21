"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const companyControllers_1 = require("../controllers/companyControllers");
const jobControllers_1 = require("../controllers/jobControllers");
const companyAuth_1 = __importDefault(require("../middlewares/companyAuth"));
const companyRoute = (0, express_1.default)();
companyRoute.post('/registration', companyControllers_1.companyController.registation);
companyRoute.post('/verify', companyControllers_1.companyController.verifyRegistration);
companyRoute.post('/login', companyControllers_1.companyController.Login);
companyRoute.post('/logOut', companyControllers_1.companyController.logOut);
companyRoute.post('/resendOtp', companyControllers_1.companyController.resendOtp);
companyRoute.get('/isBlocked/:id', companyControllers_1.companyController.isBlocked);
// Profile
companyRoute.get('/profile', companyControllers_1.companyController.profile);
companyRoute.post('/uploadProfile', companyControllers_1.companyController.uploadProfilePic);
companyRoute.post('/profileData', companyControllers_1.companyController.updateProfileData);
companyRoute.post('/updateAbout', companyControllers_1.companyController.updateAbout);
companyRoute.post('/uploadCertificates', companyControllers_1.companyController.uploadCertificates);
companyRoute.post('/updateSpecialties', companyControllers_1.companyController.updateSpecialties);
//job
companyRoute.get('/getJob/:id', jobControllers_1.jobController.getJob);
companyRoute.get('/allJobs/:id', companyAuth_1.default, jobControllers_1.jobController.companyJobs);
companyRoute.patch('/setStatus', jobControllers_1.jobController.setJobStatus);
companyRoute.delete('/deleteJob/:id', jobControllers_1.jobController.deleteJob);
companyRoute.post('/createJob/:id', jobControllers_1.jobController.createJob);
companyRoute.post('/editJob/:id', jobControllers_1.jobController.editJob);
companyRoute.post('/createQuiz/:id', jobControllers_1.jobController.createQuiz);
companyRoute.get('/appliedDevelopers/:jobId', jobControllers_1.jobController.getAppliedDevelopers);
companyRoute.patch('/changeProposalStatus/:jobId', jobControllers_1.jobController.changeProposalStatus);
// jobRoute.post('/updateJob',jobController.updateJob)
exports.default = companyRoute;
