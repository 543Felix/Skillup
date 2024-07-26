import { Server } from 'socket.io';
import { Server as HTTPServer } from 'http';
import Chat from '../models/chatSchema';
import Notification from '../models/notificationSchema'
import { ObjectId } from 'mongodb';


const socketUsers= new Map()



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
      callback({senderId,receiverId,_id,content,createdAt,isViewed,type});
      socket.to(receiver).emit('newMessage',{senderId,receiverId,_id,content,createdAt,isViewed,type})
    })    
      } catch (error) {
        console.log('error')
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
