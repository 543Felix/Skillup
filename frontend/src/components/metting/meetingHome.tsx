import React,{useState,useEffect} from 'react'
import { useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { RootState } from '../../store/store';
import AxiosInstance from '../../../utils/axios';
import { toast } from 'react-toastify';
import {Button as ButtonWithIcon } from '@mui/material'
import {VideoCall,Keyboard} from '@mui/icons-material'
import socket from '../../../utils/socket';
import Loader from '../../pages/loader';


interface Props {
  role: 'dev' | 'companies';
}

interface Members{
  _id:string;
  name:string
}

interface MeetingHistory{
  _id:string;
  roomId:string;
  createdAt:Date;
  createdBy:string;
  callDuration:string;
  members:Members[]
}

const MeetingHome:React.FC<Props> = ({role})=>{
  
   const [roomId,setRoomId] = useState('')
   const [pageState,setPageState] = useState<'Meeting History'|'New Meeting'>('New Meeting')
   const navigate = useNavigate()
  const {_id,name} = useSelector((state:RootState)=>{
    return role==='dev'?state.developerRegisterData:state.companyRegisterData
  })
  const [loader,setLoader] = useState<boolean>(false)
 

  const [data,setData] = useState<MeetingHistory[]>([])
      
  useEffect(()=>{
      AxiosInstance.get(`/meeting/meetingHistory/${_id}`)
      .then((res)=>{
        if(res.data){
          setData(res.data)
        }
      })
  },[_id])


   const joinRoom = (e:React.MouseEvent<HTMLButtonElement>)=>{
    e.preventDefault()
    console.log('roomId = ',roomId)
    if(roomId.trim().length!==0){
      const Role = role==='dev'?'dev':'company'
      socket.emit('joinRoom',{roomId,_id,name},(response:string)=>{
          if(response==='success'){
            navigate(`/${Role}/newMeeting`,{state:roomId}) 
            setRoomId('')
          }else{
            toast.error(response)
          }
      })
    }else{
      toast.error('RoomId cannot be empty ')
    }     
   }


  const startMetting = ()=>{
    setLoader(true)
     socket.emit('newMeeting',{_id,name},(roomID:string)=>{
       console.log('response = ',roomID)
       if(roomID.trim().length!==0){
      const Role = role==='dev'?'dev':'company'
      navigate(`/${Role}/newMeeting`,{state:roomID})
      setRoomId('')
       }
       setLoader(false)
     })
  }
    return(
       <div className="h-full w-screen overflow-y-hidden text-white">
          <div className="w-full flex text-white font-semibold text-xl space-x-4">
            <div className={`${pageState==='New Meeting'?' border-b-4':''} px-1`} onClick={()=>setPageState('New Meeting')}>
            <h1 className=''>New Meeting</h1>
            </div>
            <div className={`${pageState==='Meeting History'?' border-b-4':''} px-1`} onClick={()=>setPageState('Meeting History')}>
            <h1>Meeting History</h1>
            </div>
              {/* <button className="bg-violet text-white px-5 py-1 rounded-lg">Create an instant meeting</button> */}
          </div> 
          <div className='h-full w-full py-3'>
            {loader===true?(<Loader />):
            (
            <>
             {pageState==='Meeting History'&&(
               <div className="w-screen px-4">
               <div className="col-span-12 w-full">
                 <div className="grid gap-2 grid-cols-1 lg:grid-cols-1">
                   <div className="bg-black p-4 shadow-lg rounded-lg">
                     <div className="mt-4">
                       <div className="flex flex-col">
                         <div className="-my-2 overflow-x-auto">
                           <div className="py-2 align-middle inline-block min-w-full">
                             <div className="shadow overflow-hidden sm:rounded-lg">
                               {data.length > 0 ? (
                                 <table className="min-w-full">
                                   <thead>
                                     <tr>
                                     <th className="px-6 py-3 bg-black text-xs leading-4 font-medium text-gray-500 uppercase tracking-wider">
                                         <div className="flex cursor-pointer">
                                           <span className="mr-2"></span>
                                         </div>
                                       </th>
                                       <th className="px-6 py-3 bg-black text-xs leading-4 font-medium text-gray-500 uppercase tracking-wider">
                                         <div className="flex cursor-pointer">
                                           <span className="mr-2">Meeting Date</span>
                                         </div>
                                       </th>
                                       <th className="px-6 py-3 bg-black text-xs leading-4 font-medium text-gray-500 uppercase tracking-wider">
                                         <div className="flex cursor-pointer">
                                           <span className="mr-2">RoomId</span>
                                         </div>
                                       </th>
                                       <th className="px-6 py-3 bg-black text-xs leading-4 font-medium text-gray-500 uppercase tracking-wider">
                                         <div className="flex cursor-pointer">
                                           <span className="mr-2">Room Created By</span>
                                         </div>
                                       </th>
                                       <th className="px-6 py-3 bg-black text-xs leading-4 font-medium text-gray-500 uppercase tracking-wider">
                                         <div className="flex cursor-pointer">
                                           <span className="mr-2">Members</span>
                                         </div>
                                       </th>
                                       <th className="px-6 py-3 bg-black text-xs leading-4 font-medium text-gray-500 uppercase tracking-wider">
                                         <div className="flex cursor-pointer">
                                           <span className="mr-2">Duration</span>
                                         </div>
                                       </th>
                                     </tr>
                                   </thead>
                                   <tbody className="bg-black">
                                       {data.length>0&&data.map((item,index)=>(
                                          <tr key={item._id} >
                                          <td className="px-6 py-4 text-white whitespace-no-wrap text-sm leading-5">
                                            <p>{index+1}</p>
                                          </td>
                                          <td className="px-6 py-4 text-white whitespace-no-wrap text-sm leading-5">
                                            <p>{new Date(item?.createdAt).toISOString().split('T')[0]}</p>
                                          </td>
                                          <td className="px-6 py-4 text-white whitespace-no-wrap text-sm leading-5">
                                            <p>{item.roomId}</p>
                                          </td>
                                          <td className="px-6 py-4 text-white whitespace-no-wrap text-sm leading-5">
                                            <p>{item.createdBy}</p>
                                          </td>
                                          <td className="px-6 py-4 flex justify-center items-center whitespace-no-wrap text-sm leading-5">
                                              <div className='flex flex-col space-y-1 '>
                                              {item.members.length>0&&item.members.map((member)=>(
                                               <p className='w-full'>{member.name}</p>
                                              ))}
                                               </div>
                                          </td>
                                          <td className="px-6 py-4 text-white whitespace-no-wrap text-sm leading-5">
                                            <p>{item.callDuration}</p>
                                          </td>
                                        </tr>
                                       ))}
                                      
                                   </tbody>
                                 </table>
                               ) : (
                                 <div className="flex justify-center text-white text-3xl font-semibold py-5">
                                   <h1>Currently no meeting history </h1>
                                 </div>
                               )}
                             </div>
                           </div>
                         </div>
                       </div>
                     </div>
                   </div>
                 </div>
               </div>
               </div>
        )}
        {pageState==='New Meeting'&&(
            <div className=' w-full h-full '>
    <div className="h-full w-full flex space-x-3   top-0 left-0 bottom-0 right-0 justify-center items-center">
          <div className='flex h-10 space-x-2'>
        <ButtonWithIcon onClick={startMetting}   variant='contained' sx={{
      '&.MuiButton-root': {
        backgroundColor: '#7f00ff', 
        '&:hover': {
         backgroundColor:'#fdfdfd',
         color:'#7f00ff' 
        },
      },
    }} startIcon={<VideoCall/>}>New Metting</ButtonWithIcon>
     <div className='flex space-x-1 ' >
      <div className='relative ' >
      <Keyboard  className='absolute top-2 left-1  text-gray-400'/>
      <input type="text" className={` focus:border-none focus:ring-0 pl-7 'w-full' text-gray-500`}  value={roomId} onChange={(e)=>setRoomId(e.target.value)} placeholder='Enter a code to join ' />
      </div>
     
      
         <button className='bg-violet text-white px-7 h-full  font-semibold ' onClick={joinRoom} >Join</button>
     </div>
    

           </div>
     
        <img src="/Metting.jpg" className=" h-[400px] right-0 "  alt="" />
    </div>
            </div>
        )}
            </>
            )
            }
            
            
          </div>
       </div>
    )
}
export default MeetingHome