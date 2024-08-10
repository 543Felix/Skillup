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
    getMeetingHistory
};
