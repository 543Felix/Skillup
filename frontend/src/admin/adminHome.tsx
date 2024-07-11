import React, { useEffect } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faUserTie } from "@fortawesome/free-solid-svg-icons";
import { Link } from "react-router-dom";
import Developers from "./components/developers";
import Companies from "./components/companies";
import { toast } from "react-toastify";
import Axiosinstance from "../../utils/axios";
import { useNavigate } from "react-router-dom";

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
      <div className="flex p-4 z-0">
  <div className="bg-black  w-[220px] h-[600px] rounded-lg grid col grid-rows-8">
    <div className="row-start-1 pt-10 flex justify-center text-white h-[50px]">
     <a href="">
      <img src="../public/developer/logo.png"  className="h-[100px]" alt="" />
     </a>
    </div>
    <div className="row-start-3 mt-14 h-[350px] grid grid-rows-8 justify-center items-center text-white text-xl">
      <h1 className="row-start-1">Dashboard</h1>
      <Link to='/admin/developers'>
      <h1 className="row-start-2">developers</h1>
      </Link>
      <Link to='/admin/companies'>
      <h1 className="row-start-3">companies</h1>
      </Link>
      <h1 className="row-start-6" onClick={logOut}>Log out</h1>
    </div>
  </div>
  <div className="flex flex-col ml-3 w-full ">
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
  </div>
</div>

    </>
  );
};

export default AdminHome;
