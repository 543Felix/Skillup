"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = __importDefault(require("mongoose"));
const envvariables_1 = require("../envVariables/envvariables");
function connectDb() {
    mongoose_1.default.connect(envvariables_1.connectionString)
        .then(() => console.log('Connected to MongoDB database'))
        .catch(err => console.error('Error connecting to MongoDB database:', err));
}
exports.default = connectDb;
