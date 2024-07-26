import React,{ useState } from "react"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import { faEye } from "@fortawesome/free-regular-svg-icons"
import { faEyeSlash } from "@fortawesome/free-regular-svg-icons"
import AxiosInstance from "../../../utils/axios"
import { AxiosResponse,AxiosError } from "axios"
import { GoogleOAuthProvider, GoogleLogin } from "@react-oauth/google";
import { jwtDecode } from "jwt-decode";
import  {DecodedJwt} from '../../../types/interface'
import { toast } from "react-toastify"
import { useNavigate,Link } from "react-router-dom"
import Loader from "../loader"




interface CredentialResponse {
  credential?: string;
  clientId?: string;
}


const Register = ()=>{
  const [formData,setFormData] = useState({
    firstName:'',
    lastName:'',
    email:'',
    phoneNo:'',
    password:'',
    confirmPassword:''
  })
   const [loading,setLoading] = useState(false)
   const [showPassword,setShowPassword] = useState(false)
   const [showCPassword,setShowCPassword] = useState(false)

   const navigate = useNavigate()



  const handleInputChange =(e: React.ChangeEvent<HTMLInputElement>)=>{
   setFormData((prevState)=>{
    return{
    ...prevState,
   [e.target.name]:e.target.value
    }
   })
  }
  const handleKeyPress = (event:React.KeyboardEvent<HTMLFormElement>) => {
    if (event.key === 'Enter') {
      event.preventDefault(); // Prevents form submission
      handleRegistration();
    }
  };
  const handleRegistration = () => {
    if (formData.firstName.trim().length===0) {
      toast.error('firstName field is required')
      return;
    }

    if (formData.firstName.length < 3 || !/^[A-Z][a-zA-Z]+(?: [a-zA-Z]+)*$/.test(formData.firstName)) {
      toast.error('firstName must be at least 3 characters long,start with a capital letter,and contain only alphabets')
      return;
    }
    if (formData.firstName.trim().length===0) {
      toast.error('lastName  is required')
      return;
    }

    if (formData.lastName.length < 3 || !/^[A-Z][a-zA-Z]+(?: [a-zA-Z]+)*$/.test(formData.lastName)) {
      toast.error('lastName must be at least 3 characters long,start with a capital letter,and contain only alphabets')
      return;
    }
    if (formData.email.trim().length===0) {
      toast.error('Email  is required')
      return;
    }

    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      toast.error('Invalid email address.')
      return;
    }

    if (!/^\d{10}$/.test(formData.phoneNo)) {
      toast.error(' phone number should contain exactly 10 digits')
      return;
    }

    if (formData.password.length < 6 || !/(?=.*[A-Z])(?=.*[a-z])(?=.*\d)/.test(formData.password)) {
      toast.error('try strong password atLeast 6 characters with atLeast 1 uppercaseLetter one Lowercas and a digit')
      return
    }

    if (formData.password !== formData.confirmPassword) {
      toast.error('Passwords do not match.')
      return;
    }
   
    setLoading(true)
    // const {firstName,lastName,email,phoneNo,password} = formData
     AxiosInstance.post('/dev/registration', formData)
    .then((res:AxiosResponse<{message:string}>)=>{
     console.log(res)
     if(res.status === 200){
      toast.success('please check your mail for otp')
      navigate("/dev/register/verifyOtp")
     }
     else if(res.status === 400){
      toast.error('userAlready exists')
      console.log('userAlready exists')
     }
     
    })
    .catch((error) => {
      if (error.response && error.response.data && typeof error.response.data === 'object' && 'message' in error.response.data) {
        toast.error(error.response.data.message);
      } else {
        toast.error(error.message);
      }
    })
    .finally(()=>{
      setLoading(false)
    })
  };

  const handleGoogleSuccess = async (credentialResponse:CredentialResponse) => {
    if (credentialResponse && credentialResponse.credential) {
      const decoded = jwtDecode<DecodedJwt>(credentialResponse.credential);
      const data = {
        name: decoded.name,
        email: decoded.email,
        password: decoded.sub,
      };

      try {
        const response = await AxiosInstance.post('/dev/registerWithGoogle', data);
        const { _id, image } = response.data.data;
        const str = JSON.stringify({ _id, image });
        const message = response.data.message;

        localStorage.setItem('developerData', str);
        toast.success(message);
        navigate("/dev/");
      } catch (error) {
        if (error instanceof AxiosError) {
    toast.error(error.response?.data?.message || 'An error occurred');
  } else {
    toast.error('An unknown error occurred');
  }
      }
    }
  };

  const handleGoogleError = () => {
    console.log("Registration Failed");
  };

  
  return(
    <>
    {loading&&(
      <Loader/>
    )}
     <div className="flex flex-col justify-center items-center  text-[#333] lg:h-screen p-6">
      {/* <div className="grid md:grid-cols-2 gap-y-8 max-w-6xl w-full shadow-custom-black rounded-[15px]">  */}
      {/* <div className=" max-md:order-1 flex flex-col justify-center sm:p-6 p-4 bg-[url('../developer/registration.jpg')] rounded-l-[15px] bg-cover w-full h-full space-y-16">
        </div> */}
        <form className=" sm:p-6 w-1/2 p-4 bg-baseBaground bg-opacity-[15%]  rounded-[30px] shadow-custom-black " onKeyDown={handleKeyPress}>
          <div className="mb-8">
            <h3 className="text-violet text-3xl font-extrabold max-md:text-center">Register</h3>
          </div>
          <div className="grid lg:grid-cols-2 gap-y-4 gap-x-7">
            <div>
              <label className="text-sm mb-2 block text-white">First Name</label>
              <input name="firstName" value={formData.firstName} type="text" className="bg-gray-100 w-full text-sm px-4 py-3 rounded-md  focus:ring-0 focus:outline-none focus:border-none"  onChange={handleInputChange} placeholder="Enter name" />
            </div>
            <div>
              <label className="text-sm mb-2 block text-white">Last Name</label>
              <input name="lastName" value={formData.lastName} type="text"  className="bg-white w-full text-sm px-4 py-3 rounded-md " onChange={handleInputChange} placeholder="Enter last name" />
            </div>
            <div>
              <label className="text-sm mb-2 block text-white">Email Id</label>
              <input name="email" value={formData.email} type="text" className="bg-gray-100 w-full text-sm px-4 py-3 rounded-md " onChange={handleInputChange} placeholder="Enter email" />
            </div>
            <div>
              <label className="text-sm mb-2 block text-white">Mobile No.</label>
              <input name="phoneNo" value={formData.phoneNo} type="text" className="bg-gray-100 w-full text-sm px-4 py-3 rounded-md " onChange={handleInputChange} placeholder="Enter mobile number" />
            </div>
            <div className="relative">
              <label className="text-sm mb-2 block text-white">Password</label>
              <input name="password" value={formData.password} type={showPassword===false?"password":'text'} className="bg-gray-100 w-full text-sm px-4 py-3 rounded-md " onChange={handleInputChange} placeholder="Enter password" />
              <FontAwesomeIcon className="absolute right-2 text-black mt-[15px]" icon={showPassword===false?faEyeSlash:faEye} onClick={()=>setShowPassword(!showPassword)} />
            </div>
            <div className="relative">
              <label className="text-sm mb-2 block text-white">Confirm Password</label>
              <input name="confirmPassword" value={formData.confirmPassword} type={showCPassword===false?"password":"text"} className="bg-white w-full text-sm px-4 py-3 rounded-md " onChange={handleInputChange} placeholder="Enter confirm password" />
              <FontAwesomeIcon className="absolute right-2 text-black mt-[15px]" icon={showCPassword===false?faEyeSlash:faEye} onClick={()=>setShowCPassword(!showCPassword)} />
            </div>
          </div>
          <div className="flex justify-center mt-3">
            <GoogleOAuthProvider  clientId={import.meta.env.VITE_REACT_APP_GOOGLE_CLIENT_ID}>
        <div className="w-full sm:w-64">
          <GoogleLogin
            onSuccess={handleGoogleSuccess}
            onError={handleGoogleError}
          />
        </div>
      </GoogleOAuthProvider>
      
    </div>
          <div className="flex justify-center my-3 text-gray-300 hover:text-white">
        <Link to={'/dev/login'}><span>Already have an account Login..</span></Link>
          </div>
         
          <div className="mt-5 flex justify-center mb-4">
            <button type="button" className="min-w-[150px] py-2 px-4 text-sm font-semibold rounded-md text-white bg-violet hover:scale-105 focus:outline-none transition-all" onClick={handleRegistration}>
              Sign up
            </button>
          </div>
        </form>
      
       {/* </div> */}
    </div>
    </>
   
  )
}

export default Register