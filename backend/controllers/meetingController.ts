import { Request, Response } from "express";
import Meeting from "../models/meetingShema";




const getMeetingHistory = async(req:Request,res:Response)=>{
  const {id} = req.params
  Meeting.aggregate([
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
  ]).then((data)=>{
    res.status(200).json(data)
  })
}

   export const meetingController = {
     getMeetingHistory
   }