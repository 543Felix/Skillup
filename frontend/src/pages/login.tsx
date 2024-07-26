import  {AxiosResponse} from "axios";
import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";
import { useDispatch } from 'react-redux'
import { setDeveloperData } from '../store/slice/developerSlice'
import { setCompanyData } from "../store/slice/companySlice";
import { setAdminData } from "../store/slice/adminSlice";
import AxiosInstance from '../../utils/axios'
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faEye,faEyeSlash } from "@fortawesome/free-regular-svg-icons";
import { RegAndLoginResponse } from "../../types/interface";

const Login: React.FC<{ data: string }> = ({data}) => {
  const role = data ||'defaultRole'
  const dispatch = useDispatch()
  const [name , setName] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword,setShowPassword] = useState(false)
   const navigate = useNavigate()
   
   const dev = localStorage.getItem('developerData')
   const company = localStorage.getItem('companyData')
   const admin = localStorage.getItem('adminData')
   
  
  useEffect(()=>{
    if(role==='dev'&&dev){
      navigate('/dev/')
    }
    else if(role==='company'&&company){
      navigate('/company/')
    }
    else if(role==='Admin'&&admin){
      navigate('/admin/')
    }
  },[role,navigate,dev,company,admin])

  const handleValidation = () => {
    let valid = true;

    if (name.length < 3 || !/^[A-Z][a-zA-Z]+(?: [a-zA-Z]+)*$/.test(name)) {
      toast.error('Name must be at least 3 characters long, start with a capital letter, and contain only alphabets with spaces allowed between words.');
      return;
    }

    if (password.length < 6 || !/(?=.*[A-Z])(?=.*[a-z])(?=.*\d)/.test(password)) {
      toast.error('Password must be at least 6 characters long with at least one uppercase letter, one lowercase letter, and one digit.');
        valid = false;
      }

    return valid;
  };

  const handleLogin = () => {
    console.log('clicked on login button')
    if (!handleValidation()) {
      return;
    }
    if(role === 'dev'){
      AxiosInstance.post('/dev/login',{name,password})
      .then((res:AxiosResponse<RegAndLoginResponse>)=>{
        if(res.status===200){
          if(res.data.data){
            const {_id,image,name} = res.data.data
            console.log('image = ',image)
            console.log(res.data.data)
            dispatch(setDeveloperData({_id,image,name}))
          localStorage.setItem('developerData',JSON.stringify({_id,image,name}))
          toast.success('Login successful')
          navigate('/dev/')
          }
          
        }
      })
      .catch((error):void=>{
        if(error.response.data.message){
          toast.error(error.response.data.message)
        }else{
          toast.error(error.message)
        }
      })
    }
    else if(role === 'company'){
      console.log('entered to company login post api')
      AxiosInstance.post('/company/login',{name,password})
      .then((res:AxiosResponse<RegAndLoginResponse>)=>{
        if(res.status === 200){
          const {_id,image,name} = res.data.data
          dispatch(setCompanyData({_id,image,name}))
          localStorage.setItem('companyData',JSON.stringify({_id,image,name}))
          toast.success('company login successfull')
          navigate('/company/')
        }
          
      
       
      })
      .catch((error):void=>{
        if(error.response.data.message){
          toast.error(error.response.data.message)
        }else{
          toast.error(error.message)
        }
      })
    }
      if(role === 'Admin'){
        AxiosInstance.post('/admin/login',{name,password})
      .then((res:AxiosResponse<{message:string}>)=>{
        console.log(res)
          dispatch(setAdminData({name}))
          localStorage.setItem('adminData',JSON.stringify({name}))
          navigate('/admin/')
      
       
      })
      .catch((error):void=>{
        if(error.response.data.message){
          toast.error(error.response.data.message)
        }else{
          toast.error(error.message)
        }
      })
      }
  };

  return (
    <div className="h-[450px] lg:w-[600px] lg:mx-[330px] my-[70px] md:mx-[130px] sm:mx-[80px] text-white bg-slate-500 bg-opacity-[5%] shadow-custom-black hover:scale-95  transition-transform duration-300 shadow-black rounded-[30px] grid grid-rows-8 grid-cols-10 gap-y-3 bg-[url">
      <p className="text-6xl font-serif row-start-2 col-start-4  mt-4  ">Welcome</p>
      <input className="row-start-4 col-start-3 col-span-6 pl-5 bg-white rounded-md placeholder-gray-600 text-gray-600 focus:outline-none" type="text"  placeholder="Enter your name" value={name} onChange={(e) => setName(e.target.value)} />
      <div className="relative row-start-5 col-start-3 col-span-6">
      <input className=" w-full bg-white rounded-md placeholder-gray-600 text-gray-600 focus:outline-none" type={showPassword?'text':'password'}  placeholder="Enter your password" value={password} onChange={(e) => setPassword(e.target.value)} />
      <FontAwesomeIcon icon={showPassword?faEye:faEyeSlash} onClick={()=>setShowPassword(!showPassword)}  className="text-gray-600 absolute right-2 top-[10px]"/>
      </div>
      
      <p className="row-start-6 mt-6 col-start-4 col-span-6">Doesn't have an account yet <Link to='/registerAs' className="font-semibold hover:text-xl transition-transform duration-500">Sign up</Link></p>
      <button className="justify-center row-start-7 mt-4 h-8 w-28 bg-transparent border-2 border-violet  col-start-5 rounded-[8px] px-4 py-[6px] flex items-center font-bold hover:scale-110 transition-transform duration-500" onClick={handleLogin}>Sign in</button>
    </div>
  );
};

export default Login;
