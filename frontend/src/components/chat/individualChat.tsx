import React,{useEffect,Dispatch,SetStateAction,useState,useRef,useContext} from "react"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import { faCircleXmark } from "@fortawesome/free-regular-svg-icons"
import socket from "../../../utils/socket"
import { convertToDate,convertToLocalTime } from "../../helperFunctions" 
import { devcontext,companyContext } from "../../Routes/constants"
import { toast } from "react-toastify"
import AxiosInstance from "../../../utils/axios"

interface Props{
    senderId:string,
    receiverId:string,
    profileImg:string,
    name:string,
    role:'developers'|'companies',
    senderModel:'developers'|'companies',
    receiverModel:'developers'|'companies',
    closeChat:Dispatch<SetStateAction<boolean>>|(()=>void)
}



const IndividualChats:React.FC<Props> = ({senderId,receiverId,senderModel,receiverModel,profileImg,name,role,closeChat})=>{
  
   const [content,setContent] = useState('')
   const context = useContext(role==='companies'?companyContext:devcontext)
  const {messages,setMessages,setAllchats} = context
 
 
   const chatContainerRef = useRef<HTMLUListElement>(null); 
useEffect(() => {
    if (chatContainerRef.current) {
      chatContainerRef.current.scrollTop = chatContainerRef.current.scrollHeight;
    }
  }, [messages]);

   useEffect(()=>{
 AxiosInstance.get('/chat/individualMessages',{
  params:{
    senderId:senderId,
  receiverId:receiverId
  }
 }).then((res)=>{
  setMessages(res.data.data)
 })
  },[senderId,receiverId])
  const sendMessOnEnter = (event: React.KeyboardEvent<HTMLInputElement>) => {
    if (event.key === 'Enter') {
      console.log('Enter key pressed');
      if(content.trim().length>0){
        event.preventDefault()
        sendMessage(event)
      } else{
    toast.error('message cannot be empty')
      }
    }
  };

const sendMessage = (e:React.MouseEvent<HTMLButtonElement>|React.KeyboardEvent<HTMLInputElement>)=>{
   e.preventDefault()
   if(content.trim().length>0){
     socket.emit("stopTyping",senderId,receiverId)
socket.emit('message', { senderId, receiverId, senderModel, receiverModel, content },(response) => {
    setMessages((prevMessages) => {
    const index = prevMessages.findIndex((item)=>convertToDate(item.date)===convertToDate(response.createdAt))
    if(index!==-1){
     return prevMessages.map((message)=>{
        if(convertToDate(message.date)===convertToDate(response.createdAt)){
          return{
            ...message,
            chats:[...message.chats,response]
          }
        }
        return message
      })
    }else{
      const newMessage = {
        date:response.createdAt,
        chats:[response]
      }
      return [
        ...prevMessages,
        newMessage
      ]
    }
});
 setAllchats((chats)=>{
    const updatedChats =  chats.map((chat)=>{
      if(chat.id===response.receiverId){
        return{
          ...chat,
          lastMessage:response.content,
          createdAt:response.createdAt
        }
      }      
        return chat
    })
   
    updatedChats.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
    return updatedChats

   })
     setContent('')
    });
   }else{
    toast.error('message cannot be empty')
   }
   

  
}


const typing =(e:React.ChangeEvent<HTMLInputElement>)=>{
  console.log('typingStarted ')
 socket.emit("typing",senderId,receiverId)
 setContent(e.target.value)
}

useEffect(()=>{
 const handler = setTimeout(() => {
   cancelTyping()
 },1500)
 
   return ()=>{
    clearTimeout(handler)
   }
},[content])

const cancelTyping =()=>{
  console.log('typingStopped')
 socket.emit("stopTyping",senderId,receiverId)
}

    return(
                <div className="w-full h-screen bg-black relative overflow-hidden">
      <div className="flex bg-black right-0 justify-between items-center border-b">
        <div className="flex items-center border-gray-300 pl-3 py-3">
          <img
            className="h-10 w-10 rounded-full object-cover"
            src={profileImg}
            alt="username"
          />
          <span className="block ml-2 font-bold text-base text-white">{name}</span>
          <span className="connected text-green-500 ml-2">
            <svg width="6" height="6">
              <circle cx="3" cy="3" r="3" fill="currentColor"></circle>
            </svg>
          </span>
        </div>
        <FontAwesomeIcon
          icon={faCircleXmark}
          className="text-white h-8 mr-4"
          onClick={() => closeChat(false)}  
        />
      </div>

      <div id="chat" className="relative w-full overflow-hidden">
        <ul className="max-h-[600px] overflow-y-auto px-10 pt-5 pb-24 relative" ref={chatContainerRef} >
          {/* Chat messages */}
          <li className="clearfix2">
            {messages.length>0?messages.map((item,index)=>(
               <div key={index} >
                 <div className="w-full flex justify-center">
              <div className="bg-gray-600 rounded-3xl px-5 py-1 my-2 text-white relative max-w-[300px]">
                <span className="block">{convertToDate(item.date)}</span>
              </div>
            </div>
            {item.chats.length>0&&item.chats.map((item)=>(
            <div key={item._id} className={`w-full flex ${senderId===item.senderId?'justify-end':'justify-start'}`}>
              <div className="bg-violet rounded px-5 py-2 my-2 text-white relative max-w-[300px]">
                <span className="block ">{item.content}</span>
                <span className={`block text-[10px] ${senderId===item.senderId?'text-right':'text-left'}`}>{convertToLocalTime(item.createdAt)}</span>
              </div>
            </div>
            ))}
              </div>
             
            ))
            :
           <h1 className="text-white text-4xl flex items-center justify-center">Start Messaging</h1>}
            
           
            
            
          </li>
        </ul>
        
      </div>

      <div className="absolute overflow-hidden bottom-0 w-full py-3 bg-black px-3 flex items-center justify-between border-t border-gray-300">
        <button className="outline-none focus:outline-none">
          <svg
            className="text-white h-6 w-6"
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
            />
          </svg>
        </button>
        <button className="outline-none focus:outline-none ml-1">
          <svg
            className="text-white h-6 w-6"
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              d="M15.172 7l-6.586 6.586a2 2 0 102.828 2.828l6.414-6.586a4 4 0 00-5.656-5.656l-6.415 6.585a6 6 0 108.486 8.486L20.5 13"
            />
          </svg>
        </button>

        <input
          placeholder="Type a message"
          className="py-2 mx-3 pl-5 block w-full rounded-full bg-violet outline-none placeholder:text-white focus:bg-violet focus:text-white"
          type="text"
          value={content}
          name="message"
          required
          onChange={typing}
          onKeyDown={sendMessOnEnter}
        />

        <button className="outline-none focus:outline-none" type="submit" onClick={sendMessage} >
          <svg
            className="text-white h-7 w-7 origin-center transform rotate-90"
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 20 20"
            fill="currentColor"
          >
            <path d="M10.894 2.553a1 1 0 00-1.788 0l-7 14a1 1 0 001.169 1.409l5-1.429A1 1 0 009 15.571V11a1 1 0 112 0v4.571a1 1 0 00.725.962l5 1.428a1 1 0 001.17-1.408l-7-14z" />
          </svg>
        </button>
      </div>
    </div>
    )
}

export default IndividualChats