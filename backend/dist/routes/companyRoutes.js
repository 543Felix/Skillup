"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const companyControllers_1 = require("../controllers/companyControllers");
// import  isCompanyLoggedIn from '../middlewares/companyAuth'
// import isCompanyLoggedIn from '../middlewares/companyAuth'
const companyRoute = (0, express_1.default)();
companyRoute.post('/registration', companyControllers_1.companyController.registation);
companyRoute.post('/verify', companyControllers_1.companyController.verifyRegistration);
companyRoute.post('/login', companyControllers_1.companyController.Login);
companyRoute.post('/logOut', companyControllers_1.companyController.logOut);
companyRoute.post('/resendOtp', companyControllers_1.companyController.resendOtp);
// Profile
companyRoute.get('/profile', companyControllers_1.companyController.profile);
companyRoute.post('/uploadProfile', companyControllers_1.companyController.uploadProfilePic);
companyRoute.post('/profileData', companyControllers_1.companyController.updateProfileData);
companyRoute.post('/updateAbout', companyControllers_1.companyController.updateAbout);
companyRoute.post('/uploadCertificates', companyControllers_1.companyController.uploadCertificates);
companyRoute.post('/updateSpecialties', companyControllers_1.companyController.updateSpecialties);
exports.default = companyRoute;
