"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.notificationController = void 0;
const notificationSchema_1 = __importDefault(require("../models/notificationSchema"));
const mongodb_1 = require("mongodb");
const getNotifications = (req, res) => {
    const { id, role } = req.params;
    notificationSchema_1.default.aggregate([
        { $match: { receiverId: new mongodb_1.ObjectId(id) } },
        { $unwind: '$notifications' },
        {
            $lookup: {
                from: role,
                foreignField: "_id",
                localField: "notifications.senderId",
                as: 'senderData'
            }
        }, {
            $project: {
                _id: 0,
                id: "$notifications._id",
                content: "$notifications.content",
                createdAt: "$notifications.createdAt",
                image: "$senderData.image",
                name: role === 'companies' ? "$senderData.companyName" : "$senderData.name"
            }
        }
    ]).then((data) => {
        res.status(200).json(data);
    });
};
const deleteNotification = (req, res) => {
    const { id, notificationId } = req.params;
    try {
        const objectId = new mongodb_1.ObjectId(id);
        notificationSchema_1.default.findOneAndUpdate({ receiverId: objectId }, { $pull: {
                notifications: {
                    _id: new mongodb_1.ObjectId(notificationId)
                }
            } })
            .then(() => {
            res.status(200).json({ message: 'notification successfully removed' });
        });
    }
    catch (error) {
        console.log('error  = ', error);
    }
};
exports.notificationController = {
    getNotifications,
    deleteNotification
};
