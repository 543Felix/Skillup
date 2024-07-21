import React,{useRef,useState} from 'react'
import {ZegoUIKitPrebuilt} from '@zegocloud/zego-uikit-prebuilt'
import { useSelector } from 'react-redux';
import { RootState } from '../../store/store';



interface Props{
    role:'dev'|'companies'
}

const GroupCall:React.FC<Props> = ({role}) => {
    

    const [roomId,setRoomId] = useState<string>('')
    const [call,showCall] = useState<boolean>(false)
    const roomRef = useRef<HTMLDivElement>(null)

    const pathname = window.location.pathname
//     const basePaths = ['/dev/meeting/', '/company/meeting/'];
    const {name,_id} = useSelector((state:RootState)=>{
        return role==='dev'?state.developerRegisterData:state.companyRegisterData
     })


const handleJoinRoom = ()=>{
    if(roomId.trim().length!==0){
        window.history.pushState({},"",`${pathname}/`+roomId)
        joinRoom(roomId)
        showCall(true)
    }
}

      function joinRoom(roomId:string){
        console.log('roomId = ',roomId)
        const kitToken = ZegoUIKitPrebuilt.generateKitTokenForTest(
            Number(import.meta.env.VITE_ZEGO_APP_ID),
            import.meta.env.VITE_ZEGO_SERVER_SECRET,
            roomId,
            _id,
            name
        )

        const zp = ZegoUIKitPrebuilt.create(kitToken)
        zp.joinRoom({
            container:roomRef.current,
            sharedLinks:[
                {
                    name:"Room Code",
                    url:roomId
                }
            ],
            scenario:{
                mode:ZegoUIKitPrebuilt.GroupCall
            }
        })
      }
      
    
  return(
    <>
          {call===false
          ?
        <div className="h-screen w-screen absolute top-0 left-0 bottom-0 right-0 bg-black bg-opacity-55 z-50 flex justify-center items-center">
            <div className='h-[250px] w-[530px] bg-white flex flex-col justify-center items-center rounded-[30px] space-y-4'  >
                <div className='flex justify-center text-2xl font-semibold'>
                <h1>Create a room or join Existing one</h1>
                </div>
                <div className='flex flex-col space-y-3 w-full px-10'>
                 <input className='bg-gray-700 h-14 text-white' type="text" onChange={(e)=>setRoomId(e.target.value)} />
               <button className='bg-violet h-12 text-white' onClick={handleJoinRoom}>Join Room</button>
                </div>
              
            </div>
        </div>
        :
         <div className="h-screen w-screen absolute top-0 left-0 bottom-0 right-0 overflow-hidden z-50" ref={roomRef}></div>
        }
    </>
  )
};

export default GroupCall;
