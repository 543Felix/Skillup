import { Server } from 'socket.io';
import { Server as HTTPServer } from 'http';
import Chat from '../models/chatSchema';
import Notification from '../models/notificationSchema'


const socketUsers= new Map()

interface participantDetails{
  name:string;
  id:string
}
interface Meeting {
    hostId: string;
    participants: participantDetails[];
}

const meetings: { [key: string]: Meeting } = {};

const initializeSocket = (httpServer:HTTPServer) => {
  const io = new Server(httpServer, {
    cors: {
      origin: ['http://localhost:5173', 'http://localhost:5174'], 
      methods: ['GET', 'POST'],
      credentials: true
    }
  });

  io.on('connection', (socket) => {

    socket.on('register',async(userId)=>{
      socketUsers.set(userId,socket.id)
      
    })
      socket.on('message',async(data,callback)=>{
      try {
         const {senderId,receiverId,senderModel,receiverModel,content,type} = data
         console.log('type on backend = ',type)
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
      callback({senderId,receiverId,_id,content,createdAt,isViewed,type});
      socket.to(receiver).emit('newMessage',{senderId,receiverId,_id,content,createdAt,isViewed,type})
    })    
      } catch (error) {
        console.log('error')
      }
      
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

  socket.on("deRegister",async(id)=>{
    socketUsers.delete(id)
  })

  socket.on("stopTyping",async(senderId,receiverId)=>{
    const receiversocketId = socketUsers.get(receiverId)
    socket.to(receiversocketId).emit("stopTyping",senderId)
  })

  


    socket.on('disconnect',()=>{

    });  
  },);
};

export default initializeSocket;
