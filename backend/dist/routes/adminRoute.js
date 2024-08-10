"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const adminControllers_1 = require("../controllers/adminControllers");
const adminRoute = (0, express_1.default)();
adminRoute.post('/login', adminControllers_1.adminController.login);
adminRoute.patch('/developers/block', adminControllers_1.adminController.blockDeveloper);
adminRoute.patch('/developers/unBlock', adminControllers_1.adminController.unblockDeveloper);
adminRoute.get('/developers', adminControllers_1.adminController.showDevelopers);
adminRoute.get('/companies', adminControllers_1.adminController.showCompanies);
adminRoute.patch('/companies/block', adminControllers_1.adminController.blockCompany);
adminRoute.patch('/companies/unBlock', adminControllers_1.adminController.unblockCompany);
adminRoute.patch('/companies/verify', adminControllers_1.adminController.verifyCompany);
adminRoute.patch('/companies/unverify', adminControllers_1.adminController.unverifyCompany);
adminRoute.get('/dashBoard', adminControllers_1.adminController.getDetailsOnDashboard);
adminRoute.get('/chartData', adminControllers_1.adminController.ChartData);
// adminRoute.get('/companyChart',adminController.developerChartData)
adminRoute.post('/logout', adminControllers_1.adminController.logOut);
exports.default = adminRoute;
