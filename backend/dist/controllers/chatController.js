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
const getAllChats = (req, res) => {
    const { id } = req.params;
    const objectId = new mongodb_1.ObjectId(id);
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
                    },
                },
                {
                    $project: {
                        _id: 0,
                        id: 1,
                        name: 1,
                        image: 1,
                        lastMessage: 1,
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
                    },
                },
                {
                    $project: {
                        _id: 0,
                        id: 1,
                        name: 1,
                        image: 1,
                        lastMessage: 1,
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
            res.status(200).json(combinedResults);
        }
        catch (error) {
            console.error(error);
            res.json({ error });
        }
    });
    getChatWithLookups();
};
const getIndividualMessages = (req, res) => {
    try {
        const { senderId, receiverId } = req.query;
        const userIds = [
            new mongodb_1.ObjectId(senderId),
            new mongodb_1.ObjectId(receiverId),
        ];
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
};
const sendMessage = (req, res) => {
    try {
        const { senderId, receiverId, senderModel, receiverModel, content } = req.body;
        new chatSchema_1.default({
            senderId,
            receiverId,
            senderModel,
            receiverModel,
            content,
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
exports.ChatController = {
    getAllChats,
    sendMessage,
    getIndividualMessages,
};
