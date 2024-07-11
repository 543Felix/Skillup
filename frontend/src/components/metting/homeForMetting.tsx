import React,{useState} from 'react'
import {Button as ButtonWithIcon } from '@mui/material'
import {VideoCall,Keyboard} from '@mui/icons-material'
import { useNavigate } from 'react-router-dom'
import {nanoid} from 'nanoid'
import { useSelector } from 'react-redux'
import { RootState } from '../../store/store'
import socket from '../../../utils/socket'


interface Props{
  role:'dev'|'companies'
}

const MeettingHome:React.FC<Props> = ({role})=>{
  const [roomId,setRoomId] = useState<string>('')
  // console.log('roomId = ',roomId)
  const {_id,name} = useSelector((state:RootState)=>{
    return role==='companies'?state?.companyRegisterData:state?.developerRegisterData
  })
  const navigate = useNavigate()
  const startMeeting=()=>{
    const roomId =  nanoid()
    socket.emit('new-meetting',{roomId,userId:_id,name},async(response)=>{
       if(response==='success'){
//  const queryParams = new URLSearchParams({ roomId:roomId,id:_id }).toString();
    role==='dev'?navigate(`/dev/newMeeting/${roomId}`):role==='companies'?navigate(`/company/newMeeting/${roomId}`):''
     
       }
    })
   
  }


  const joinMeeting = ()=>{
    if(roomId.trim().length>0){
     socket.emit("join-room",({roomId,userId:_id,name}),async(response)=>{
        if(response==='success'){
          // const queryParams = new URLSearchParams({ roomId:roomId,id:_id }).toString();
    role==='dev'?navigate(`/dev/newMeeting/${roomId}`):role==='companies'?navigate(`/company/newMeeting/${roomId}`):''
        }
     })
    }
  }

    return(
        <div className="absolute top-0 left-0 right-0 h-screen bg-black text-white flex  justify-evenly items-center">

          <div className='flex h-10 space-x-3'>
            {role==='companies'&&(<ButtonWithIcon  onClick={startMeeting} variant='contained' sx={{
          '&.MuiButton-root': {
            backgroundColor: '#7f00ff', 
            '&:hover': {
             backgroundColor:'#fdfdfd',
             color:'#7f00ff' 
            },
          },
        }} startIcon={<VideoCall/>}>New Metting</ButtonWithIcon>)}
         <div className='flex space-x-1 ' >
          <div className='relative ' >
          <Keyboard  className='absolute top-2 left-1  text-gray-400'/>
          <input type="text" className={` focus:border-none focus:ring-0 pl-7 ${role==='dev'?'w-[300px]':'w-full'} text-gray-500`}  value={roomId} onChange={(e)=>setRoomId(e.target.value)} placeholder='Enter a code to join ' />
          </div>
         
          
             <button className='bg-violet text-white px-7 h-full  font-semibold '  onClick={joinMeeting} >Join</button>
         </div>
        

          </div>
         
         <img src="/Metting.jpg" className=" h-[450px] right-0 "  alt="" />
         </div>
    )
}

export default MeettingHome