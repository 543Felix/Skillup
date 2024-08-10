import React, { Suspense, lazy, useState, useEffect,useCallback } from "react";
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
import { Messages,Allchats,companyContext,Notification,UnRead } from "./constants";
import { useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import { companyLogOut } from "../store/slice/companySlice";
import MeetingHome from "../components/metting/meetingHome";
import VideoCall from "../components/metting/videoCall";
import CompanyDashboard from "../pages/company/dashboard";
import DeveloperListsCard from "../pages/company/developersList";
import IndividualDevData from "../pages/company/individualDevData";
import MyPDFViewer from "../components/profile/pdfViwer";
import MeetingHistory from "../pages/meetingHistory";



const CompanyRoute: React.FC = () => {
 
  const [messages, setMessages] = useState<Messages[]>([]);
  const [allChats,setAllchats] = useState<Allchats[]>([])
  const [notifications,setNotifications] = useState<Notification[]>([])
  const [data,setData] = useState([])
  const [unreadMesCount,setUnReadMesCount] = useState<UnRead[]>([])
  const userId = useSelector((state: RootState) => {
    return state.companyRegisterData._id;
  });

  const dispatch = useDispatch()
  const navigate = useNavigate()

  // const fetchNotification = useCallback(()=>{
  //   AxiosInstance.get(`/notifications/${userId}/developers`).then((res) => {
  //     setNotifications(res.data);
  //   });
  //  },[userId])
  

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
      socket.off('newMessage')
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
      if (requestUrl && requestUrl.startsWith('/company/')) {
     dispatch(companyLogOut())
     navigate('/company/login')
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
    <>
    <companyContext.Provider value={{ messages, setMessages,allChats,setAllchats,unreadMesCount,setUnReadMesCount }}>
      <CompanyHeader notifications={notifications} setNotifications={setNotifications} />
      <div className="flex flex-grow pt-28 pb-10 px-4 space-x-24">
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
          <Route path="/dashboard" element={<CompanyDashboard/>} />
          <Route path="/pdfView" element={<MyPDFViewer/>} />
          <Route path="/developers" element={<DeveloperListsCard/>} />
          <Route path="/developers/:id" element={<IndividualDevData />} />
          <Route path="/meeting" element={<MeetingHome role="companies" />}/>
          <Route path="/meetingHistory" element={<MeetingHistory/>}/>
         <Route path='/newMeeting' element={<VideoCall role='companies'/>} />
          <Route path="*" element={<PageNotFound />} />
        </Routes>
      </div>
      </companyContext.Provider>
    </>
  );
};

export default CompanyRoute;
