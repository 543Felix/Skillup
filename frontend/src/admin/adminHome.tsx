import React, { useEffect } from "react";
// import { Link } from "react-router-dom";
import Developers from "./components/developers";
import Companies from "./components/companies";
// import { toast } from "react-toastify";
// import Axiosinstance from "../../utils/axios";
import { useNavigate } from "react-router-dom";
// import {LogoutOutlined} from '@mui/icons-material'
import SideBar from "./components/sideBar";
import DashBoard from "./components/dashboard";

interface MyComponentProps {
  data?:'dev' | 'company'|'dashboard'
}
const AdminHome: React.FC<MyComponentProps> = ({data}) => {
  const navigate = useNavigate()
 const Data = localStorage.getItem('adminData')
  useEffect(()=>{
    if(!Data){
      navigate('/')
    }
  },[Data,navigate])


  return (
    <>
      <div className="flex  overflow-y-hidden p-0 m-0">
          <SideBar/>
      
          <div className="flex flex-col ml-3 w-full  ">
    <div className=" h-[525px]">
      {data==='dev'?<Developers/>:data==='dashboard'?<DashBoard/>:<Companies/>}
    </div>
          
          
         </div> 
 </div>

    </>
  );
};

export default AdminHome;
