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
import socket,{connectSocket} from "../../utils/socket";
import { RootState } from "../store/store";
import { Messages,Allchats,companyContext,Notification } from "./constants";
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
    connectSocket(userId)
   
   
    
    socket.on("notification", async (data) => {
      setData(data);
    });

   

    return () => {
      // socket.off("register")
      socket.off("notification")
      
      socket.disconnect();
    };
  }, [userId]);

 


  useEffect(() => {
    AxiosInstance.get(`/notifications/${userId}/developers`).then((res) => {
      setNotifications(res.data);
    });
  }, [data, userId]);
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
