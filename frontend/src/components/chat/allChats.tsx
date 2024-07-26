import React,{useContext, useEffect, useState} from "react"
import IndividualChats from "./individualChat"
import { useSelector } from "react-redux"
import { RootState } from "../../store/store"
import AxiosInstance from "../../../utils/axios"
import { devcontext,companyContext } from "../../Routes/constants"
import { convertToLocalTime } from "../../helperFunctions"
import socket from "../../../utils/socket"

interface Props {
    role:'developers'|'companies'
}


const Chat:React.FC<Props> =React.memo(({role})=>{
   const context = useContext(role==='companies'?companyContext:devcontext)
   const {allChats,setAllchats} = context
   const [typerId,setTyperID] =useState<string[]>([])
    const senderId = useSelector((state:RootState)=>{
        return role==='companies'?state.companyRegisterData._id:state.developerRegisterData._id
    })
    const [receiverId,setReceiverId] = useState('')
    const [profileImg,setProfileImg] = useState<string>('')
    const [name,setName] = useState<string>('')
    const [usersOnline,setUsersOnline] = useState<string[]>([])
    const receiverModel = role==='companies'?'developers':'companies'

   useEffect(()=>{
      socket.on("stopTyping",async(senderId)=>{
      setTyperID((ids)=>ids.filter((id)=>id!==senderId))
     })
     socket.on('onlineUsers',(userId)=>{
      console.log('listened for new user ccomes online = ',userId)
      setUsersOnline((prevState)=>{
        return[
          ...prevState,
          userId
        ]
      })
     })
     socket.on('goesOffline',(userId)=>{
      console.log('listens to exit messages = ',userId)
         setUsersOnline((users)=>{
        return  [...users.filter((id:string)=>id!==userId)]}
        )
     })
      socket.on("typing",async(senderId)=>{
     setTyperID((prevState) => {
        if (!prevState.includes(senderId)) {
          return [...prevState, senderId];
        }
        return prevState;
      });
    })

   return()=>{
      socket.off("stopTyping")
      socket.off('typing');
      socket.off("onlineUsers")
      socket.off('goesOffline')
     }

   },[])

    useEffect(()=>{
   
     
     function getAllChats(){
      AxiosInstance.get(`/chat/getAllChats/${senderId}`).then((res) => {
        const {chats,onlineUsers} = res.data
      setAllchats(chats);
      if(onlineUsers.length>0){
         setUsersOnline(()=>{
        return[
          ...onlineUsers
        ]
      })
      }
     
    });
    }
    getAllChats()

     
    },[senderId,setAllchats])

    
    const startChat = (item: {id:string;image:string,name:string})=>{
       setReceiverId(item.id)
       setProfileImg(item.image)
       setName(item.name)
    }
    const closeChat = ()=>{
        setReceiverId('')
        setProfileImg('')
        setName('')
    }
 


     return(
    <div className="absolute grid grid-cols-3 w-screen max-h-screen overflow-y-hidden   top-0 bottom-0 left-0 right-0 z-50  ">
            <div className=" col-span-1 bg-black border-r border-gray-300">
                <div className="my-3 mx-3 ">
                    <div className="relative text-white focus-within:text-gray-400">
                        <span className="absolute inset-y-0 left-0 flex items-center pl-2">
                            <svg fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" viewBox="0 0 24 24" className="w-6 h-6 text-gray-500"><path d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"></path></svg>
                        </span>
                        <input  placeholder="Start a new chat"
                        className="py-2 pl-10 block w-full rounded bg-gray-100 outline-none focus:text-gray-700" type="search" name="search" required />
                    </div>
                </div>
                 <div className="">
                <ul >
                    <h2 className="ml-2 mb-2 text-white text-lg my-2">Chats</h2>
                    <li className="overflow-y-auto h-[600px] flex flex-col">
                        {allChats.length > 0 && allChats.map((item, index) => (
  <a
    key={index}
    className=" text-white  border rounded  m-2 border-gray-300 px-3 py-2 cursor-pointer flex items-center text-sm focus:outline-none focus:border-gray-300 transition duration-150 ease-in-out"
  onClick={()=>startChat(item)}
  >
    <img
      className="h-10 w-10 rounded-full object-cover"
      src={item.image}
      alt="username"
    />
    <div className="w-full pb-2">
      <div className="flex justify-between">
        <div className="flex items-center">
        <span className="block ml-2 font-semibold text-base">{item.name}</span>
        {usersOnline.length>0&&usersOnline.includes(item.id)&&(
        <span className="block ml-2 font-light text-xs text-green-400">Online</span>
        )} 
        </div>
        <span className="block ml-2 text-sm">{convertToLocalTime(item.createdAt)}</span>
      </div>
<span className={`block ml-2 text-sm ${typerId.length > 0 && typerId.includes(item.id) ? 'text-green-700' : 'text-gray-400'}`}>
  {typerId.length > 0 && typerId.includes(item.id) ? 'typing...' :item.type==='message'?item.lastMessage:item.type}
</span>
    </div>
  </a>
))}

                        
                       
                        
                    </li>
                </ul>
                 </div>
                
            </div>
            <div className="col-span-2 bg-black">
                {senderId.trim().length>0&&receiverId.trim().length>0?
                <IndividualChats senderId={senderId}  receiverId={receiverId} receiverModel={receiverModel} senderModel={role} profileImg={profileImg} name={name} role={role} closeChat={closeChat} />
                :
                <div className="h-full w-full flex  flex-col justify-center items-center ">
                 <img src="../chatImage.png" className="h-[400px]" alt="" />
                 <p className="text-white text-2xl font-serif ">Select a chat to see the messages </p>
                </div>
                } 
                
            </div>
        </div>
     )
})
export default Chat