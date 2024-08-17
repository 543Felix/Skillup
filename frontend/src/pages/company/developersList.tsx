import {useEffect, useState} from 'react'
import AxiosInstance from '../../../utils/axios'
import { useNavigate } from 'react-router-dom';
import IndividualChats from '../../components/chat/individualChat';
import { useSelector } from 'react-redux';
import { RootState } from '../../store/store';

interface developers{
    _id:string;
    name:string;
    image:string;
    role:string;
}

const DeveloperListsCard =()=>{
    
 const [developers,setDevelopers] = useState<developers[]>([])
 const [showIndiChat,setShowIndiChat] =  useState<boolean>(false)
 const senderId = useSelector((state:RootState)=>{
  return state.companyRegisterData._id
 })
 const [receiverId,setReceiverId] = useState<string>('')
 const [profileImg,setProfileImg] = useState<string>('')
const [name,setName] = useState<string>('')
const navigate = useNavigate()
  const showDevProfile = (id:string)=>{
      navigate(`/company/developers/${id}`)
  }

const startIndividualChat = (e:React.MouseEvent<HTMLButtonElement>,id :string,name:string,image:string)=>{
  e.stopPropagation()
  setReceiverId(id)
  setProfileImg(image)
  setName(name)
  setShowIndiChat(true)
}



  useEffect(()=>{
    AxiosInstance.get('/company/allDevelopers')
    .then((res)=>{
        console.log(res.data)
        setDevelopers(res.data)
    }).catch((error)=>{
        console.log('error = ',error)
    })
  },[])

   return(
    <>
      {showIndiChat === false ? (
      <>
     <div className="w-screen flex flex-wrap justify-center items-center">
       {developers.length > 0 && developers.map((data) => (
  <div key={data._id} className="bg-transparent mt-3 mr-3 text-white shadow-custom-black h-auto w-[280px] p-8 rounded-2xl" onClick={()=>showDevProfile(data._id)}>
    <div className="flex flex-col space-y-4 p-3 items-center">
      <img className="h-[110px] w-[110px] rounded-full" src={data.image} alt={data.name} />
      <div className="flex flex-col space-y-1 items-center">
        <h1 className="text-2xl font-semibold">{data.name}</h1>
        <span className="text-sm">{data.role}</span>
      </div>
      <div>
        <button className="bg-violet px-5 py-1 rounded text-xl text-white font-semibold" onClick={(e)=>startIndividualChat(e,data._id,data.name,data.image)}>Message</button>
      </div>
    </div>
  </div>
))}   
    </div>
    </>
  ) : (
    <div className="absolute z-50 h-screen w-screen top-0 bottom-0 left-0 right-0">
      <IndividualChats
        role={'companies'}
        senderId={senderId}
        senderModel={'companies'}
        receiverModel={'developers'}
        receiverId={receiverId}
        profileImg={profileImg}
        name={name}
        closeChat={setShowIndiChat}
      />
    </div>
  )}    
    </>
  
   )
}
export default DeveloperListsCard