"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const chatController_1 = require("../controllers/chatController");
const chatRoute = (0, express_1.default)();
chatRoute.get('/getAllChats/:id', chatController_1.ChatController.getAllChats);
chatRoute.get('/individualMessages', chatController_1.ChatController.getIndividualMessages);
exports.default = chatRoute;
