"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const developerControllers_1 = require("../controllers/developerControllers");
// import devAuthorization from '../middlewares/developerAuth'
const jobControllers_1 = require("../controllers/jobControllers");
const developerRoute = (0, express_1.default)();
// developerRoute.use(isDevloperLoggedIn)
developerRoute.post('/registration', developerControllers_1.developerController.Registration);
developerRoute.post('/verify', developerControllers_1.developerController.verifyRegistration);
developerRoute.post('/login', developerControllers_1.developerController.Login);
developerRoute.post('/logOut', developerControllers_1.developerController.logOut);
developerRoute.post('/resendOtp', developerControllers_1.developerController.resendOtp);
developerRoute.post('/registerWithGoogle', developerControllers_1.developerController.registerWithGoogle);
// Profile
developerRoute.post('/uploadProfile', developerControllers_1.developerController.uploadProfilePic);
developerRoute.get('/profile', developerControllers_1.developerController.profile);
developerRoute.post('/profileData', developerControllers_1.developerController.updateProfileData);
developerRoute.post('/profileRoleandDescription', developerControllers_1.developerController.updateRoleandDescription);
developerRoute.post('/updateSkills', developerControllers_1.developerController.updateSkills);
//job 
developerRoute.get('/submittedProposals/:devId', jobControllers_1.jobController.getSubmitedProposal);
developerRoute.post('/sendProposal/:jobId', jobControllers_1.jobController.sendProposal);
// Subscription
developerRoute.post('/create-checkout-session', developerControllers_1.developerController.HandleSubscription);
// developerRoute.post('/stripeWebhook',developerController.stripePaymentHandler)
// developerRoute.get('/dev/:id',jobController.JobsToDisplayDev)
// developerRoute.get('/getJob/:id',jobController.getJob)
// developerRoute.get('/getQuiz/:devId/:jobId',jobController.getQuiz)
exports.default = developerRoute;
