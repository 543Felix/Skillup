import express, { Application } from 'express';
import connectDb from './mongodb/config';
import developerRoute from './routes/developerRoutes';
import companyRoute from './routes/companyRoutes';
import adminRoute from './routes/adminRoute'
import chatRoute from './routes/chatRoute'
import meetingRoute from './routes/meetingRoute'
import notificationRoute from './routes/notificationRoute'
import dotenv from 'dotenv';
import session from 'express-session';
import cookieParser from 'cookie-parser';
import cors from 'cors'
import path from 'path'


// Socket
import { createServer } from 'http';
import initializeSocket from './Socketio/socketInitial'

const currentWorkingDir = path.resolve();
const parentDir = path.dirname(currentWorkingDir);

dotenv.config();
const app: Application = express();
let port = 3001;

const httpServer = createServer(app)
connectDb();


app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser('your_secret_key_here'));

app.use(session({
    secret: process.env.session_Secret_Key as string,
    resave: false,
    saveUninitialized: false,
    cookie: { secure: false } 
}));
    const corsOptions = {
        origin: [process.env.FrontEndUrl as string],
        credentials: true, 
        crossOriginOpenerPolicy: 'same-origin',
    };
  
  app.use(cors(corsOptions));


app.use('/dev', developerRoute);
app.use('/company', companyRoute);
app.use('/admin',adminRoute)
app.use('/chat',chatRoute)
app.use('/notifications',notificationRoute) 
app.use('/meeting',meetingRoute)

initializeSocket(httpServer)

 app.use(express.static(path.join(__dirname, "../frontend/dist")));

app.get("*", (req, res) => 
  res.sendFile(path.resolve(__dirname, "../frontend/dist", "index.html"))
);

httpServer.listen(port, () => {
    console.log(`server is running on port http://localhost:${port}/`);
}); 
