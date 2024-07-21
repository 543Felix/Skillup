"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const jobControllers_1 = require("../controllers/jobControllers");
// import devAuthorization from '../middlewares/developerAuth'
const jobRoute = (0, express_1.default)();
jobRoute.get('/slots', jobControllers_1.jobController.getSlots);
exports.default = jobRoute;
