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
                const { senderId, receiverId, senderModel, receiverModel, content, type } = data;
                console.log('type on backend = ', type);
                new chatSchema_1.default({
                    senderId,
                    receiverId,
                    senderModel,
                    receiverModel,
                    content,
                    type
                }).save()
                    .then((data) => {
                    const receiver = socketUsers.get(receiverId);
                    const { _id, content, createdAt, isViewed, type } = data;
                    callback({ senderId, receiverId, _id, content, createdAt, isViewed, type });
                    socket.to(receiver).emit('newMessage', { senderId, receiverId, _id, content, createdAt, isViewed, type });
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
        socket.on("new-meetting", (data, callback) => __awaiter(void 0, void 0, void 0, function* () {
            const { roomId, userId, name } = data;
            if (!meetings[roomId]) {
                meetings[roomId] = { hostId: userId, participants: [{ name: name, id: userId }] };
                socket.join(roomId);
                callback('success');
            }
        }));
        // socket.on("exitFromRoom",(data,callback)=>{
        //   console.log('listening to Exiting from room ')
        //   const {roomId,id} = data
        //   let name
        //   const filteredArr:participantDetails[] = meetings[roomId].participants.filter((user)=>{
        //     if(user.id===id){
        //       name = user.name
        //     }
        //    return user.id!==id
        // })
        //   console.log('Rest participants = ',filteredArr)
        //    meetings[roomId].participants=filteredArr
        //    console.log('meetings participants= ',meetings[roomId].participants)
        //    socket.broadcast.to(roomId).emit('exitedUser',name)
        //    callback('success')   
        // })   
        socket.on('endCall', (data, callback) => {
            const { roomId, name } = data;
            if (meetings[roomId]) {
                const newParticipants = meetings[roomId].participants.filter((item) => item.name !== name);
                meetings[roomId].participants = newParticipants;
                socket.leave(roomId);
                socket.broadcast.to(roomId).emit('leftCall', name);
                callback('success');
            }
        });
        // socket.on('reqToJoinRroom',async(data)=>{
        // })
        socket.on("join-room", (data, callback) => __awaiter(void 0, void 0, void 0, function* () {
            const { roomId, userId, name } = data;
            if (!meetings[roomId]) {
                callback('Invalid Room Id');
            }
            else {
                const userExists = meetings[roomId].participants.filter((item) => item.name === name && item.id === userId);
                if (userExists.length === 0) {
                    meetings[roomId].participants.push({ name: name, id: userId });
                    socket.join(roomId);
                    const existingParticipants = meetings[roomId].participants.filter((userid) => userid.id !== userId);
                    console.log('existingParticipants = ', existingParticipants);
                    existingParticipants.forEach((item) => {
                        const socketId = socketUsers.get(item.id);
                        console.log('socketId of each memberes in existingParticipants = ', socketId);
                        socket.to(socketId).emit('newUserConnected', { message: `${name} joined the metting`, userId, userName: name });
                    });
                    callback('success');
                }
                else {
                    callback('you Already exists on the metting');
                }
            }
        }));
        socket.on('offer', (data) => __awaiter(void 0, void 0, void 0, function* () {
            const { sender, to, offer, senderName } = data;
            const socketId = socketUsers.get(to);
            console.log('recieverSocketId on offer Listening = ', socketId);
            console.log('sender on offer Listening = ', senderName);
            socket.to(socketId).emit('offer', { sender, offer, senderName });
        }));
        socket.on("answer", (data) => __awaiter(void 0, void 0, void 0, function* () {
            const { to, sender, answer } = data;
            const socketId = socketUsers.get(to);
            console.log('socketId of answer sender on answer listening = ', socketId);
            socket.to(socketId).emit('answer', { sender, answer });
        }));
        socket.on('iceCandidate', (data) => __awaiter(void 0, void 0, void 0, function* () {
            const { iceCandidate, sender, roomId } = data;
            const otherMembers = meetings[roomId].participants.filter(user => user.id !== sender);
            console.log('otherMember listening on icecandidate = ', otherMembers);
            socket.emit('new-iceCandidate', { sender, iceCandidate });
        }));
        socket.on('disconnect', () => {
        });
    });
};
exports.default = initializeSocket;
