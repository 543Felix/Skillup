"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const developerControllers_1 = require("../controllers/developerControllers");
const developerAuth_1 = __importDefault(require("../middlewares/developerAuth"));
const jobControllers_1 = require("../controllers/jobControllers");
const developerRoute = (0, express_1.default)();
// developerRoute.use(isDevloperLoggedIn)
developerRoute.post('/registration', developerControllers_1.developerController.Registration);
developerRoute.post('/verify', developerControllers_1.developerController.verifyRegistration);
developerRoute.post('/login', developerControllers_1.developerController.Login);
developerRoute.post('/logOut', developerControllers_1.developerController.logOut);
developerRoute.post('/resendOtp', developerControllers_1.developerController.resendOtp);
developerRoute.post('/registerWithGoogle', developerControllers_1.developerController.registerWithGoogle);
developerRoute.get('/isBlocked/:id', developerControllers_1.developerController.isBlocked);
// Profile
developerRoute.post('/uploadProfile', developerAuth_1.default, developerControllers_1.developerController.uploadProfilePic);
developerRoute.get('/profile', developerAuth_1.default, developerControllers_1.developerController.profile);
developerRoute.post('/profileData', developerAuth_1.default, developerControllers_1.developerController.updateProfileData);
developerRoute.post('/profileRoleandDescription', developerAuth_1.default, developerControllers_1.developerController.updateRoleandDescription);
developerRoute.post('/updateSkills', developerAuth_1.default, developerControllers_1.developerController.updateSkills);
developerRoute.get('/workExperience/:id', developerControllers_1.developerController.getWorkExperience);
developerRoute.post('/addWorkExperience', developerControllers_1.developerController.addWorkExpirence);
developerRoute.patch('/deleteWorkExperience/:id/:workId', developerControllers_1.developerController.deleteWorkExperience);
developerRoute.post('/updateWorkExperience', developerControllers_1.developerController.updateWorkExperience);
developerRoute.patch('/uploadCertificates', developerControllers_1.developerController.uploadCertificates);
developerRoute.patch('/deleteCertificate', developerControllers_1.developerController.deleteCertificate);
developerRoute.patch('/uploadResume', developerControllers_1.developerController.uploadResume);
developerRoute.get('/resume/:id', developerControllers_1.developerController.getResume);
//allDevelopers
developerRoute.get('/allDevelopers');
// Subscription
developerRoute.post('/create-checkout-session', developerAuth_1.default, developerControllers_1.developerController.HandleSubscription);
// job
developerRoute.get('/submittedProposals/:devId', jobControllers_1.jobController.getSubmitedProposal);
developerRoute.get('/allJobs/:id', developerAuth_1.default, jobControllers_1.jobController.JobsToDisplayDev);
developerRoute.patch('/saveJob/:id', developerAuth_1.default, jobControllers_1.jobController.saveJob);
developerRoute.patch('/unSaveJob/:id', developerAuth_1.default, jobControllers_1.jobController.unSaveJob);
developerRoute.get('/savedJobs/:id', developerAuth_1.default, jobControllers_1.jobController.SavedJobs);
// developerRoute.get('/quizAttendedDevs/:jobId/:devId',jobController.showQuizAttendedDevelopers)
developerRoute.get('/appliedJobsCount/:devId', developerAuth_1.default, jobControllers_1.jobController.getAppliedJobsCount);
developerRoute.get('/getQuiz/:devId/:jobId', developerAuth_1.default, jobControllers_1.jobController.getQuiz);
developerRoute.post('/sendProposal/:jobId', developerAuth_1.default, jobControllers_1.jobController.sendProposal);
developerRoute.get('/getJob/:id', developerAuth_1.default, jobControllers_1.jobController.getIndividualJob);
developerRoute.get('/jobs', jobControllers_1.jobController.getAllJobs);
exports.default = developerRoute;
