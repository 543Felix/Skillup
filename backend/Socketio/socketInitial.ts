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
         const {senderId,receiverId,senderModel,receiverModel,content} = data
      new Chat({
        senderId,
        receiverId,
        senderModel,
        receiverModel,
        content
      }).save()
    .then((data)=>{
      const receiver = socketUsers.get(receiverId)
      const {_id,content,createdAt,isViewed} = data
      callback({senderId,receiverId,_id,content,createdAt,isViewed});
      socket.to(receiver).emit('newMessage',{senderId,receiverId,_id,content,createdAt,isViewed})
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

   socket.on("new-meetting",async(data,callback)=>{
    console.log('new-meetting',data.roomId,data.userId)
    const {roomId,userId,name} = data
    if(!meetings[roomId]){
    meetings[roomId] = {hostId:userId,participants:[{name:name,id:userId}]}
    
    socket.join(roomId)
    // callback({ success: true, roomId, userId });
    // socket.broadcast.to(roomId).emit('newUserConnected',{message:`${name} joined the metting`})
    callback('success')
    }
   })

//  socket.on("ice-candidate",async(data)=>{
//   const {roomId,candidate} = data
//   socket.broadcast.to(roomId).emit(candidate)
//  })
 
// socket.on("exitFromRoom",(data,callback)=>{
//   console.log('listening to Exiting from room ')
//   const {roomId,id} = data
//   let name
//   const filteredArr:participantDetails[] = meetings[roomId].participants.filter((user)=>{
//     if(user.id===id){
//       name = user.name
//     }
//    return user.id!==id
// })
//   console.log('Rest participants = ',filteredArr)
//    meetings[roomId].participants=filteredArr
//    console.log('meetings participants= ',meetings[roomId].participants)
//    socket.broadcast.to(roomId).emit('exitedUser',name)
//    callback('success')   
// })   

socket.on('endCall',(data)=>{
  const {roomId,name} = data
  socket.leave(roomId)
  socket.broadcast.to(roomId).emit('leftCall',name)
  console.log('meeting in roomId is ended = ')
})

   socket.on("join-room",async(data,callback)=>{
    const {roomId,userId,name} = data
    if(!meetings[roomId]){
       callback('Invalid Room Id')
    }else{
      const userExists = meetings[roomId].participants.filter((item)=>item.name===name&&item.id===userId)
      if(userExists.length===0){
      meetings[roomId].participants.push({name:name,id:userId})
      socket.join(roomId)
      socket.broadcast.to(roomId).emit('newUserConnected',{message:`${name} joined the metting`})
      callback('success')
      }
    }
   })

   socket.on('offer',async(data)=>{
    const {roomId,offer} = data
    socket.broadcast.to(roomId).emit('offer',offer)
   })

   socket.on("answer",async(data)=>{
    console.log('answer ')
    const {roomId,answer} = data
    console.log('roomId = ',roomId)
    socket.broadcast.to(roomId).emit('answer',answer)
   })


   console.log('connectedUsers = ',socketUsers)
    socket.on('disconnect',()=>{

    });  
  },);
};

export default initializeSocket;
