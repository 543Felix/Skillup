"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const companyControllers_1 = require("../controllers/companyControllers");
const jobControllers_1 = require("../controllers/jobControllers");
const developerControllers_1 = require("../controllers/developerControllers");
const companyAuth_1 = __importDefault(require("../middlewares/companyAuth"));
const companyRoute = (0, express_1.default)();
companyRoute.post('/registration', companyControllers_1.companyController.registation);
companyRoute.post('/verify', companyControllers_1.companyController.verifyRegistration);
companyRoute.post('/login', companyControllers_1.companyController.Login);
companyRoute.post('/logOut', companyControllers_1.companyController.logOut);
companyRoute.post('/resendOtp', companyControllers_1.companyController.resendOtp);
companyRoute.get('/isBlocked/:id', companyControllers_1.companyController.isBlocked);
// Profile
companyRoute.get('/profile', companyAuth_1.default, companyControllers_1.companyController.profile);
companyRoute.post('/uploadProfile', companyAuth_1.default, companyControllers_1.companyController.uploadProfilePic);
companyRoute.post('/profileData', companyAuth_1.default, companyControllers_1.companyController.updateProfileData);
companyRoute.post('/updateAbout', companyAuth_1.default, companyControllers_1.companyController.updateAbout);
companyRoute.post('/uploadCertificates', companyAuth_1.default, companyControllers_1.companyController.uploadCertificates);
companyRoute.post('/updateSpecialties', companyAuth_1.default, companyControllers_1.companyController.updateSpecialties);
//job
companyRoute.get('/getJob/:id', companyAuth_1.default, jobControllers_1.jobController.getJob);
companyRoute.get('/allJobs/:id', companyAuth_1.default, companyAuth_1.default, jobControllers_1.jobController.companyJobs);
companyRoute.patch('/setStatus', companyAuth_1.default, jobControllers_1.jobController.setJobStatus);
companyRoute.delete('/deleteJob/:id', companyAuth_1.default, jobControllers_1.jobController.deleteJob);
companyRoute.post('/createJob/:id', companyAuth_1.default, jobControllers_1.jobController.createJob);
companyRoute.post('/editJob/:id', companyAuth_1.default, jobControllers_1.jobController.editJob);
companyRoute.post('/createQuiz/:id', companyAuth_1.default, jobControllers_1.jobController.createQuiz);
companyRoute.get('/appliedDevelopers/:jobId', companyAuth_1.default, jobControllers_1.jobController.getAppliedDevelopers);
companyRoute.patch('/changeProposalStatus/:jobId', companyAuth_1.default, jobControllers_1.jobController.changeProposalStatus);
// All Developers 
companyRoute.get('/allDevelopers', companyAuth_1.default, developerControllers_1.developerController.getDevelopers);
companyRoute.get('/devProfile', companyAuth_1.default, developerControllers_1.developerController.profile);
//Dashboard
companyRoute.get('/dashboard', companyAuth_1.default, companyControllers_1.companyController.dashBoardData);
companyRoute.get('/jobChart', companyAuth_1.default, companyControllers_1.companyController.appliedJobsChart);
exports.default = companyRoute;
