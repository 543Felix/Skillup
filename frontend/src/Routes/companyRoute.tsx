import React, { Suspense, lazy, useState, useEffect } from "react";
import CompanyHeader from "../components/headerandFooter/companyHeader";
import { Routes, Route } from "react-router-dom";
const CompanyProfile = lazy(() => import("../pages/company/companyProfile"));
import CreateJob from "../pages/company/createJob";
const CompanyJob = lazy(() => import("../pages/company/CompanyJob"));
import PageNotFound from "../pages/404";
const Quiz = lazy(() => import("../components/job/QuizPage"));
import Loader from "../pages/loader";
import Chat from "../components/chat/allChats";
import AxiosInstance from "../../utils/axios";
import { useSelector } from "react-redux";
import socket from "../../utils/socket";
import { RootState } from "../store/store";
import { Messages,Allchats,companyContext,Notification } from "./constants";
import { convertToDate } from "../helperFunctions";
// import MeettingHome from "../components/metting/homeForMetting";
// import VideoCall from "../components/metting/sampleVideoCallUi";
import GroupCall from "../components/metting/GroupCall";



const CompanyRoute: React.FC = () => {

  const [messages, setMessages] = useState<Messages[]>([]);
  const [allChats,setAllchats] = useState<Allchats[]>([])
  const [notifications,setNotifications] = useState<Notification[]>([])
  const [data,setData] = useState([])
  const userId = useSelector((state: RootState) => {
    return state.companyRegisterData._id;
  });
  useEffect(() => {
    socket.connect();
    socket.emit("register", userId);
    return () => {
      socket.off("register")
      socket.emit('deRegister',userId)
      socket.disconnect();
    };
  }, [userId]);

  useEffect(()=>{
   socket.on("newMessage", async (response) => {
    setMessages((messages)=>{
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
    });

    return()=>{
      socket.off("newMessage")
    }

  },[])

  useEffect(()=>{
  socket.on("notification", async (data) => {
      setData(data);
    });
return()=>{
  socket.off("notification")
}

},[])
 useEffect(()=>{
   function getAllChats(){
      AxiosInstance.get(`/chat/getAllChats/${userId}`).then((res) => {
      setAllchats(res.data);
    });
    }
    getAllChats()
 },[userId])

  useEffect(() => {
    AxiosInstance.get(`/notifications/${userId}/developers`).then((res) => {
      setNotifications(res.data);
    });
  }, [data, userId]);
  console.log('notifications = ',notifications)
  return (
    <>
    <companyContext.Provider value={{ messages, setMessages,allChats,setAllchats }}>
      <CompanyHeader notifications={notifications} setNotifications={setNotifications} />
      <div className="flex flex-grow py-28 px-28 space-x-24">
        <Routes>
          <Route
            path="/"
            element={
              <Suspense fallback={<Loader />}>
                <CompanyJob />
              </Suspense>
            }
          />
          <Route
            path="/profile"
            element={
              <Suspense fallback={<Loader />}>
                <CompanyProfile role={"company"} />
              </Suspense>
            }
          />
          <Route
            path="/job"
            element={
              <Suspense fallback={<Loader />}>
                <CompanyJob />
              </Suspense>
            }
          />
          <Route path="/createJob" element={<CreateJob action={"createJob"} />} />
          <Route
            path="/job/startQuiz"
            element={
              <Suspense fallback={<Loader />}>
                <Quiz />
              </Suspense>
            }
          />
          <Route
            path="/chats"
            element={
              
                <Chat role="companies" />
            }
          />
         <Route path="/meeting" element={<GroupCall role="companies" />}/>
         {/* <Route path="/newMeeting/:roomId" element={<JitsiMain role="companies"/>} /> */}
          <Route path="*" element={<PageNotFound />} />
        </Routes>
      </div>
      </companyContext.Provider>
    </>
  );
};

export default CompanyRoute;
