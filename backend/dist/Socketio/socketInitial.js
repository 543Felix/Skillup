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
        const userId = socket.handshake.query.userId;
        if (userId) {
            socketUsers.set(userId, socket.id);
            console.log('newUser joined on register = ', userId);
            io.emit('onlineUsers', userId);
        }
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
        socket.on('deleteMsg', (data, callback) => __awaiter(void 0, void 0, void 0, function* () {
            console.log('listened for message');
            const { mesId, receiverId, date } = data;
            chatSchema_1.default.deleteOne({ _id: new mongodb_1.ObjectId(mesId) })
                .then(() => {
                const recieverScktId = socketUsers.get(receiverId);
                console.log('recieverScktId = ', recieverScktId);
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
        //  console.log('user exited from the site deRegister  = ')
        //     socket.emit('exitChat')
        socket.on("stopTyping", (senderId, receiverId) => __awaiter(void 0, void 0, void 0, function* () {
            const receiversocketId = socketUsers.get(receiverId);
            socket.to(receiversocketId).emit("stopTyping", senderId);
        }));
        socket.on('msgViewed', (data) => __awaiter(void 0, void 0, void 0, function* () {
            const { senderId, receiverId } = data;
            const receiverSocketId = socketUsers.get(receiverId);
            console.log('receiverSocketId listening on msgViewed = ', receiverSocketId);
            socket.to(receiverSocketId).emit('msgViewed', { senderId, receiverId });
        }));
        socket.on('disconnect', () => {
            let userId;
            for (let [key, value] of socketUsers.entries()) {
                if (value === socket.id) {
                    userId = key;
                    socketUsers.delete(key);
                }
            }
            console.log('userDisconnects');
            io.emit('goesOffline', userId);
        });
    });
};
const getOnlineUsers = () => {
    const users = [...socketUsers.keys()];
    console.log('usersOnline on socket initialisation = ', users);
    return users;
};
exports.getOnlineUsers = getOnlineUsers;
exports.default = initializeSocket;
