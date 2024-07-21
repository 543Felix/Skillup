import { Server, Socket } from 'socket.io';
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

   socket.on("new-meetting",async(data,callback)=>{
    const {roomId,userId,name} = data
    if(!meetings[roomId]){
    meetings[roomId] = {hostId:userId,participants:[{name:name,id:userId}]}
    
    socket.join(roomId)
    callback('success')
    }
   })


 
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

socket.on('endCall',(data,callback)=>{
  const {roomId,name} = data
  if(meetings[roomId]){
    
 const newParticipants =    meetings[roomId].participants.filter((item)=>item.name!==name)
 meetings[roomId].participants = newParticipants
 socket.leave(roomId)
  socket.broadcast.to(roomId).emit('leftCall',name)
  callback('success')
  }
  
})
  // socket.on('reqToJoinRroom',async(data)=>{

  // })
   socket.on("join-room",async(data,callback)=>{
    const {roomId,userId,name} = data
    if(!meetings[roomId]){
       callback('Invalid Room Id')
    }else{
      const userExists = meetings[roomId].participants.filter((item)=>item.name===name&&item.id===userId)
      if(userExists.length===0){
      meetings[roomId].participants.push({name:name,id:userId})
      socket.join(roomId)
    const existingParticipants =  meetings[roomId].participants.filter((userid)=>userid.id!==userId)
    console.log('existingParticipants = ',existingParticipants)
      existingParticipants.forEach((item)=>{
        const socketId = socketUsers.get(item.id)
        console.log('socketId of each memberes in existingParticipants = ',socketId)
        socket.to(socketId).emit('newUserConnected',{message:`${name} joined the metting`,userId,userName:name})
      })
      callback('success')
      }else{
        callback('you Already exists on the metting')
      }
    }
   })

   socket.on('offer',async(data)=>{
    const {sender,to,offer,senderName} = data
    const socketId = socketUsers.get(to)
    console.log('recieverSocketId on offer Listening = ',socketId)
    console.log('sender on offer Listening = ',senderName)
    socket.to(socketId).emit('offer',{sender,offer,senderName})
   })

   socket.on("answer",async(data)=>{
    const {to,sender,answer} = data
    const socketId = socketUsers.get(to)
    console.log('socketId of answer sender on answer listening = ',socketId)
    socket.to(socketId).emit('answer',{sender,answer})
   })

   socket.on('iceCandidate',async(data)=>{
    const {iceCandidate,sender,roomId} = data
    const otherMembers = meetings[roomId].participants.filter(user=>user.id!==sender)
    console.log('otherMember listening on icecandidate = ',otherMembers)
    socket.emit('new-iceCandidate',{sender,iceCandidate})
   })


    socket.on('disconnect',()=>{

    });  
  },);
};

export default initializeSocket;