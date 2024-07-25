import { Server } from 'socket.io';
import { Server as HTTPServer } from 'http';
import Chat from '../models/chatSchema';
import Notification from '../models/notificationSchema'
import { ObjectId } from 'mongodb';


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

     const userId = socket.handshake.query.userId;
     if(userId){
       socketUsers.set(userId,socket.id)
      console.log('newUser joined on register = ',userId)
      io.emit('onlineUsers',userId)
     }

   

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
     socket.on('deleteMsg',async(data,callback)=>{
      console.log('listened for message')
      const {mesId,receiverId,date} = data
       Chat.deleteOne({_id:new ObjectId(mesId as string)})
  .then(()=>{    
    const recieverScktId = socketUsers.get(receiverId)
    console.log('recieverScktId = ',recieverScktId)
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

  //  console.log('user exited from the site deRegister  = ')
  //     socket.emit('exitChat')

 

  socket.on("stopTyping",async(senderId,receiverId)=>{
    const receiversocketId = socketUsers.get(receiverId)
    socket.to(receiversocketId).emit("stopTyping",senderId)
  })
 
  socket.on('msgViewed',async(data)=>{
    const {senderId,receiverId} = data
    const receiverSocketId =  socketUsers.get(receiverId)
    console.log('receiverSocketId listening on msgViewed = ',receiverSocketId)
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
        console.log('userDisconnects')
         io.emit('goesOffline',userId)
    });  
    
  },);
};

export const getOnlineUsers =()=>{
  const users = [...socketUsers.keys()]
  console.log('usersOnline on socket initialisation = ',users)
  return users
}

export default initializeSocket;
