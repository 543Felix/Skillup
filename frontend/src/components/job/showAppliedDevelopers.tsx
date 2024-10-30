 import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
 import { faCircleXmark } from "@fortawesome/free-regular-svg-icons"
import React,{ useEffect, useState } from "react"
import AxiosInstance from "../../../utils/axios"
import { toast } from "react-toastify"
import IndividualChats from "../chat/individualChat"
import { useSelector } from "react-redux"
import { RootState } from "../../store/store"
import socket from "../../../utils/socket"
import { AppliedDevs } from "../../../types/interface" 
import { useNavigate } from "react-router-dom"



interface Props{
    jobId:string,
    jobName:string
    hidePage:()=>void
}




const AppliedDevelopers:React.FC<Props> = ({jobId,jobName,hidePage})=>{
   const [data,setData] = useState<AppliedDevs[]>([])
   const [receiverId,setReceiverId] = useState<string>('')
   const [profileImg,setProfileImg] = useState<string|undefined>('')
   const [name,setName] = useState<string>('')
   const [selectedStatus,setSelectedStatus] = useState<string>('')
   const [showIndiChat,setShowIndiChat] =  useState<boolean>(false)
   const [proposalModal,showProposalModal] = useState<boolean>(false)
   const [coverLetter,setCoverLetter] = useState<string>('')
   const navigate = useNavigate()
    const senderId = useSelector((state:RootState)=>{
        return state.companyRegisterData._id
      })
   const status =['rejected','selected','shortListed']
    useEffect(()=>{
      AxiosInstance.get(`/company/appliedDevelopers/${jobId}`)
      .then((res)=>{
        console.log('data = ',res.data.data)
         setData(res.data.data)
      })
      .catch((error)=>{
          console.log('error = ',error)
      })
    },[jobId])
      
    
  
    const updateJobStatus = (status: string, devId: string | undefined) => {
      console.log('devId = ',devId)
  if (devId) {
    AxiosInstance.patch(`/company/changeProposalStatus/${jobId}`, { status, devId })
      .then((res) => {
        const copyOfData = [...data];
        const updatedData = copyOfData.map((item) => {
          if (item.developerId === devId) {
            return {
              ...item,
              status: status
            };
          }
          return item;
        });
        setData(updatedData);
        socket.emit('notification',{senderId,receiverId:devId,content:`your job proposal for ${jobName} got ${status} `})
        toast.success(res.data.message);
      })
      .catch((error) => {
        toast.error(error.response.data.message);
      });
  } else {
    console.log('Developer ID is undefined');
  }
};

 const handleChange = (event:React.ChangeEvent<HTMLSelectElement>,id:string) => {
    const newStatus = event.target.value;
    setSelectedStatus(newStatus);
    updateJobStatus(newStatus, id);
  };

const SendMessage=(id:string,name:string,image:string)=>{
setReceiverId(id)
setProfileImg(image)
setName(name)
setShowIndiChat(true)
}

 
const showCoveLetter = (coverLetter:string)=>{
  setCoverLetter(coverLetter)
  showProposalModal(true)
}


const showResume = (url:string)=>{
  navigate('/company/pdfView',{state:{url:url}})
}


return (
  <>
    {showIndiChat === false ? (
      <>
        {proposalModal&&coverLetter.length>0&& (
          <div className="h-screen fixed w-screen top-0 z-[9999] bottom-0 left-0 flex justify-center items-center backdrop-blur-md">
            <div className="h-auto w-[600px] bg-black border-2 rounded-3xl shadow-custom-black pt-0 p-10">
              <div className="flex justify-end items-center my-4">
                <FontAwesomeIcon
                  className="text-white h-7"
                  icon={faCircleXmark}
                  onClick={() => showProposalModal(false)}
                />
              </div>
              <div className="flex flex-col border border-violet p-5 rounded-2xl">
                <h1 className="text-white text-lg font-bold">Cover Letter</h1>
                <textarea
                  name=""
                  id=""
                  rows={10}
                  value={coverLetter}
                  className="my-5 resize-none rounded-md"
                ></textarea>
                <div className="flex justify-end"></div>
              </div>
            </div>
          </div>
        )}
        <div className="w-screen px-4">
        <div className="col-span-12 w-full">
          <div className="grid gap-2 grid-cols-1 lg:grid-cols-1">
            <div className="bg-black p-4 shadow-lg rounded-lg">
              <div className="flex justify-between">
                <h1 className="font-bold text-white text-xl">
                  Applied Developers
                </h1>
                <FontAwesomeIcon
                  className="text-white h-7"
                  icon={faCircleXmark}
                  onClick={hidePage}
                />
              </div>

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
                                    <span className="mr-2">Applied Date</span>
                                  </div>
                                </th>
                                <th className="px-6 py-3 bg-black text-xs leading-4 font-medium text-gray-500 uppercase tracking-wider">
                                  <div className="flex cursor-pointer">
                                    <span className="mr-2">NAME</span>
                                  </div>
                                </th>
                                <th className="px-6 py-3 bg-black text-xs leading-4 font-medium text-gray-500 uppercase tracking-wider">
                                  <div className="flex cursor-pointer">
                                    <span className="mr-2">Email</span>
                                  </div>
                                </th>
                                <th className="px-6 py-3 bg-black text-xs leading-4 font-medium text-gray-500 uppercase tracking-wider">
                                  <div className="flex cursor-pointer">
                                    <span className="mr-2">Cover Letter</span>
                                  </div>
                                </th>
                                <th className="px-6 py-3 bg-black text-xs leading-4 font-medium text-gray-500 uppercase tracking-wider">
                                  <div className="flex cursor-pointer">
                                    <span className="mr-2">Cover Letter</span>
                                  </div>
                                </th>
                                <th className="px-6 py-3 bg-black text-xs leading-4 font-medium text-gray-500 uppercase tracking-wider">
                                  <div className="flex cursor-pointer">
                                    <span className="mr-2">STATUS</span>
                                  </div>
                                </th>
                                <th className="px-6 py-3 bg-black text-xs leading-4 font-medium text-gray-500 uppercase tracking-wider">
                                  <div className="flex cursor-pointer">
                                    <span className="mr-2">ACTION</span>
                                  </div>
                                </th>
                                <th className="px-6 py-3 bg-black text-xs leading-4 font-medium text-gray-500 uppercase tracking-wider">
                                  <div className="flex cursor-pointer">
                                    <span className="mr-2"></span>
                                  </div>
                                </th>
                              </tr>
                            </thead>
                            <tbody className="bg-black">
                              {data.map((item,index) => (
                                <tr key={item.developerId}>
                                  <td className="px-6 py-4 text-white whitespace-no-wrap text-sm leading-5">
                                    <p>{index+1}</p>
                                  </td>
                                  <td className="px-6 py-4 text-white whitespace-no-wrap text-sm leading-5">
                                    <p>{new Date(item?.createdAt).toISOString().split('T')[0]}</p>
                                  </td>
                                  <td className="px-6 py-4 text-white whitespace-no-wrap text-sm leading-5">
                                    <p>{item?.name}</p>
                                  </td>
                                  <td className="px-6 py-4 text-white whitespace-no-wrap text-sm leading-5">
                                    <p>{item?.email}</p>
                                  </td>
                                  <td className="px-6 py-4 text-white whitespace-no-wrap text-sm leading-5">
                                    <p onClick={()=>showCoveLetter(item?.coverLetter)}>View Cover Letter</p>
                                  </td>
                                  <td className="px-6 py-4 text-white whitespace-no-wrap text-sm leading-5">
                                    <p onClick={()=>showResume(item.resume)}>View Resume</p>
                                  </td>
                                  <td className="px-6 py-4 whitespace-no-wrap text-sm leading-5">
                                    <div
                                      className={`${
                                        item.status === 'selected'
                                          ? 'text-green-500'
                                          : item.status === 'rejected'
                                          ? 'text-red-500'
                                          : 'text-orange'
                                      }`}
                                    >
                                      <p>{item.status}</p>
                                    </div>
                                  </td>
                                  <td className="px-6 py-4 flex justify-center items-center whitespace-no-wrap text-sm leading-5">
                                    <select
                                      className="text-white items-center bg-black"
                                      name="status"
                                      value={selectedStatus}
                                      id=""
                                      onChange={(e) =>
                                        handleChange(e, item.developerId)
                                      }
                                    >
                                      {status.length > 0 &&
                                        status.map((option, index) => (
                                          <option
                                            key={index}
                                            value={option}
                                            onClick={() =>
                                              updateJobStatus(
                                                option,
                                                item.developerId
                                              )
                                            }
                                          >
                                            {option}
                                          </option>
                                        ))}
                                    </select>
                                  </td>
                                  <td>
                                    <button
                                      className="bg-violet px-4 py-1 text-white rounded-[5px] font-semibold"
                                      onClick={() =>
                                        SendMessage(item.developerId,item.name,item.image)
                                      }
                                    >
                                      Message
                                    </button>
                                  </td>
                                </tr>
                              ))}
                            </tbody>
                          </table>
                        ) : (
                          <div className="flex justify-center text-white text-3xl font-semibold py-5">
                            <h1>No one applied for the job</h1>
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
);

}

export default AppliedDevelopers