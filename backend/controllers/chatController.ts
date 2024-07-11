import { Request, Response } from "express";
import Chat from "../models/chatSchema";
import { ObjectId } from "mongodb";

const getAllChats = (req: Request, res: Response) => {
  const { id } = req.params;
  const objectId = new ObjectId(id as string);
  const getChatWithLookups = async () => {
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

      const lookupFromDevelopers = Chat.aggregate([
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

      const lookupFromCompanies = Chat.aggregate([
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

      const [developersResults, companiesResults] = await Promise.all([
        lookupFromDevelopers,
        lookupFromCompanies,
      ]);

      const combinedResults = [...developersResults, ...companiesResults];
      combinedResults.sort(
        (a, b) =>
          new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
      );
      res.status(200).json(combinedResults);
    } catch (error) {
      console.error(error);
      res.json({ error });
    }
  };
  getChatWithLookups();
};

const getIndividualMessages = (req: Request, res: Response) => {
  try {
    const { senderId, receiverId } = req.query;
    const userIds = [
      new ObjectId(senderId as string),
      new ObjectId(receiverId as string),
    ];
    Chat.aggregate([
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
  } catch (error) {}
};

const sendMessage = (req: Request, res: Response) => {
  try {
    const { senderId, receiverId, senderModel, receiverModel, content } =
      req.body;
    new Chat({
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
  } catch (error) {
    res.status(500).json({ message: "Error occureed while storing message" });
  }
};

export const ChatController = {
  getAllChats,
  sendMessage,
  getIndividualMessages,
};
