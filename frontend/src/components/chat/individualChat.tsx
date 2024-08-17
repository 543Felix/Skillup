import React,{useEffect,Dispatch,SetStateAction,useState,useRef,useContext,useCallback} from "react"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import { faCircleXmark } from "@fortawesome/free-regular-svg-icons"
import socket from "../../../utils/socket"
import { convertToDate,convertToLocalTime } from "../../helperFunctions" 
import { devcontext,companyContext } from "../../Routes/constants"
import { toast } from "react-toastify"
import AxiosInstance from "../../../utils/axios"
import uploadImageToCloudinary from "../../../utils/cloudinary"
import {faSpinner } from "@fortawesome/free-solid-svg-icons";
import {Delete,DoneAll} from '@mui/icons-material'

import {chats} from '../../Routes/constants'

interface Props{
    senderId:string,
    receiverId:string,
    profileImg:string|undefined,
    name:string,
    role:'developers'|'companies',
    senderModel:'developers'|'companies',
    receiverModel:'developers'|'companies',
    closeChat:Dispatch<SetStateAction<boolean>>|(()=>void)
}


interface fileUploadOutput {
  url:string,
  fileType:string
}


const IndividualChats:React.FC<Props> = ({senderId,receiverId,senderModel,receiverModel,profileImg,name,role,closeChat})=>{
  
  const [Content,setContent] = useState('')
  const context = useContext(role==='companies'?companyContext:devcontext)
  const {messages,setMessages,setAllchats,setUnReadMesCount} = context
  const [showOptions,setOptions] = useState(false)
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [file,setFile] = useState<File|null|undefined>(null)
  const [selectedUrl,setSelectedUrl] = useState<string>('')
  const [loader,setLoader] = useState<boolean>(false)
  const [deletIcon,showDeleteIcon]  = useState<boolean>(false)
  const [messageId,setMessageId] = useState<string>('')
  

 const handleFileOption = (e:React.MouseEvent<HTMLButtonElement>)=>{
  e.preventDefault()
if(fileInputRef.current){
fileInputRef.current?.click()
}
 }
   const chatContainerRef = useRef<HTMLUListElement>(null); 
useEffect(() => {
    if (chatContainerRef.current) {
      chatContainerRef.current.scrollTop = chatContainerRef.current.scrollHeight;
    }
  }, [messages]);
 
   useEffect(()=>{
  socket.on('msgViewed',(data)=>{
    console.log('msgViewed socket evnet get on reciever side')
    const {receiverId} = data
   setMessages((prevMessages) => {
  return prevMessages.map((message, index) => {
    if (index === prevMessages.length - 1) {
      const updatedChats = message.chats.map((item) => {
        if (item.senderId === receiverId && item.isViewed === false) {
          return { ...item, isViewed: true };
        }
        return item;
      });

      return {
        ...message,
        chats: updatedChats,
      };
    }
    return message;
  });
});

  })

  socket.on("newMessage", async (response) => {
      response.isViewed = true 
    setMessages((messages)=>{
if (
  (messages[0].chats[0].senderId === response.senderId || messages[0].chats[0].senderId === response.receiverId) &&
  (messages[0].chats[0].receiverId === response.senderId || messages[0].chats[0].receiverId === response.receiverId)
) {
         const index = messages.findIndex((item)=>convertToDate(item.date)===convertToDate(response.createdAt))
      if(index!==-1){
    return messages.map((message)=>{
        if(convertToDate(message.date)===convertToDate(response.createdAt)){
          return{
            ...message,
            chats:[...message.chats,response]
          } 
        }
        return message
      })
      }else{
        const newMessage ={
          date:response.createdAt,
          chats:[response]
        }
        return[
          ...messages,
          newMessage
        ]
      }
      }else{
        return messages
      }
      
    })
   setAllchats((chats)=>{
    const updatedChats =  chats.map((chat)=>{
      if(chat.id===response.senderId){
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
   socket.emit('msgViewed',{senderId,receiverId})
   setUnReadMesCount((prevState)=>{
    return prevState.filter((item)=>item._id!==receiverId)
   })
    });

  socket.on('msgDeleted',async(data:{mesId:string,date:Date|string})=>{
      const {mesId,date} = data
       setMessages((prevMessages) => {
        const index = prevMessages.findIndex((item) => convertToDate(item.date) === convertToDate(date));
        
        if (index !== -1) {
          const newMessages = [...prevMessages];
          const chatArray = newMessages[index].chats;
          const messageIndex = chatArray.findIndex((chat) => chat._id === mesId);
          
          if (messageIndex !== -1) {
            chatArray.splice(messageIndex, 1);
            if(chatArray.length>0){
              newMessages[index] = {
              ...newMessages[index],
              chats: chatArray,
            };
            }else{
              newMessages.splice(index,1)
            }
            
          }
          
          return newMessages;
        }

        return prevMessages;
      });
    })
  // socket.on('unReadMes',async(sender)=>{
  //   setUnReadMesCount((prevState)=>{
  //     return prevState.filter((item)=>item.sender!==sender)
  //   })
  // })

  
 AxiosInstance.get('/chat/individualMessages',{
  params:{
    senderId:senderId,
  receiverId:receiverId
  }
 }).then((res)=>{
  setMessages(res.data.data)
  setUnReadMesCount((prevState)=>{
    return prevState.filter((item)=>item._id!==receiverId)
  })
  socket.emit('msgViewed',{senderId,receiverId})
 })
 return ()=>{
  socket.off('msgViewed')
  socket.off("newMessage")
  socket.off("msgDeleted")
 }
  },[senderId,receiverId,setMessages,setAllchats,setUnReadMesCount])

  const sendMessOnEnter = (event: React.KeyboardEvent<HTMLInputElement>) => {
    if (event.key === 'Enter') {
      console.log('Enter key pressed');
      if(Content.trim().length>0){
        event.preventDefault()
        sendMessage(event)
      } else{
    toast.error('message cannot be empty')
      }
    }
  };

const sendMessage = (e:React.MouseEvent<HTMLButtonElement>|React.KeyboardEvent<HTMLInputElement>,type='message',content=Content)=>{
   e.preventDefault()
   if(content.trim().length>0){
     socket.emit("stopTyping",senderId,receiverId)
socket.emit('message', { senderId, receiverId, senderModel, receiverModel, content,type },(response:chats) => {
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
 socket.emit("typing",senderId,receiverId)
 setContent(e.target.value)
}

const cancelTyping =useCallback(()=>{
 socket.emit("stopTyping",senderId,receiverId)
},[senderId,receiverId])


useEffect(()=>{
 const handler = setTimeout(() => {
   cancelTyping()
 },1500)
 
   return ()=>{
    clearTimeout(handler)
   }
},[Content,cancelTyping])


const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>)=>{
        const file:File|undefined = e.target.files?.[0];
        console.log('file = ',file)
          setFile(file)
            if(file){
        console.log(file.type.startsWith('video/'))
          const imageUrl = URL.createObjectURL(file)
          setSelectedUrl(imageUrl)
          console.log('url = ',imageUrl)
        }
      }
      const closeMediaAccess = ()=>{
        setSelectedUrl('')
        // setFileType('')
      }
const uploadImage = async(e:React.MouseEvent<HTMLButtonElement>)=>{
  e.preventDefault()
  if(file){
    setLoader(true)
    uploadImageToCloudinary(file)
    .then((data:fileUploadOutput|undefined)=>{ 
      if(data){
          const {url,fileType} = data
    console.log('imageUrl = ',url)  
    sendMessage(e,fileType,url)
      }
    
    }).finally(()=>{
      setLoader(false)
    closeMediaAccess()
    })
    

  }
}

 
   
  const deleteMessage = (id:string,date:string)=>{
    console.log('deleteMessage invoekd')
       
         
      socket.emit('deleteMsg',{mesId:id,receiverId,date},(res:string)=>{
            if(res==='sucess'){
               setMessages((prevMessages) => {
        const index = prevMessages.findIndex((item) => convertToDate(item.date) === convertToDate(date));
        
        if (index !== -1) {
          const newMessages = [...prevMessages];
          const chatArray = newMessages[index].chats;
          const messageIndex = chatArray.findIndex((chat) => chat._id === id);
          
          if (messageIndex !== -1) {
            chatArray.splice(messageIndex, 1);
            if(chatArray.length>0){
              newMessages[index] = {
              ...newMessages[index],
              chats: chatArray,
            };
            }else{
              newMessages.splice(index,1)
            }
            
          }
          
          return newMessages;
        }

        return prevMessages;
      });
            }
      })
        // })
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
                
            <div className="flex space-x-2" onMouseEnter={()=>{
              showDeleteIcon(true)
              setMessageId(item._id)
           }} onMouseLeave={()=>showDeleteIcon(false)}  >

             {senderId===item.senderId&&deletIcon===true&&messageId===item._id&&(
              <div className="flex items-center" onClick={()=>deleteMessage(item._id,item.createdAt)} >
                <div className="bg-gray-600 p-1 rounded-full flex justify-center">
                      <Delete  className="text-white" style={{fontSize:'20px'}}  />
                    </div> 
              </div>
              )}
              
              <div className={`bg-violet rounded  ${item.type==='message'&&('px-2 py-2 my-2')} text-white relative max-w-[300px]`}>
           
                {item.type==='image'?<img className="h-[200px] w-[350px]" object-cover src={item.content} />:item.type==='video'?<video className="h-[250px] w-[300px]" controls src={item.content} />:item.type==='audio'?<audio className="h-[250px] w-[300px]" controls src={item.content} />:item.type==='RAW'?<embed className="h-[250px] w-[300px]"  src={item.content} />:<span className="block ">{item.content}</span>}
                <div className={`flex items-center space-x-1 text-[10px] ${senderId===item.senderId?'text-right':'text-left'}`} >
                   <span>{convertToLocalTime(item.createdAt)}</span>
                   {senderId===item.senderId&&(
                   <DoneAll  className={`${item.isViewed===true?'text-blue':'text-white'}`} style={{fontSize:'14px'}}  />
                   )}
                </div>
              </div>
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
        <input
                type="file"
                hidden
                ref={fileInputRef}
                style={{ display: 'none' }}
               accept="image/*, video/*, audio/*, application/pdf"
                onChange={handleFileChange}
                
            />
            {selectedUrl&&(
               <div className="absolute bottom-14 bg-gray-700 h-[250px] w-[350px] z-20">
                <div className=" absolute right-2 top-2 ">
                 <FontAwesomeIcon className="text-white bg-black p-2 rounded-full h-6 " icon={faCircleXmark} onClick={closeMediaAccess} />
                </div>
            {file&&file.type.startsWith('image/')?<img className="h-[200px] w-full" src={selectedUrl}  alt="" />:file&&file.type.startsWith('video/')?<video className="h-[200px] w-full" src={selectedUrl} controls />:file&&file.type.startsWith('application/')? <embed className="h-[200px] w-full" src={selectedUrl}  />:file&&file.type.startsWith('application/')?<audio src={selectedUrl} controls/>:<><h1 className="text-white ">Unsupported file</h1></>}
            <div className="flex justify-end mr-3 py-2">
              <button className="bg-violet text-white px-5 py-1" onClick={uploadImage}>
                confirm
              </button>
            </div>
            {loader===true&&(
 <div className='absolute justify-center items-center flex  z-30  bg-black bg-opacity-45'>
        <FontAwesomeIcon className='text-white animate-spin h-12' icon={faSpinner} />
      </div>
            )}
            
            </div>
            )}
           
      <div className="absolute overflow-hidden bottom-0 w-full py-3 bg-black px-3 flex items-center justify-between border-t border-gray-300">
        <button className="outline-none focus:outline-none" onClick={handleFileOption}>
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
        <button className=" outline-none focus:outline-none ml-1" onClick={()=>setOptions(!showOptions)}>
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
          value={Content}
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