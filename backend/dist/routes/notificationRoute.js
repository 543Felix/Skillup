"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const notificationController_1 = require("../controllers/notificationController");
const notificationRoute = (0, express_1.default)();
notificationRoute.get('/:id/:role', notificationController_1.notificationController.getNotifications);
notificationRoute.delete('/deleteNotification/:id/:notificationId', notificationController_1.notificationController.deleteNotification);
exports.default = notificationRoute;
