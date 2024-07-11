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

//   function useQuery() {
//   return new URLSearchParams(useLocation().search);
// }

interface Props{
  role:'dev'|'companies'
}

const VideoCall:React.FC<Props> = ({role}) => {
  const {roomId} = useParams()

//     const query = useQuery();
// const roomId = query.get('roomId');
// const id = query.get('id');
const {_id,name} = useSelector((state:RootState)=>{
   return role==='dev'?state.developerRegisterData:state.companyRegisterData
})
const copyTextRef = useRef(null);
// const [peerConnections,setPeerConnections] = useState(new Map())
const localVideoref = useRef<HTMLVideoElement | null>(null);
const remoteVideoref = useRef<HTMLVideoElement | null>(null);
const localStreamRef = useRef<MediaStream | null>(null);
const [disableCopyBttn, setDisableCopyBttn] = useState<boolean>(false);
const [modalToCpyTxt, setModalToCpyTxt] = useState<boolean>(true);
const [cameras, setCameras] = useState<MediaDeviceInfo[]>([]);
const [microphones, setMicrophones] = useState<MediaDeviceInfo[]>([]);
const [connectedDevices, setConnectedDevices] = useState<'audio' | 'video' | ''>('');
const [isCamerEnabled,setIsCameraEnabled] = useState<boolean>(true)
const [isMicEnabled,setIsMicEnabled] = useState<boolean>(true)

const configuration = { 'iceServers': [{ 'urls': 'stun:stun.l.google.com:19302' }] };
const peerConnection = new RTCPeerConnection(configuration);


useEffect(() => {
  socket.on('newUserConnected', (data) => {
    toast.success(data.message);
  });

  return () => {
    socket.off("newUserConnected");
  };
}, []);

useEffect(() => {
  socket.on('offer', async (offer) => {
    await peerConnection.setRemoteDescription(new RTCSessionDescription(offer));
    const answer = await peerConnection.createAnswer();
    await peerConnection.setLocalDescription(answer);
    console.log('offerReceived');
    socket.emit('answer', { roomId, answer });
  });

   socket.on("answer", async (answer) => {
    await peerConnection.setRemoteDescription(new RTCSessionDescription(answer));
  });
  
  socket.on('leftCall',(name)=>{
    remoteVideoref.current.srcObject  = null
    toast.success(`${name} left from the meeting`)
  })
 
//  socket.on()

  return () => {
    socket.off("offer");
    socket.off("answer");
    socket.off("leftCall")
  };
}, []); 
      

useEffect(() => {
  peerConnection.addEventListener('track', (event) => {
   
    const [remoteStream] = event.streams;
    if (remoteVideoref.current) {
      remoteVideoref.current.srcObject = remoteStream;
       
    }
    
  });
 


}, []);

useEffect(() => {
  (async function () {
    const devices = await navigator.mediaDevices.enumerateDevices();
    const microphones = devices.filter((device) => device.kind === 'audioinput');
    setMicrophones(microphones);
    const cameras = devices.filter((device) => device.kind === 'videoinput');
    setCameras(cameras);

    const localStream = await navigator.mediaDevices.getUserMedia({
      audio: true,
      video: { deviceId: cameras[0].deviceId }
    });

    localStreamRef.current = localStream;

    if (localVideoref.current) {
      localVideoref.current.srcObject = localStream;
    }

    localStream.getTracks().forEach(track => {
      peerConnection.addTrack(track, localStream);
    });

    const offer = await peerConnection.createOffer();
    await peerConnection.setLocalDescription(offer);
    socket.emit('offer', { roomId, offer });                                                                                                                                                                                                                                                                                                                                                                                                                                  
  })();
    
  
}, [_id]);

   
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
      setDisableCopyBttn(true)
}

const endCall = ()=>{
  console.log('end call button is Clicked')
  peerConnection.close()
   localStreamRef.current!.getTracks().forEach((track)=>{
    track.stop()
   })
   socket.emit('endCall',({roomId,name}))

}

  return (
    <>
      <div className="absolute top-0 left-0 z-40 h-screen w-screen  bg-[rgb(34,33,33)] flex flex-col justify-center items-center">
        <div className="">
          <div className="bg-black h-[570px] w-[1050px] ">
            {/* {
            peerConnections.size>0
            ? */}
          <div className="grid h-full grid-cols-2 p-16 gap-8 ">
             <video ref={remoteVideoref} autoPlay playsInline className="h-full col-start-1 w-full bg-white" />
              <video ref={localVideoref} autoPlay muted playsInline className="h-full bg-white col-start-2 w-full object-cover  "/>              
            </div>
              {/* :
            <video ref={localVideoref} autoPlay muted playsInline className="h-full bg-white col-start-2 w-full object-cover  "/>
            } */}
            
          
  

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
            <div className="bg-red-700 h-12 w-12 flex items-center justify-center rounded-full" onClick={endCall}>
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
            {/* <div className='h-12 bg-black'> */}
            <Users className='text-white ' style={{fontSize:'30px'}}/>
            <Chat className='text-white ' style={{fontSize:'30px'}} />
            {/* </div> */}
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
        <input type="text"  className={`w-full h-14 ${disableCopyBttn===false?'text-gray-600':'text-gray-400'} text-xl`} ref={copyTextRef} value={roomId} readOnly />
         <Copy className={`absolute ${disableCopyBttn===false?'text-gray-600':'text-gray-400'} top-[14px] right-4`} onClick={()=>disableCopyBttn===false?copyText():null}     style={{fontSize:'28px'}}/>
        </div>
     </div>   
           )}
      

    </>
  );
};

export default VideoCall;
