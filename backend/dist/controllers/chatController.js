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
exports.ChatController = void 0;
const chatSchema_1 = __importDefault(require("../models/chatSchema"));
const mongodb_1 = require("mongodb");
const socketInitial_1 = require("../Socketio/socketInitial");
const getAllChats = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { id } = req.params;
    const objectId = new mongodb_1.ObjectId(id);
    const onlineUsers = (0, socketInitial_1.getOnlineUsers)();
    const getChatWithLookups = () => __awaiter(void 0, void 0, void 0, function* () {
        try {
            const matchStage = {
                $match: {
                    $or: [{ senderId: objectId }, { receiverId: objectId }],
                },
            };
            const addFieldsStage = {
                $addFields: {
                    lookupModel: {
                        $cond: {
                            if: { $eq: ["$senderId", objectId] },
                            then: "companies",
                            else: "developers",
                        },
                    },
                    lookupId: {
                        $cond: {
                            if: { $eq: ["$senderId", objectId] },
                            then: "$receiverId",
                            else: "$senderId",
                        },
                    },
                },
            };
            const lookupFromDevelopers = chatSchema_1.default.aggregate([
                matchStage,
                addFieldsStage,
                {
                    $lookup: {
                        from: "developers",
                        localField: "lookupId",
                        foreignField: "_id",
                        as: "lookupDocument",
                    },
                },
                {
                    $unwind: "$lookupDocument",
                },
                {
                    $sort: { createdAt: -1 }, // Sort by timestamp descending
                },
                {
                    $group: {
                        _id: "$lookupId",
                        name: { $first: "$lookupDocument.name" },
                        image: { $first: "$lookupDocument.image" },
                        id: { $first: "$lookupDocument._id" },
                        lastMessage: { $first: "$content" },
                        createdAt: { $first: "$createdAt" },
                        type: { $first: "$type" }
                    },
                },
                {
                    $project: {
                        _id: 0,
                        id: 1,
                        name: 1,
                        image: 1,
                        lastMessage: 1,
                        type: 1,
                        createdAt: 1,
                    },
                },
            ]);
            const lookupFromCompanies = chatSchema_1.default.aggregate([
                matchStage,
                addFieldsStage,
                {
                    $lookup: {
                        from: "companies",
                        localField: "lookupId",
                        foreignField: "_id",
                        as: "lookupDocument",
                    },
                },
                {
                    $unwind: "$lookupDocument",
                },
                {
                    $sort: { createdAt: -1 },
                },
                {
                    $group: {
                        _id: "$lookupId",
                        name: { $first: "$lookupDocument.companyName" },
                        image: { $first: "$lookupDocument.image" },
                        id: { $first: "$lookupDocument._id" },
                        lastMessage: { $first: "$content" },
                        createdAt: { $first: "$createdAt" },
                        type: { $first: "$type" }
                    },
                },
                {
                    $project: {
                        _id: 0,
                        id: 1,
                        name: 1,
                        image: 1,
                        lastMessage: 1,
                        type: 1,
                        createdAt: 1,
                    },
                },
            ]);
            const [developersResults, companiesResults] = yield Promise.all([
                lookupFromDevelopers,
                lookupFromCompanies,
            ]);
            const combinedResults = [...developersResults, ...companiesResults];
            combinedResults.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
            console.log('usersOnline = ', onlineUsers);
            res.status(200).json({ chats: combinedResults, onlineUsers });
        }
        catch (error) {
            console.error(error);
            res.json({ error });
        }
    });
    getChatWithLookups();
});
const getIndividualMessages = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { senderId, receiverId } = req.query;
        const userIds = [
            new mongodb_1.ObjectId(senderId),
            new mongodb_1.ObjectId(receiverId),
        ];
        yield chatSchema_1.default.updateMany({
            senderId: new mongodb_1.ObjectId(receiverId),
            receiverId: new mongodb_1.ObjectId(senderId),
            isViewed: false,
        }, {
            $set: { isViewed: true }
        });
        chatSchema_1.default.aggregate([
            {
                $match: {
                    $and: [
                        { senderId: { $in: userIds } },
                        { receiverId: { $in: userIds } },
                    ],
                },
            },
            {
                $sort: { createdAt: 1 },
            },
            {
                $group: {
                    _id: { $dateToString: { format: "%Y-%m-%d", date: "$createdAt" } },
                    chats: {
                        $push: {
                            _id: "$_id",
                            senderId: "$senderId",
                            receiverId: "$receiverId",
                            content: "$content",
                            status: "$status",
                            createdAt: "$createdAt",
                            type: "$type",
                            isViewed: "$isViewed",
                        },
                    },
                },
            },
            {
                $project: {
                    _id: 0,
                    date: "$_id",
                    chats: 1,
                },
            },
            {
                $sort: { date: 1 },
            },
        ]).then((data) => {
            res.status(200).json({ data });
        });
    }
    catch (error) { }
});
const sendMessage = (req, res) => {
    try {
        const { senderId, receiverId, senderModel, receiverModel, content, type } = req.body;
        new chatSchema_1.default({
            senderId,
            receiverId,
            senderModel,
            receiverModel,
            content,
            type
        })
            .save()
            .then(() => {
            res.status(200).json({ message: "message Saved" });
        });
    }
    catch (error) {
        res.status(500).json({ message: "Error occureed while storing message" });
    }
};
const setMessageViewed = (req, res) => {
    const { id } = req.query;
    chatSchema_1.default.updateMany({ _id: new mongodb_1.ObjectId(id) }, { isViewed: false })
        .then(() => {
        res.status(200);
    });
};
const DeleteMessage = (req, res) => {
    const { id } = req.params;
    chatSchema_1.default.deleteOne({ _id: new mongodb_1.ObjectId(id) })
        .then(() => {
        res.status(200).json({ message: 'chat Deleted' });
    });
};
const unReadMessagesCount = (req, res) => {
    const { id } = req.params;
    chatSchema_1.default.aggregate([
        { $match: { receiverId: new mongodb_1.ObjectId(id), isViewed: false } },
        { $group: { _id: '$senderId', count: { $sum: 1 } } },
    ]).then((data) => {
        res.status(200).json(data);
    });
};
exports.ChatController = {
    getAllChats,
    sendMessage,
    getIndividualMessages,
    setMessageViewed,
    DeleteMessage,
    unReadMessagesCount
};
