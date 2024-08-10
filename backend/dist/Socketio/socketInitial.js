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
exports.getOnlineUsers = void 0;
const socket_io_1 = require("socket.io");
const chatSchema_1 = __importDefault(require("../models/chatSchema"));
const notificationSchema_1 = __importDefault(require("../models/notificationSchema"));
const mongodb_1 = require("mongodb");
const short_unique_id_1 = __importDefault(require("short-unique-id"));
const meetingShema_1 = __importDefault(require("../models/meetingShema"));
const socketUsers = new Map();
const meetings = new Map();
const formatDuration = (duration) => {
    const hours = Math.floor(duration / 3600);
    const minutes = Math.floor((duration % 3600) / 60);
    const seconds = duration % 60;
    return `${hours}h ${minutes}m ${seconds}s`;
};
const initializeSocket = (httpServer) => {
    const io = new socket_io_1.Server(httpServer, {
        cors: {
            origin: ['http://localhost:5173', 'http://localhost:5174'],
            methods: ['GET', 'POST'],
            credentials: true
        }
    });
    io.on('connection', (socket) => {
        const userId = socket.handshake.query.userId;
        if (userId) {
            socketUsers.set(userId, socket.id);
            io.emit('onlineUsers', userId);
        }
        socket.on('message', (data, callback) => __awaiter(void 0, void 0, void 0, function* () {
            try {
                const { senderId, receiverId, senderModel, receiverModel, content, type } = data;
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
                    socket.to(receiver).emit('unReadMes', senderId);
                });
            }
            catch (error) {
                console.log('error');
            }
        }));
        socket.on('deleteMsg', (data, callback) => __awaiter(void 0, void 0, void 0, function* () {
            const { mesId, receiverId, date } = data;
            chatSchema_1.default.deleteOne({ _id: new mongodb_1.ObjectId(mesId) })
                .then(() => {
                const recieverScktId = socketUsers.get(receiverId);
                if (recieverScktId) {
                    socket.to(recieverScktId).emit('msgDeleted', { mesId, date });
                }
                callback('sucess');
            });
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
        socket.on("stopTyping", (senderId, receiverId) => __awaiter(void 0, void 0, void 0, function* () {
            const receiversocketId = socketUsers.get(receiverId);
            socket.to(receiversocketId).emit("stopTyping", senderId);
        }));
        socket.on('msgViewed', (data) => __awaiter(void 0, void 0, void 0, function* () {
            const { senderId, receiverId } = data;
            const receiverSocketId = socketUsers.get(receiverId);
            socket.to(receiverSocketId).emit('msgViewed', { senderId, receiverId });
        }));
        socket.on('newMeeting', (data, callback) => __awaiter(void 0, void 0, void 0, function* () {
            const { _id, name } = data;
            const { randomUUID } = new short_unique_id_1.default();
            const roomId = randomUUID();
            console.log('roomId = ', roomId);
            const startDate = new Date();
            meetings.set(roomId, { members: [{ _id, name }], startDate: startDate });
            const newMeeting = new meetingShema_1.default({
                roomId: roomId,
                createdBy: _id,
                members: [{ _id, name }]
            });
            newMeeting.save().then(() => {
                callback(roomId);
            });
            // callback
        }));
        socket.on('joinRoom', (data, callback) => __awaiter(void 0, void 0, void 0, function* () {
            const { roomId, _id, name } = data;
            const roomDetails = meetings.get(roomId);
            if (roomDetails) {
                roomDetails.members.push({ _id, name });
                meetingShema_1.default.findOneAndUpdate({ roomId: roomId, isCallEnded: false }, {
                    $addToSet: { members: { _id, name } }
                })
                    .then(() => {
                    callback('success');
                });
            }
            else {
                callback('Room not found either create a new room or try another roomId');
            }
        }));
        socket.on('leaveRoom', (data, callback) => __awaiter(void 0, void 0, void 0, function* () {
            const { _id, roomId } = data;
            const meetingData = meetings.get(roomId);
            meetingData.members = meetingData.members.filter((item) => item._id !== _id);
            if (meetingData.members.length === 0) {
                const endDate = new Date();
                const callDuration = Math.floor((endDate.getTime() - meetingData.startDate.getTime()) / 1000);
                const formattedDuration = formatDuration(callDuration);
                yield meetingShema_1.default.findOneAndUpdate({ roomId: roomId, isCallEnded: false }, { isCallEnded: true, callDuration: formattedDuration });
                callback('success');
                meetings.delete(roomId);
            }
            else {
                meetings.set(roomId, meetingData);
                callback('success');
            }
        }));
        socket.on('disconnect', () => {
            let userId;
            for (let [key, value] of socketUsers.entries()) {
                if (value === socket.id) {
                    userId = key;
                    socketUsers.delete(key);
                }
            }
            io.emit('goesOffline', userId);
        });
    });
};
const getOnlineUsers = () => {
    const users = [...socketUsers.keys()];
    return users;
};
exports.getOnlineUsers = getOnlineUsers;
exports.default = initializeSocket;
