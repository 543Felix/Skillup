import React,{ useState,Dispatch,SetStateAction } from "react"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import { faCircleXmark } from "@fortawesome/free-regular-svg-icons"
import AxiosInstance from "../../../utils/axios"
import { useSelector } from "react-redux"
import { RootState } from "../../store/store"
import { toast } from "react-toastify"
import socket from "../../../utils/socket"


interface Props{
    jobId:string|undefined,
    hideProposalPage:Dispatch<SetStateAction<boolean>>;
    score?:number,
    displayJobComponent:()=>void
}

const ProposalPage:React.FC<Props> = ({jobId,hideProposalPage,score,displayJobComponent})=>{
    const developerId = useSelector((state:RootState)=>{
        return state.developerRegisterData._id
    })
    const [coverLetter,setCoverLetter] = useState('')
    const sendProposal=()=>{
        if(coverLetter.length<100){
            toast.error('Ther should be at least 100 characters in the cover leter')
            return 
        }
     AxiosInstance.post(`/job/sendProposal/${jobId}`,{coverLetter,developerId,score})
     .then((res)=>{
        if(res.data.Data){
            const {companyId,jobTitle} =res.data.Data[0]
            socket.emit("notification",{senderId:developerId,receiverId:companyId,content:`Applied for ${jobTitle}`})
            console.log('companyId = ',res.data.Data)
        }
        displayJobComponent()
        toast.success(res.data.message)
      })
      .catch((error)=>{
       toast.error(error.response.data.message)
      })
    }
return(
    <div className="h-screen w-screen absolute top-0 z-[9999] bottom-0 left-0 flex  justify-center items-center backdrop-blur-md">
        
      <div className="h-[500px] w-[600px] bg-black border-2 rounded-3xl shadow-custom-black pt-0 p-10 ">
        <div className="flex justify-between items-center my-4">
        <h1 className="text-white text-2xl font-bold my-4">Supmit a proposal</h1>
        <FontAwesomeIcon className="text-white h-7" icon={faCircleXmark} onClick={()=>hideProposalPage(false)}/>
        </div>
           <div className="flex flex-col border border-violet p-5 rounded-2xl " >
            <h1 className="text-white text-lg font-bold">Add Cover Letter</h1>
            <textarea name="" id="" rows={8} className=" my-5 resize-none rounded-md" onChange={(e)=>setCoverLetter(e.target.value)}></textarea>
            {/* <input type="file" ref={uploadRef}  hidden name="" id="" />   */}
            {/* <div>
            <button className="text-white border-2 border-violet px-3 ">Add Resume</button>  
            </div>  */}
           
            <div className="flex justify-end">
            <button className="text-white bg-violet px-3 py-1 rounded-[5px]" onClick={sendProposal}>Send proposal</button> 
            </div>
           
           </div>
      </div>
     </div>
)
}
export default ProposalPage