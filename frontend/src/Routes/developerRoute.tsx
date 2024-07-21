import React, { Suspense, lazy, useEffect, useState } from "react";
import { Route, Routes } from "react-router-dom";
import DevHeader from "../components/headerandFooter/devheader";
// import Footer from "../juniorDevloper/footter";
import DeveloperHome from "../pages/developer/developerHome";
import Loader from "../pages/loader";
import Chat from "../components/chat/allChats";
import socket from "../../utils/socket";
import AxiosInstance from "../../utils/axios";
import PageNotFound from "../pages/404";
import { useSelector } from "react-redux";
import { RootState } from "../store/store";
import { convertToDate } from "../helperFunctions";
// import MeettingHome from "../components/metting/homeForMetting";
// import VideoCall from "../components/metting/sampleVideoCallUi";
import GroupCall from "../components/metting/GroupCall";


const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

const DeveloperProfile = lazy(() => delay(500).then(() => import("../pages/developer/profile")));
const Displayjob = lazy(() => delay(500).then(() => import("../pages/developer/displayJobs")));
const DeveloperProposals = lazy(() => import("../pages/developer/proposals"));

import { Messages,Allchats,devcontext } from "./constants";


import Paymentsucess from "../components/payment/paymentSucess";
import Paymenterror from "../components/payment/paymentError";
import MakePayment from "../components/payment/stripe";







const DeveloperRoute: React.FC = () => {
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [data, setData] = useState([]);
  const [messages, setMessages] = useState<Messages[]>([]);
  const [allChats,setAllchats] = useState<Allchats[]>([])
  const userId = useSelector((state: RootState) => state.developerRegisterData._id);

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
     const getAllChats = () => {
      AxiosInstance.get(`/chat/getAllChats/${userId}`).then((res) => {
        setAllchats(res.data);
      });
    };
    getAllChats()
  },[userId])

useEffect(()=>{
  socket.on("notification", async (data) => {
      setData(data);
    });
return()=>{
  socket.off("notification")
}

},[])

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
        return{
          ...messages,
          newMessage
        }
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


  useEffect(() => {
    AxiosInstance.get(`/notifications/${userId}/companies`).then((res) => {
      setNotifications(res.data);
    });
  }, [data, userId]);

  return (
    <div className="flex flex-col min-h-screen">
                      <devcontext.Provider value={{ messages, setMessages, allChats , setAllchats }}>
      <DevHeader notifications={notifications} setNotifications={setNotifications} />
      <div className="flex flex-grow py-28 px-28 space-x-24">
        <div className="flex-grow">
          <Routes>
            <Route path="/" element={<DeveloperHome />} />

            <Route
              path="/profile"
              element={
                <Suspense fallback={<Loader />}>
                  <DeveloperProfile role="dev" />
                </Suspense>
              }
            />
            <Route
              path="/job"
              element={
                <Suspense fallback={<Loader />}>
                  <Displayjob />
                </Suspense>
              }
            />
            <Route
              path="/savedJobs"
              element={
                <Suspense fallback={<Loader />}>
                  <Displayjob jobType="savedJobs" />
                </Suspense>
              }
            />
            <Route
              path="/proposals"
              element={
                <Suspense fallback={<Loader />}>
                  <DeveloperProposals />
                </Suspense>
              }
            />

            <Route
              path="/chats"
              element={
                  <Chat role="developers" />
              }
            />
            <Route path="/pricingPage" element={<MakePayment/>}/>
              <Route path="/payment-success" element={<Paymentsucess/>}/>
              <Route path="/payment-error" element={<Paymenterror/>}/>
         <Route path="/meeting" element={<GroupCall role="dev" />}/>
         {/* <Route path="/newMeeting/:roomId" element={<JitsiMain role="dev" />} /> */}
            <Route path="*" element={<PageNotFound />} />
          </Routes>
        </div>
      </div>

     </devcontext.Provider>
    </div>
  );
};

export default DeveloperRoute;
