import React ,{useState,Dispatch,SetStateAction} from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { Link } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faUserCircle,
  faCircleXmark
} from "@fortawesome/free-regular-svg-icons";
import { faAngleUp, faBell,faAngleDown } from "@fortawesome/free-solid-svg-icons";
import AxiosInstance from '../../../utils/axios'
import { useSelector,useDispatch } from "react-redux";
import { RootState } from "../../store/store";
import { clearDeveloperData } from "../../store/slice/developerSlice";
import {Notification} from '../../Routes/constants'
import { convertToLocalTime } from "../../helperFunctions";  

interface Props{
  notifications:Notification[],
  setNotifications:Dispatch<SetStateAction<Notification[]>>
}



const DevHeader: React.FC<Props> = React.memo(({notifications,setNotifications}) => {
  
  const navigate = useNavigate()
  const dispatch = useDispatch()
  const [expanded, setExpanded] = useState(false);
  const [showDropdown,setShowDropdown] = useState(false)
//  const [data,setData] = useState([])

 const {image,_id} =  useSelector((state:RootState)=>{
    return state.developerRegisterData
  })
    

   
  

  const removeNotification =(id:string)=>{
      AxiosInstance.delete(`/notifications/deleteNotification/${_id}/${id}`)
      .then(()=>{
        setNotifications((prevState)=>{
          const filteredData = [...prevState].filter((item)=>id!==item.id)
          return filteredData
        })
      })
      .catch(()=>{

      })
  }

  function logOut(){
    AxiosInstance.post('/dev/logOut',{}).then((res)=>{
      if(res.status === 200){
        localStorage.removeItem('developerData')
        dispatch(clearDeveloperData())
        toast.success('Logout sucessfull')
      }
      navigate('/')
    }).catch((error)=>{
     console.log(error)
    })
    
  }

  return (
    <>
      <header className="fixed top-0 w-full p-4 mb-2 bg-black  border-b-2 border-violet text-white z-10">
        <div className="container flex justify-between h-8 mx-auto px-10">
            <div  className="flex items-center p-2" >
            <Link to='/dev/'>
              <img className="h-[55px]" src="/developer/logo.png" alt="" />
            </Link>
            </div>
          <ul className="items-stretch hidden space-x-3 lg:flex ">
            <li className="flex items-center px-4 -mb-1 border-b-2">
              <Link to={'/dev/job'}>  jobs</Link>
            </li>
            <li className="flex items-center px-4 -mb-1 border-b-2">
               <Link to={'/dev/savedJobs'}> Saved jobs</Link>
            </li>
            <li className="flex items-center px-4 -mb-1 border-b-2">
              
             <Link to={'/dev/proposals'}> Proposals</Link>  
            </li>
            <li className="flex items-center px-4 -mb-1 border-b-2">
              <Link to={'/dev/chats'}>chats</Link>
                
            </li>
            <li className="flex items-center px-4 -mb-1 border-b-2">
               <Link to={'/dev/meeting'}>Meetings</Link> 
            </li>
          </ul>  
          <div className="items-center flex-shrink-0 hidden lg:flex ">
            <div>
                <span className="relative inline-block">
           <FontAwesomeIcon className="text-white h-[27px]" icon={faBell} onClick={()=>setExpanded(!expanded)} />
  {notifications.length>0&&(<span className="absolute top-0 right-0 inline-flex items-center justify-center px-2 py-1 text-xs font-bold leading-none text-red-100 transform translate-x-1/2 -translate-y-1/2 bg-red-600 rounded-full">{notifications.length}</span>)}
</span>
            

            </div>
            {/* <Link to='/dev/profile'> */}
            <div onMouseEnter={()=>setShowDropdown(true)} onMouseLeave={()=>setShowDropdown(false)}>
 {image ? (
  <img src={image}  className="h-[35px] m-4" alt="User Profile" />
) : (
  <FontAwesomeIcon className="self-center px-8 py-3 h-10 w-10" icon={faUserCircle} />
)}
            </div>
           
           
            {/* </Link> */}
                {showDropdown && (
        <div className="absolute right-3 mt-[188px] w-32 bg-black text-white rounded shadow-lg" onMouseEnter={()=>setShowDropdown(true)} onMouseLeave={()=>setShowDropdown(false)}>
          <Link to="/dev/profile" className="block px-4 py-2  hover:bg-white hover:text-black">
            Profile
          </Link>
          <Link to="/dev/pricingPage" className="block px-4 py-2  hover:bg-white hover:text-black">
            Pricing
          </Link>
          <Link to="" onClick={logOut} className="block px-4 py-2  hover:bg-white hover:text-black">
            Logout
          </Link>
        </div>
      )}
          </div>
          <button className="p-4 md:hidden">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              className="w-6 h-6 text-gray-800"
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
                  <FontAwesomeIcon icon={faCircleXmark} className="text-black mt-2 mr-2 absolute top-0 right-0" onClick={()=>{removeNotification(item.id)}}/>
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
  );
});
export default DevHeader;
