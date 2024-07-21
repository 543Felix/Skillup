"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const socket_io_1 = require("socket.io");
const chatSchema_1 = __importDefault(require("../models/chatSchema"));
const notificationSchema_1 = __importDefault(require("../models/notificationSchema"));
const socketUsers = new Map();
const meetings = {};
const initializeSocket = (httpServer) => {
    const io = new socket_io_1.Server(httpServer, {
        cors: {
            origin: ['http://localhost:5173', 'http://localhost:5174'],
            methods: ['GET', 'POST'],
            credentials: true
        }
    });
    io.on('connection', (socket) => {
        socket.on('register', (userId) => __awaiter(void 0, void 0, void 0, function* () {
            socketUsers.set(userId, socket.id);
        }));
        socket.on('message', (data, callback) => __awaiter(void 0, void 0, void 0, function* () {
            try {
                const { senderId, receiverId, senderModel, receiverModel, content } = data;
                new chatSchema_1.default({
                    senderId,
                    receiverId,
                    senderModel,
                    receiverModel,
                    content
                }).save()
                    .then((data) => {
                    const receiver = socketUsers.get(receiverId);
                    const { _id, content, createdAt, isViewed } = data;
                    callback({ senderId, receiverId, _id, content, createdAt, isViewed });
                    socket.to(receiver).emit('newMessage', { senderId, receiverId, _id, content, createdAt, isViewed });
                });
            }
            catch (error) {
                console.log('error');
            }
        }));
        socket.on('notification', (data) => __awaiter(void 0, void 0, void 0, function* () {
            try {
                const { senderId, receiverId, content } = data;
                notificationSchema_1.default.findOneAndUpdate({ receiverId: receiverId }, {
                    $push: { notifications: {
                            senderId,
                            content
                        } }
                }, { upsert: true, new: true })
                    .then((data) => {
                    const receiver = socketUsers.get(receiverId);
                    socket.to(receiver).emit('notification', (data));
                });
            }
            catch (error) {
                console.log(error);
            }
        }));
        socket.on("typing", (senderId, receiverId) => __awaiter(void 0, void 0, void 0, function* () {
            const receiversocketId = socketUsers.get(receiverId);
            socket.to(receiversocketId).emit("typing", senderId);
        }));
        socket.on("deRegister", (id) => __awaiter(void 0, void 0, void 0, function* () {
            socketUsers.delete(id);
        }));
        socket.on("stopTyping", (senderId, receiverId) => __awaiter(void 0, void 0, void 0, function* () {
            const receiversocketId = socketUsers.get(receiverId);
            socket.to(receiversocketId).emit("stopTyping", senderId);
        }));
        //  socket.on("new-meetting",async(data,callback)=>{
        //   console.log('new-meetting',data.roomId,data.userId)
        //   const {roomId,userId,name} = data
        //   if(!meetings[roomId]){
        //   meetings[roomId] = {hostId:userId,participants:[{name:name,id:userId}]}
        //   socket.join(roomId)
        //   callback('success')
        //   }
        //  })
        // socket.on('endCall',(data)=>{
        //   const {roomId,name} = data
        //   socket.leave(roomId)
        //   socket.broadcast.to(roomId).emit('leftCall',name)
        //   console.log('meeting in roomId is ended = ')
        // })
        //  socket.on("join-room",async(data,callback)=>{
        //   const {roomId,userId,name} = data
        //   if(!meetings[roomId]){
        //      callback('Invalid Room Id')
        //   }else{
        //     const userExists = meetings[roomId].participants.filter((item)=>item.name===name&&item.id===userId)
        //     if(userExists.length===0){
        //     meetings[roomId].participants.push({name:name,id:userId})
        //     socket.join(roomId)
        //     socket.broadcast.to(roomId).emit('newUserConnected',{message:`${name} joined the metting`})
        //     callback('success')
        //     }
        //   }
        //  })
        //  socket.on('offer',async(data)=>{
        //   const {roomId,offer} = data
        //   socket.broadcast.to(roomId).emit('offer',offer)
        //  })
        //  socket.on("answer",async(data)=>{
        //   console.log('answer ')
        //   const {roomId,answer} = data
        //   console.log('roomId = ',roomId)
        //   socket.broadcast.to(roomId).emit('answer',answer)
        //  })
        socket.on('disconnect', () => {
        });
    });
};
exports.default = initializeSocket;
