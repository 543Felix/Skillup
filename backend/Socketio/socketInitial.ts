import { Server } from 'socket.io';
import { Server as HTTPServer } from 'http';
import Chat from '../models/chatSchema';
import Notification from '../models/notificationSchema'
import { ObjectId } from 'mongodb';
import ShortUniqueId from 'short-unique-id'
import Meeting from '../models/meetingShema'


const socketUsers= new Map()

const meetings = new Map() 


const formatDuration = (duration: number) => {
  const hours = Math.floor(duration / 3600);
  const minutes = Math.floor((duration % 3600) / 60);
  const seconds = duration % 60;
  return `${hours}h ${minutes}m ${seconds}s`;
};



const initializeSocket = (httpServer:HTTPServer) => {
  const io = new Server(httpServer, {
    cors: {
      origin: ['http://localhost:5173', 'http://localhost:5174'], 
      methods: ['GET', 'POST'],
      credentials: true
    }
  });

  io.on('connection', (socket) => {

     const userId = socket.handshake.query.userId;
     if(userId){
       socketUsers.set(userId,socket.id)
      io.emit('onlineUsers',userId)
     }

   

    socket.on('message',async(data,callback)=>{
      try {
         const {senderId,receiverId,senderModel,receiverModel,content,type} = data
      new Chat({  
        senderId,
        receiverId,
        senderModel,
        receiverModel,
        content,
        type
      }).save()
    .then((data)=>{
      const receiver = socketUsers.get(receiverId)
      const {_id,content,createdAt,isViewed,type} = data
      socket.to(receiver).emit('unReadMes',{senderId})
      socket.to(receiver).emit('newMessage',{senderId,receiverId,_id,content,createdAt,isViewed,type})
       console.log('receiver = ',receiver)
      callback({senderId,receiverId,_id,content,createdAt,isViewed,type});
    })    
      } catch (error) {
      }
      
     })
     socket.on('deleteMsg',async(data,callback)=>{
      const {mesId,receiverId,date} = data
       Chat.deleteOne({_id:new ObjectId(mesId as string)})
  .then(()=>{    
    const recieverScktId = socketUsers.get(receiverId)
    if(recieverScktId){
      socket.to(recieverScktId).emit('msgDeleted',{mesId,date})
      
    }
    callback('sucess')  
  })
     })
  socket.on('notification',async(data)=>{
    try {
     const {senderId,receiverId,content} = data 
     Notification.findOneAndUpdate(
      {receiverId:receiverId},{
        $push:{notifications:{
          senderId,
          content
        }}
      },{upsert: true,new:true}
     )
     .then((data)=>{
      const receiver = socketUsers.get(receiverId)
      socket.to(receiver).emit('notification',(data))
     })
    } catch (error) {
      console.log(error)
    }
  })
  socket.on("typing",async(senderId,receiverId)=>{
    const receiversocketId = socketUsers.get(receiverId)
    socket.to(receiversocketId).emit("typing",senderId)
  })

  

 

  socket.on("stopTyping",async(senderId,receiverId)=>{
    const receiversocketId = socketUsers.get(receiverId)
    socket.to(receiversocketId).emit("stopTyping",senderId)
  })

  
 
  socket.on('msgViewed',async(data)=>{
    const {senderId,receiverId} = data
    const receiverSocketId =  socketUsers.get(receiverId)
    socket.to(receiverSocketId).emit('msgViewed',{senderId,receiverId})
    
  })
  
  socket.on('newMeeting',async(data,callback)=>{
    const {_id,name} = data
    const { randomUUID } = new ShortUniqueId()
    const roomId = randomUUID()
    const startDate = new Date()
    meetings.set(roomId,{members:[{_id,name}],startDate:startDate})
  const newMeeting =   new Meeting({
      roomId:roomId,
      createdBy:_id,
      members:[{_id,name}]
    })
    newMeeting.save().then(()=>{
      callback(roomId)
    })
    // callback
  })

  socket.on('joinRoom',async(data,callback)=>{
    const {roomId,_id,name} = data
    const roomDetails = meetings.get(roomId)
    if(roomDetails){
      roomDetails.members.push({_id,name})
      Meeting.findOneAndUpdate({roomId:roomId,isCallEnded:false},{
        $addToSet:{members:{_id,name}}
      })
      .then(()=>{
        callback('success')
      }) 
    }else{
      callback('Room not found either create a new room or try another roomId')
    }
  })
  socket.on('leaveRoom',async(data,callback)=>{
    const {_id,roomId} = data
    const meetingData = meetings.get(roomId)
    meetingData.members = meetingData.members.filter((item:{[key:string]:string})=>item._id!==_id)
    if(meetingData.members.length===0){
      const endDate:Date = new Date()
      const callDuration = Math.floor((endDate.getTime() - meetingData.startDate.getTime()) / 1000); 
      const formattedDuration = formatDuration(callDuration);
     await Meeting.findOneAndUpdate({roomId:roomId,isCallEnded:false},{isCallEnded:true,callDuration:formattedDuration})
          callback('success')
        meetings.delete(roomId)
    }else{
      meetings.set(roomId,meetingData)
      callback('success')
    }
  })


    socket.on('disconnect',()=>{
      let userId 
        for(let [key,value] of socketUsers.entries()){
           if(value ===socket.id){
            userId = key
            socketUsers.delete(key)
          }
        }
         io.emit('goesOffline',userId)
    });  
    
  },);
};

export const getOnlineUsers =()=>{
  const users = [...socketUsers.keys()]
  return users
}

export default initializeSocket;



      

