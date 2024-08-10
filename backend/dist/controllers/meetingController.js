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
exports.meetingController = void 0;
const meetingShema_1 = __importDefault(require("../models/meetingShema"));
const JoinRoom = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { _id, name, roomId } = req.body;
    try {
        const callAlreadyExists = yield meetingShema_1.default.find({ roomId: roomId, isCallEnded: false });
        if (!callAlreadyExists || callAlreadyExists.length === 0) {
            const newMeeting = new meetingShema_1.default({
                roomId: roomId,
                createdBy: name,
                members: [{ _id, name }]
            });
            newMeeting.save().then(() => {
                return res.status(201).json({ message: 'successfully saved' });
            });
        }
        else {
            meetingShema_1.default.findOneAndUpdate({ roomId: roomId, isCallEnded: false }, {
                $addToSet: { members: { _id, name } }
            })
                .then(() => {
                res.status(201).json({ message: 'succesfully added new user' });
            });
        }
    }
    catch (error) {
    }
});
const endMeeting = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { roomId, duration } = req.body;
    try {
        meetingShema_1.default.findOneAndUpdate({ roomId: roomId, isCallEnded: false }, { isCallEnded: true, callDuration: duration })
            .then(() => {
            res.status(201).json({ message: 'successfully updated' });
        });
    }
    catch (error) {
        res.status(500).json({ message: 'An unexpected error occurred' });
    }
});
const getMeetingHistory = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { id } = req.params;
    meetingShema_1.default.aggregate([
        {
            $match: {
                "members._id": id,
                isCallEnded: true
            }
        },
        {
            $addFields: {
                creatorName: {
                    $arrayElemAt: [
                        {
                            $filter: {
                                input: "$members",
                                as: "member",
                                cond: { $eq: ["$$member._id", "$createdBy"] }
                            }
                        },
                        0
                    ]
                }
            }
        },
        {
            $project: {
                _id: 1,
                roomId: 1,
                createdBy: "$creatorName.name",
                members: 1,
                createdAt: 1,
                callDuration: 1
            }
        }
    ]).then((data) => {
        res.status(200).json(data);
    });
});
exports.meetingController = {
    JoinRoom,
    endMeeting,
    getMeetingHistory
};
