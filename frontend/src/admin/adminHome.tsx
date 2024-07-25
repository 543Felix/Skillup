import React, { useEffect } from "react";
// import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
// import { faUserTie } from "@fortawesome/free-solid-svg-icons";
import { Link } from "react-router-dom";
// import Developers from "./components/developers";
// import Companies from "./components/companies";
import { toast } from "react-toastify";
import Axiosinstance from "../../utils/axios";
import { useNavigate } from "react-router-dom";
import {LogoutOutlined} from '@mui/icons-material'

interface MyComponentProps {
  data?:'dev' | 'company'
}
const AdminHome: React.FC<MyComponentProps> = ({data}) => {
  const navigate = useNavigate()
 const Data = localStorage.getItem('adminData')
  function logOut(){
    Axiosinstance.post('/admin/logout',{})
    .then((res)=>{
      if(res.status === 200){
        localStorage.removeItem('adminData')
        toast.success(res.data.message)
        navigate('/')
      }
    })
  }
  useEffect(()=>{
    if(!Data){
      navigate('/')
    }
  },[Data])


  return (
    <>
      {/* <div className="overflow-y-hidden p-0 m-0"> */}
  <div className="bg-black flex flex-col  space-y-16 items-center w-[220px] h-screen py-20 ">
    <div className="flex flex-col space-y-1 items-center justify-center text-white h-auto">
     <a href="">
      <img src="../public/developer/logo.png"  className="h-[140px]" alt="" />
     </a>
     <h1 className="text-3xl font-bold">upSkill</h1>
    </div>
    <div className="flex flex-col space-y-5  justify-center items-center text-white text-2xl font-thin">
      <h1 className="">Dashboard</h1>
      <Link to='/admin/developers'>
      <h1 className="">Developers</h1>
      </Link>
      <Link to='/admin/companies'>
      <h1 className="">Companies</h1>
      </Link>
    </div>
    <div className="flex text-white items-center space-x-2 justify-center font-semibold">
      <h1 className=" text-2xl" onClick={logOut}>Log out</h1>
      <LogoutOutlined  className="text-white" style={{fontSize:'35px'}} />
    </div>
  </div>
  {/* <div className="flex flex-col ml-3 w-full ">
    <div className="bg-black  grid grid-cols-12 h-16 rounded-lg items-center text-white">
      <input
        className="h-12 ml-7 focus:outline-none rounded-[15px] col-span-5 bg-white text-black"
        type="search"
      />
      <span className="ml-3 col-start-12 border-2 rounded-full h-[35px] w-[35px] flex items-center justify-center">
        <FontAwesomeIcon className="text-white" icon={faUserTie} />
      </span>
    </div>
    <div className=" h-[525px]">
      {data==='dev'?<Developers/>:<Companies/>}
      
      
    </div>
  </div> */}
{/* </div> */}

    </>
  );
};

export default AdminHome;
