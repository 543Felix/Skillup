import React,{useState,useRef,useEffect} from 'react'
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faMicrophone,faMicrophoneLinesSlash, faVideoCamera,faVideoSlash } from "@fortawesome/free-solid-svg-icons";
import { CallEnd,
    PresentToAll,
    KeyboardArrowUpOutlined as ArrowUp,
    KeyboardArrowDownOutlined as ArrowDown,
    // West as Left,
    CloseOutlined as Close,
    ContentCopyOutlined as Copy,
    PeopleAltOutlined as Users,
    ChatOutlined as Chat
} from "@mui/icons-material";
import { toast } from 'react-toastify';
import { useParams } from "react-router-dom";
import socket from '../../../utils/socket';
import { useSelector } from 'react-redux';
import { RootState } from '../../store/store';
import { useNavigate } from 'react-router-dom'; 

// import Draggable from 'react-draggable'


interface Props{
  role:'dev'|'companies'
}

const VideoCall:React.FC<Props> = ({role}) => {
  const {roomId} = useParams()


const {_id,name} = useSelector((state:RootState)=>{
   return role==='dev'?state.developerRegisterData:state.companyRegisterData
})
const copyTextRef = useRef(null);
const [modalToCpyTxt, setModalToCpyTxt] = useState<boolean>(true);
const remoteVideoRefs = useRef<Map<string, HTMLVideoElement | null>>(new Map());const localVideoRef = useRef<HTMLVideoElement|null>(null)
const [cameras, setCameras] = useState<MediaDeviceInfo[]>([]);
const [microphones, setMicrophones] = useState<MediaDeviceInfo[]>([]);
const [connectedDevices, setConnectedDevices] = useState<'audio' | 'video' | ''>('');
const [isCamerEnabled,setIsCameraEnabled] = useState<boolean>(true)
const [isMicEnabled,setIsMicEnabled] = useState<boolean>(true)
const [connectedUsers,setConnectedUser] = useState<{name:string,id:string}[]>([])
const [peerConnections, setPeerConnections] = useState(new Map<string, RTCPeerConnection>());
// const [localStream,setLocalStream] = useState(new MediaStream())
const candidateQueue = new Map<string, RTCIceCandidate[]>();
const navigate = useNavigate()


useEffect(() => {
  socket.on('newUserConnected', async(data) => {
    const {message,userId,userName} = data
    console.log(message)
   await createConnectionAndSendOffer(userId,userName)
     toast.success(message);
  });
  
  socket.on('offer',async(data)=>{
   const {sender,offer,senderName} = data
   console.log(`offer recieved from ${senderName}`)
   const peerConnection  = await createPeerConnection(sender,senderName)
   if(peerConnection){
peerConnection.setRemoteDescription(new RTCSessionDescription(offer))
   const answer = await peerConnection.createAnswer()
   
   socket.emit('answer',{sender:_id,answer:answer,to:sender})
   }
   
  })

  socket.on('answer',async(data)=>{
    const {sender,answer} = data
    console.log(`answer receieved from ${sender}`)
     const peerConnection =  peerConnections.get(sender);
      if (peerConnection) {
        await peerConnection.setRemoteDescription(new RTCSessionDescription(answer));
        const queue = candidateQueue.get(sender);
        if (queue) {
            while (queue.length > 0) {
                const candidate = queue.shift();
                if (candidate) {
                    await peerConnection.addIceCandidate(candidate);
                }
            }
            candidateQueue.delete(sender);
        }
      }
  })

  socket.on('new-iceCandidate',async(data)=>{
    const {sender,iceCandidate} = data
    const peerConnection = peerConnections.get(sender)
    if(peerConnection){
        if (peerConnection.remoteDescription && peerConnection.remoteDescription.type) {
             peerConnection.addIceCandidate(new RTCIceCandidate(iceCandidate))
        }else{
             const queue = candidateQueue.get(sender);
            if (queue) {
                queue.push(new RTCIceCandidate(iceCandidate));
            }
        }
    }
  })

  return () => {
    socket.off("newUserConnected");
    socket.off('offer')
    socket.off('answer')
    socket.off('new-iceCandidate')
  };
}, []);


useEffect(() => {
  (async function () {
    const devices = await navigator.mediaDevices.enumerateDevices();
    const microphones = devices.filter((device) => device.kind === 'audioinput');
    setMicrophones(microphones);
    const cameras = devices.filter((device) => device.kind === 'videoinput');
    setCameras(cameras);
    
    const localstream = await navigator.mediaDevices.getUserMedia({
      audio: true,
      video: { deviceId: cameras[0].deviceId }
    });
  
    if(localVideoRef.current){
      localVideoRef.current.srcObject = localstream
    }
   
      
    
                                                                                                                                                                                                                                                                                                                                                                                                                                    
  })();
    
  
}, [_id]); 

 const createPeerConnection = async (userId: string,name:string): Promise<RTCPeerConnection> => {
    const configuration = { 'iceServers': [{ 'urls': 'stun:stun.l.google.com:19302' }] };
    const peerConnection = new RTCPeerConnection(configuration);
   console.log(`new peerConnection created for ${userId} `)
    peerConnections.set(userId, peerConnection);
    setPeerConnections(new Map(peerConnections));
     
    setConnectedUser((prevState)=>{
      return[
        ...prevState,
      {name:name,id:userId}
      ]
     })
      const localStream =   await navigator.mediaDevices.getUserMedia({
      audio: true,
      video: true
    });

    localStream.getTracks().forEach((track)=>{
      peerConnection.addTrack(track,localStream)
    })
    

    peerConnection.addEventListener('icecandidate',event=>{
      if(event.candidate){
        console.log('iceCandidate = ',event.candidate)
        socket.emit('iceCandidate',{iceCandidate:event.candidate,sender:userId,roomId})
      }
    })
      peerConnection.addEventListener('track', async (event) => {
      const [remoteStream] = event.streams;
      console.log('listening to remote media...', remoteStream);
      console.log('remoteUserId = ', userId);
      const videoElement = remoteVideoRefs.current.get(userId);
      if (videoElement) {
      console.log('videoElement exists listening to remote media...', remoteStream.getTracks());
      console.log('remoteUserId = ', userId);

        videoElement.srcObject = remoteStream; 
      }
    });
   
    candidateQueue.set(userId, []);
    return peerConnection;
  };
  
  const createConnectionAndSendOffer = async(userId:string,name:string)=>{
    const peerConnection = await createPeerConnection(userId,name)
    const offer = await peerConnection.createOffer()
    peerConnection.setLocalDescription(offer)
    socket.emit('offer',{sender:_id,to:userId,offer:offer,senderName:name})
  }

const openCamera=async (cameraId :string)=>{
  const constraints  ={
        'audio':true,
        'video':{
            'deviceId':cameraId
        }    
    }
           const localStream = await  navigator.mediaDevices.getUserMedia(constraints)
           if (localVideoref.current) {
        localVideoref.current.srcObject = localStream;
      }

      }
      
    const toggleCamera = () => {
    if (localStreamRef.current) {
      localStreamRef.current.getVideoTracks().forEach((track) => {
        track.enabled = !track.enabled;
      });
      setIsCameraEnabled((prev) => !prev);
    }
  };

  const toggleMicrophone = () => {
    if (localStreamRef.current) {
      localStreamRef.current.getAudioTracks().forEach((track) => {
        track.enabled = !track.enabled;
      });
      setIsMicEnabled((prev) => !prev);
    }
  };


const copyText =()=>{
    const textToCopy =  copyTextRef?.current?.value
    navigator.clipboard.writeText(textToCopy)
      .then(() => {
        toast.success('Text copied to clipboard!');
      })
      .catch((err) => {
        console.error('Failed to copy text: ', err);
      });
}
  return (
    <>
      <div className="absolute top-0 left-0 z-40 h-screen w-screen  bg-[rgb(34,33,33)] flex flex-col justify-center items-center">
        <div className="">
          <div className="bg-white h-[570px] w-[1050px] "> 
            {connectedUsers.length>0&&(
          <div className={`grid h-full ${connectedUsers.length>=3? 'grid-cols-3 grid-rows-2':`grid-cols-${connectedUsers.length}`}  gap-1 items-center justify-center `}>
           {connectedUsers.map((user) => (
  <video
    key={user.id}
    ref={(el) => {
      if (el) {
        remoteVideoRefs.current.set(user.id, el);
      }
    }}
    autoPlay
    playsInline
    className="h-full w-full object-cover bg-black"
  />
))}
            </div>)}
            <video ref={localVideoRef} autoPlay muted playsInline className={` bg-black object-cover ${connectedUsers.length>0?'absolute h-[200px] w-[250px] top-14 left-20 border-2 border-white ':'h-full  w-full '}`}/>
          
  

          </div>
        </div>
          
        <div className="relative w-full  py-2 flex justify-center items-center">
          <div className="relative flex space-x-3">
            {connectedDevices==='audio'&&microphones.length>0&&(
            <div className='absolute bottom-14 ml-5  text-white px-2 py-1 bg-gray-600'>
                {microphones.map((items)=>(
              <h3>{items.label}</h3>
            ))}
            </div>
            )}
            <div className="bg-black h-12 w-20 flex items-center justify-evenly px-2 rounded-full">
                {connectedDevices==='audio'&&microphones&&microphones.length>0?
            <ArrowDown className="text-white " onClick={()=>setConnectedDevices('')} />
            :
            <ArrowUp className="text-white " onClick={()=>setConnectedDevices('audio')} />
            }
              <FontAwesomeIcon className="text-white " onClick={toggleMicrophone} icon={isMicEnabled?faMicrophone:faMicrophoneLinesSlash} />
            </div>
            {connectedDevices==='video'&&cameras.length>0&&(
            <div className='absolute bottom-14  left-[85px]  text-white px-2 py-1 bg-gray-600'>
                {cameras.map((items)=>(
              <h3 onClick={()=>openCamera(items.deviceId)}>{items.label}</h3>
            ))}
            </div>
            )}
            <div className="bg-black h-12 w-20 flex  items-center justify-evenly px-2 rounded-full">
               {connectedDevices==='video'&&cameras&&cameras.length>0?
            <ArrowDown className="text-white " onClick={()=>setConnectedDevices('')} />
            :
            <ArrowUp className="text-white " onClick={()=>setConnectedDevices('video')} />
            }
              <FontAwesomeIcon
                className="text-white h-4"
                onClick={toggleCamera}
                icon={isCamerEnabled?faVideoCamera:faVideoSlash}
              />
            </div>
            <div className="bg-red-700 h-12 w-12 flex items-center justify-center rounded-full">
              <CallEnd className="text-white" style={{ fontSize: "30px" }} />
            </div>
            <div className="bg-black h-12 w-12 flex items-center justify-center rounded-full">
              <PresentToAll
                className="text-white"
                style={{ fontSize: "30px" }}
              />
            </div>
          </div>
          <div className='absolute right-32 items-center flex space-x-4'>
            <Users className='text-white ' style={{fontSize:'30px'}}/>
            <Chat className='text-white ' style={{fontSize:'30px'}} />
        </div>
        </div>
        
      </div>

       {modalToCpyTxt===true&&(
         <div className="absolute bottom-2 left-3 bg-gray-700 rounded-[8px] p-5 flex flex-col space-y-6  h-[280px] z-50 w-[400px]" style={{ margin: 0 }}>
        <div className='text-white flex justify-between items-center'>
        <h2 className='text-2xl font-semibold'>Your meeting's ready</h2>
        <Close className='text-white ' style={{fontSize:'30px'}} onClick={()=>setModalToCpyTxt(false)}/>
        </div>
        <div >
            <h1 className='text-gray-300 text-xl '>Share this meeting link with others that you want in this meeting</h1>
        </div>
        <div className='relative'>
        <input type="text"  className={`w-full h-14 text-gray-600 text-xl`} ref={copyTextRef} value={roomId} readOnly />
         <Copy className={`absolute 'text-gray-600 top-[14px] right-4`} onClick={()=>copyText()}     style={{fontSize:'28px'}}/>
        </div>
     </div>   
           )}
      {/* {reqMessage.trim().length>0&&(
        <div className='bg-gray-700'>
          <h2 className='text-white'>{reqMessage}</h2>
          <button className='bg-violet px-5 py-1'>Accept</button>
        </div>
      )} */}

    </>
  );
};

export default VideoCall;