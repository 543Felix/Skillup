import { Request,Response } from "express";
import Notification from "../models/notificationSchema";
import { ObjectId } from "mongodb";


const getNotifications = (req:Request,res:Response)=>{
    const {id,role} = req.params
    Notification.aggregate([
        {$match:{receiverId: new ObjectId(id as string)}},
        {$unwind:'$notifications'},
        {
            $lookup:{
                from:role,
                foreignField:"_id",
                localField:"notifications.senderId",
                as:'senderData'
            }
        },{
            $project:{
                _id:0,
                id:"$notifications._id",
                content:"$notifications.content",
                createdAt:"$notifications.createdAt",
                image:"$senderData.image",
                name:role==='companies'?"$senderData.companyName":"$senderData.name"
            }
        }
    ]).then((data)=>{
       res.status(200).json(data)
    })
   
}

const deleteNotification = (req:Request,res:Response)=>{
    const {id,notificationId} = req.params
    try {
    const objectId = new ObjectId(id as string)
    Notification.findOneAndUpdate(
        {receiverId:objectId},
        {$pull:{
            notifications:{
                _id: new ObjectId(notificationId)
            }
        }}
    )
    .then(()=>{
        res.status(200).json({message:'notification successfully removed'})
    })
    } catch (error) {
      console.log('error  = ',error)  
    }
    

}

export const notificationController ={
    getNotifications,
    deleteNotification
}