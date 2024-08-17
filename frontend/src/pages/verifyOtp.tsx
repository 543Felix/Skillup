import React, { useState, useEffect } from "react";
import { AxiosResponse } from "axios";
import { useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import { setDeveloperData } from "../store/slice/developerSlice";
import { setCompanyData } from "../store/slice/companySlice";
// import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
// import { faSpinner } from "@fortawesome/free-solid-svg-icons";
import { toast } from "react-toastify";
import Axiosinstance from "../../utils/axios";
import Loader from "./loader";
import { RegAndLoginResponse } from "../../types/interface";


interface MyComponentProps {
  data:'dev' | 'company'
}

const VerifyOtp: React.FC<MyComponentProps> = ({ data }) => {
  const role = data;
  const dispatch = useDispatch();
  const [otp, setOtp] = useState("");
  const [timer, setTimer] = useState(60);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const dev = localStorage.getItem("developerData");
  const company = localStorage.getItem("companyData");

  useEffect(() => {
    if (role === "dev" && dev) {
      navigate("/dev/");
    } else if (role === "company" && company) {
      navigate("/company/");
    }
  }, [navigate,role,dev,company]);

  function otpTimer(time = 60){
    const myInterval = setInterval((): void => {
      time = time - 1;
      setTimer(time);
      if (time === 0) {
        clearInterval(myInterval);
        setTimer(0)
      }
    }, 1000);
  }

  useEffect(() => {
    otpTimer()
  }, []);

  const submit = () => {
    setLoading(true);
      Axiosinstance.post(`/${role}/verify`,{otp:otp})
        .then((response: AxiosResponse<RegAndLoginResponse>) => {
          if (response.status === 200) {
            const {_id,image,name } = response.data.data;
            if(role ==='dev'){
              dispatch(setDeveloperData({_id,image,name}))
              localStorage.setItem(
                "developerData",
                JSON.stringify({ _id,image,name})
              );
              navigate("/dev/")
            }
            else if(role ==='company'){
              dispatch(setCompanyData({_id,image,name}))
              localStorage.setItem(
                "companyData",
                JSON.stringify({ _id,image,name })
              );
              navigate('/company/')
            } 
            toast.success("otp verification successfull");
            
          }
        })
        .catch((error) => {
          toast.error(error.response.data.message);
          console.log(error.message);
        })
        .finally(() => {
          setLoading(false);
        });
        
      }
    const resendOtp = ()=>{
      setLoading(true)
      console.log('entered to the resend otp')
     Axiosinstance.post(`/${role}/resendOtp`)
     .then((res)=>{
      toast.success(res.data.message)
      otpTimer()
     })
     .catch((res)=>{
      toast.error(res.data)
     }).finally(()=>{
      setLoading(false)
     })
    }
  return (
    <div className="grid grid-rows-3 justify-center  bg-black mx-[350px] my-[80px] w-[650px] h-[450px] rounded-[40px]">
      {loading && (
        <Loader/>
      )}
      <p className="row-start-1 mt-6 text-white text-6xl">Verify Otp</p>
      <div className="relative">
  <input
    className="justify-center h-[35px] w-[270px] row-start-2 mt-6 border-none focus:border-none pl-3  relative"
    value={otp}
    type="text"
    onChange={(e) => setOtp(e.target.value)}
  />
     <div className="absolute inset-y-20 left-0 row-start-2  ">
      {timer>0? <div>
            <p className="text-white justify-center">Time Remaining : {timer}</p>
         </div>: <div>
            <p className="text-gray-500 justify-center">Time Remaining : {timer}</p>
         </div>}
        
      </div>
      {timer===0?<div className="absolute inset-y-20 right-3 row-start-2 flex">
      <a className="text-white text-base underline hover:cursor-pointer" onClick={resendOtp} >Resend OTP</a>
      </div>:<div className="absolute inset-y-20 right-3 row-start-2 flex">
      <a className="text-gray-500 text-base underline">Resend OTP</a>
      </div>}
      
      
      
    
    
    
 
</div>



      <button
        className="row-start-3 bg-violet text-white  h-[30px] rounded-3xl justify-center"
        onClick={() => submit()}
      >
        verify otp
      </button>
    </div>
  );
};
export default VerifyOtp;
