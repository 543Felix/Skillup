"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const meetingController_1 = require("../controllers/meetingController");
const meetingRoute = (0, express_1.default)();
meetingRoute.post('/joinRoom', meetingController_1.meetingController.JoinRoom);
meetingRoute.patch('/endMeeting', meetingController_1.meetingController.endMeeting);
meetingRoute.get('/meetingHistory/:id', meetingController_1.meetingController.getMeetingHistory);
exports.default = meetingRoute;
