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
//job 
// Subscription
developerRoute.post('/create-checkout-session', developerAuth_1.default, developerControllers_1.developerController.HandleSubscription);
// developerRoute.post('/stripeWebhook',developerController.stripePaymentHandler)
// job
developerRoute.get('/submittedProposals/:devId', jobControllers_1.jobController.getSubmitedProposal);
developerRoute.get('/allJobs/:id', developerAuth_1.default, jobControllers_1.jobController.JobsToDisplayDev);
developerRoute.patch('/saveJob/:id', developerAuth_1.default, jobControllers_1.jobController.saveJob);
developerRoute.patch('/unSaveJob/:id', developerAuth_1.default, jobControllers_1.jobController.unSaveJob);
developerRoute.get('/savedJobs/:id', developerAuth_1.default, jobControllers_1.jobController.SavedJobs);
developerRoute.get('/quizAttendedDevs/:jobId/:devId', jobControllers_1.jobController.showQuizAttendedDevelopers);
developerRoute.get('/appliedJobsCount/:devId', developerAuth_1.default, jobControllers_1.jobController.getAppliedJobsCount);
developerRoute.get('/getQuiz/:devId/:jobId', developerAuth_1.default, jobControllers_1.jobController.getQuiz);
developerRoute.post('/sendProposal/:jobId', developerAuth_1.default, jobControllers_1.jobController.sendProposal);
exports.default = developerRoute;
