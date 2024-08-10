import { Link } from "react-router-dom";
import {LogoutOutlined} from '@mui/icons-material'
import AxiosInstance from "../../../utils/axios";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";

const SideBar = ()=>{

    const navigate = useNavigate()



    function logOut(){
        AxiosInstance.post('/admin/logout',{})
        .then((res)=>{
          if(res.status === 200){
            localStorage.removeItem('adminData')
            toast.success(res.data.message)
            navigate('/')
          }
        })
      }
   return (
    <div className="bg-black flex flex-col  space-y-16  items-center w-[250px] h-screen py-20 ">
    <div className="flex flex-col space-y-1 items-center justify-center text-white h-auto">
     <a href="">
      <img src="../public/developer/logo.png"  className="h-[140px]" alt="" />
     </a>
     <h1 className="text-3xl font-bold">upSkill</h1>
    </div>
    <div className="flex flex-col space-y-5  justify-center items-center text-white text-2xl font-thin">
    <Link to='/admin/dashboard'>
      <h1 className="">Dashboard</h1>
      </Link>
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
   )
}

export default SideBar