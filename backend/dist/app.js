"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const config_1 = __importDefault(require("./mongodb/config"));
const developerRoutes_1 = __importDefault(require("./routes/developerRoutes"));
const companyRoutes_1 = __importDefault(require("./routes/companyRoutes"));
const adminRoute_1 = __importDefault(require("./routes/adminRoute"));
const jobRoutes_1 = __importDefault(require("./routes/jobRoutes"));
const chatRoute_1 = __importDefault(require("./routes/chatRoute"));
const notificationRoute_1 = __importDefault(require("./routes/notificationRoute"));
const dotenv_1 = __importDefault(require("dotenv"));
const express_session_1 = __importDefault(require("express-session"));
const cookie_parser_1 = __importDefault(require("cookie-parser"));
const cors_1 = __importDefault(require("cors"));
// Socket
const http_1 = require("http");
const socketInitial_1 = __importDefault(require("./Socketio/socketInitial"));
dotenv_1.default.config();
const app = (0, express_1.default)();
let port = 3001;
const httpServer = (0, http_1.createServer)(app);
(0, config_1.default)();
app.use(express_1.default.json());
app.use(express_1.default.urlencoded({ extended: true }));
app.use((0, cookie_parser_1.default)('your_secret_key_here'));
app.use((0, express_session_1.default)({
    secret: process.env.session_Secret_Key,
    resave: false,
    saveUninitialized: false,
    cookie: { secure: false } // Set to true if using HTTPS
}));
const corsOptions = {
    origin: ['http://localhost:5173', 'http://localhost:5174'], // Replace with your client's domain
    credentials: true, // Enable credentials (cookies, headers)
    crossOriginOpenerPolicy: 'same-origin',
};
app.use((0, cors_1.default)(corsOptions));
app.use('/dev', developerRoutes_1.default);
app.use('/company', companyRoutes_1.default);
app.use('/admin', adminRoute_1.default);
app.use('/job', jobRoutes_1.default);
app.use('/chat', chatRoute_1.default);
app.use('/notifications', notificationRoute_1.default);
(0, socketInitial_1.default)(httpServer);
httpServer.listen(port, () => {
    console.log(`server is running on port http://localhost:${port}/`);
});