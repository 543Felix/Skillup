import React,{useState,useEffect,Dispatch,SetStateAction} from'react'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faUserCircl,faCircleXmark } from '@fortawesome/free-regular-svg-icons'
import { faAngleUp, faBell,faAngleDown } from "@fortawesome/free-solid-svg-icons";
import { Link,useNavigate } from 'react-router-dom'
import { RootState } from '../../store/store'
import { useSelector,useDispatch } from 'react-redux'
import AxiosInstance from '../../../utils/axios'
import { toast } from 'react-toastify'
import { companyLogOut } from '../../store/slice/companySlice'
import socket from '../../../utils/socket'
import { Notification } from '../../Routes/constants';

import { convertToLocalTime } from '../../helperFunctions';
interface Props{
  notifications:Notification[],
  setNotifications:Dispatch<SetStateAction<Notification[]>>
}


const CompanyHeader:React.FC<Props> = ({notifications,setNotifications})=>{
  const [expanded,setExpanded] = useState(false)
const userId = useSelector((state:RootState)=>{
  return state.companyRegisterData._id
})
// const socket = io("http://localhost:3001");
  useEffect(()=>{
    socket.connect()
     
    socket.emit('register',(userId))
    
    
    return()=>{
       socket.disconnect()
    }
      
  },[])
  const {image} = useSelector((state:RootState)=>{
    return state?.companyRegisterData
   })


   const [showDropdown, setShowDropdown] = useState(false);

  // const toggleDropdown = () => {
  //   ;
  // };
   const dispatch = useDispatch()
   const navigate = useNavigate()
 
    function LogOut(){
     AxiosInstance.post('/company/logOut')
      .then((res)=>{
       if(res.status === 200){
         dispatch(companyLogOut())
         toast.success('Logout sucessfull')
         navigate('/')
       }
      })
    }
return(
    <>
    <header className="fixed top-0 w-full py-4  px-10 bg-black border-b-2 border-violet text-white z-10">
        <div className="container items-center flex justify-between h-8 mx-auto">
            {/* <div  className="flex items-center p-2" > */}
            <Link to='/company/'>
              
              <img className="h-[55px] " src='/developer/logo.png' alt="" />
            </Link>  
            {/* <div className='relative'>
            <input type="text" className='ml-[30px] h-[40px] w-[280px] border-2 border-violet focus:outline-none  focus:ring-0 focus:border-violet text-white placeholder:text-white bg-transparent rounded-[8px] justify-self-start pl-[40px]' placeholder='Search' />
            <FontAwesomeIcon icon={faMagnifyingGlass} className='absolute left-10 top-3' />
            </div> */}
            {/* </div> */}
            
          <ul className="items-stretch hidden space-x-5 lg:flex  ">
            {/* <li className="flex">
              <a
                rel="noopener noreferrer"
                href="#"
                className="flex items-center px-2 -mb-1 border-b-2 font-semibold text-sm"
              >
                Developers
              </a>
            </li> */}
            <li className="flex items-center  -mb-1  font-semibold text-md">
              <Link to={'/company/job'}>
                 My posts
                 </Link>
            </li>
            <li className="flex  items-center  -mb-1  font-semibold text-md">
                Schedules
            </li>
            <li className="flex  items-center  -mb-1  font-semibold text-md">
              <Link to={'/company/chats'}>chats</Link>
            </li>
            <li className="flex items-center  -mb-1  font-semibold text-md">
               <Link to={'/company/meeting'}>Meetings</Link> 
            </li>
          </ul>  
           <div className="items-center flex-shrink-0 space-x-2 hidden lg:flex ">         
          <div>
                <span className="relative inline-block">
           <FontAwesomeIcon className="text-white h-[27px]" icon={faBell} onClick={()=>setExpanded(!expanded)} />
  {notifications.length>0&&(<span className="absolute top-0 right-0 inline-flex items-center justify-center px-2 py-1 text-xs font-bold leading-none text-red-100 transform translate-x-1/2 -translate-y-1/2 bg-red-600 rounded-full">{notifications.length}</span>)}
</span>
            

            </div>
          <div className="items-center justify-end space-x-2  hidden lg:flex">
            {image ? (
          <img
            src={image}
            alt="Profile"
            className="self-center py-3 h-[65px] cursor-pointer"
            onMouseEnter={()=>setShowDropdown(true)}
            onMouseLeave={()=>setShowDropdown(false)}
          />
        ) : (
          <FontAwesomeIcon
            className="self-center px-4 py-3 h-10 w-10 cursor-pointer"
            icon={faUserCircle}
           onMouseEnter={()=>setShowDropdown(true)}
            onMouseLeave={()=>setShowDropdown(false)}
          />
        )}
      {/* </Link> */}
      {showDropdown && (
        <div className="absolute right-20 mt-[188px] w-32 bg-black text-white rounded shadow-lg" onMouseEnter={()=>setShowDropdown(true)} onMouseLeave={()=>setShowDropdown(false)}>
          <Link to="/company/profile" className="block px-4 py-2  hover:bg-white hover:text-black">
            Profile
          </Link>
          <Link to="/settings" className="block px-4 py-2  hover:bg-white hover:text-black">
            Settings
          </Link>
          <Link to="" onClick={LogOut} className="block px-4 py-2  hover:bg-white hover:text-black">
            Logout
          </Link>
        </div>
      )}
          
          {/* <button className='border-2 border-violet px-4 py-1 rounded-[8px]' onClick={LogOut}>Log out</button> */}
          <Link to={'/company/createJob'}><button className='border-2 border-violet px-4 py-1 rounded-[8px]'>Create job</button></Link>
          {/* <button className='bg-violet text-white px-3 py-1 rounded-[5px]' onClick={(e)=>LogOut(e)}> Log out</button> */}
          </div>
          </div>
          <div className='flex items-center space-x-4  lg:hidden'>
          <Link to={'/company/profile'}>
              {image?
              <img src={image} alt="" className="self-center py-3 h-[65px] " /> : <FontAwesomeIcon className="self-center px-4 py-3 h-10 w-10" icon={faUserCircle} />
            }
            </Link>
          <button className="py-4 ">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              className="h-10 text-white"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M4 6h16M4 12h16M4 18h16"
              ></path>
            </svg>
          </button>
          </div>
          
        </div>
      </header>
        <div
      className={`fixed z-10 bottom-0 right-5 w-[350px] bg-[rgb(48,47,47)]  transition-all duration-500 ${
        expanded ? 'h-[500px]'  : 'h-10'
      } shadow-custom-black`}
    >
      <div className="flex justify-between items-center h-10 px-4  border-b-2 border-white text-white ">
        <div className="flex space-x-2 items-center">
         <span className="font-semibold text-lg ">Notifications</span>
         <FontAwesomeIcon className="h-4" icon={faBell} />
        </div>
        {expanded===true?<FontAwesomeIcon icon={faAngleDown}  onClick={()=> setExpanded(!expanded)} />:
        <FontAwesomeIcon
          icon={faAngleUp}
          className="cursor-pointer"
          onClick={()=> setExpanded(!expanded)}
        />}

        
      </div>
      <div className={`  overflow-y-auto ${expanded ? 'h-[calc(500px-40px)' : 'h-0'} transition-all duration-500`}>
        {expanded && (
          <ul className="p-4">
            {notifications.length>0&&notifications.map((item,index)=>(
                 <div key={index} className="flex items-center p-4 bg-white rounded-lg shadow-xl mx-auto max-w-sm relative m-3">
                  {/* onClick={()=>{removeNotification(item.id)}} */}
                  <FontAwesomeIcon icon={faCircleXmark} className="text-black mt-2 mr-2 absolute top-0 right-0" />
    <span className="text-xs font-semibold uppercase m-1 py-1 mr-3 text-gray-500 absolute bottom-0 right-0">{convertToLocalTime(item.createdAt)}</span>

    <img className="h-12 w-12 rounded-full" alt="John Doe's avatar"
        src={item.image}/>

    <div className="ml-5">
        <h4 className="text-lg font-semibold leading-tight text-gray-900">{item.name}</h4>
        <p className="text-sm text-gray-600">{item.content}</p>
    </div>
</div>
            ))}
            {/* Add more notifications here */}
          </ul>
        )}
      </div>
    </div> 

    </>
)    
}

export default CompanyHeader