import React, { Suspense, lazy, useEffect, useState,useCallback } from "react";
import { Route, Routes,Outlet } from "react-router-dom";
import DevHeader from "../components/headerandFooter/devheader";
import Loader from "../pages/loader";
import Chat from "../components/chat/allChats";
import socket,{connectSocket} from "../../utils/socket";
import AxiosInstance from "../../utils/axios";
import PageNotFound from "../pages/404";
import { useSelector } from "react-redux";
import { RootState } from "../store/store";
import { useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import { devLogOut } from "../store/slice/developerSlice";
import MyPDFViewer from "../components/profile/pdfViwer";
import JobData from "../components/job/jobData";
import MeetingHome from "../components/metting/meetingHome";
import VideoCall from "../components/metting/videoCall";
import { Notification as constanNotification,UnRead } from "./constants";
import MeetingHistory from "../pages/meetingHistory";



const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

const DeveloperProfile = lazy(() => delay(500).then(() => import("../pages/developer/profile")));
const Displayjob = lazy(() => delay(500).then(() => import("../pages/developer/displayJobs")));
const DeveloperProposals = lazy(() => import("../pages/developer/proposals"));

import { Messages,Allchats,devcontext } from "./constants";


import Paymentsucess from "../components/payment/paymentSucess";
import Paymenterror from "../components/payment/paymentError";
import MakePayment from "../components/payment/stripe";








const DeveloperRoute: React.FC = () => {
  const [notifications, setNotifications] = useState<constanNotification[]>([]);
  const [data, setData] = useState([]);
  const [messages, setMessages] = useState<Messages[]>([]);
  const [allChats,setAllchats] = useState<Allchats[]>([])
  const userId = useSelector((state: RootState) => state.developerRegisterData._id);
  const [unreadMesCount,setUnReadMesCount] = useState<UnRead[]>([])

  const navigate = useNavigate()
  const dispatch = useDispatch()


  

  const fetchUnReadMessages = useCallback(()=>{
    if(userId.length>0){
    AxiosInstance.get(`/chat/unReadChat/${userId}`)
    .then((res)=>{
      if(res.data){
        console.log('unReadMes on company = ',res.data)
        setUnReadMesCount(res.data)
      }
    })
  }
  },[userId])

    useEffect(() => {
    connectSocket(userId)
    fetchUnReadMessages()
  
    socket.on("notification", async (data) => {
      setData(data);
    });

   
    socket.on("unReadMes", async (sender) => {
      console.log('message recieved from = ',sender)
      setUnReadMesCount((prevState) => {
        const i = prevState.findIndex((item) => item.sender === sender);
    
        if (i !== -1) {
          // Update the count for the existing sender
          return prevState.map((item, index) => {
            if (index === i) {
              return {
                ...item,
                count: item.count + 1,
              };
            }
            return item;
          });
        } else {
          // Add a new sender to the list
          return [
            ...prevState,
            { sender: sender, count: 1 },
          ];
        }
      });
    });


    return () => {
      socket.off("notification")
      socket.off("unReadMes")

      
      socket.disconnect();
    };
  }, [userId,fetchUnReadMessages]);
  
 useEffect(()=>{
AxiosInstance.interceptors.response.use(
  response => response,
  error => {

    if (error.response && (error.response.status === 401 || error.response.status === 403)) {
      const requestUrl = error.response.config.url;
      if (requestUrl && requestUrl.startsWith('/dev/')) {
     dispatch(devLogOut())
     navigate('/dev/login')
      }
    }

    return Promise.reject(error);
  }
);
  })
 
  



  useEffect(() => {
    AxiosInstance.get(`/notifications/${userId}/companies`).then((res) => {
      setNotifications(res.data);
    });
  }, [data, userId]);

  return (
    <div className="flex flex-col min-h-screen">
      <devcontext.Provider value={{ messages, setMessages, allChats , setAllchats,unreadMesCount,setUnReadMesCount }}>
                       
      <DevHeader notifications={notifications} setNotifications={setNotifications} />
      <div className="flex flex-grow pt-28 pb-10 px-4 space-x-24">
        <div className="flex-grow">
          <Routes>
            <Route path="/" element={<Displayjob />} />

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
                <Outlet/>
              }
            >
              <Route index element={<Suspense fallback={<Loader />}>
                  <Displayjob />
                </Suspense>} /> 
                <Route path=':id' element={<JobData/>}/>

            </Route>
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
            <Route path='/pdfView' element={<MyPDFViewer/>}/>
            <Route path="/pricingPage" element={<MakePayment/>}/>
              <Route path="/payment-success" element={<Paymentsucess/>}/>
              <Route path="/payment-error" element={<Paymenterror/>}/>
         <Route path="/meeting" element={<MeetingHome role="dev" />}/>
         <Route path="/meetingHistory" element={<MeetingHistory/>}/>
         <Route path='/newMeeting' element={<VideoCall role='dev'/>} />
            <Route path="*" element={<PageNotFound />} />
          </Routes>
        </div>
      </div>

     </devcontext.Provider>
    </div>
  );
};

export default DeveloperRoute;
