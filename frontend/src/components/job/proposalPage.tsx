import React,{ useState,useEffect,useRef,Dispatch,SetStateAction } from "react"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import { faCircleXmark } from "@fortawesome/free-regular-svg-icons"
import AxiosInstance from "../../../utils/axios"
import { useSelector } from "react-redux"
import { RootState } from "../../store/store"
import { toast } from "react-toastify"
import socket from "../../../utils/socket"
import uploadImageToCloudinary from "../../../utils/cloudinary"
import Loader from "../../pages/loader"

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
    const [resume,setResume] = useState<string>('')
    const [resumeAddModal,setResumeAddModal] = useState<boolean>(false)
    const fileInputRef  = useRef<HTMLInputElement>(null)
    const [pdfUrl, setPdfUrl] = useState<string>('');
    const [file,setFile] = useState<File|null>(null)
    const [loader,setLoader] = useState<boolean>(false)
    useEffect(()=>{
        AxiosInstance.get(`/dev/resume/${developerId}`)
        .then((response)=>{
            if(response.data){
                setResume(response.data.resume)
            }
        })
    },[developerId])
    const [coverLetter,setCoverLetter] = useState('')
    const selectImage = ()=>{
        fileInputRef.current!.click()
        
    }
    
      const handleFileChange = (e:React.ChangeEvent<HTMLInputElement>) => {
            const File = e.target.files && e.target.files[0];
            if(File){
            setPdfUrl(URL.createObjectURL(File))
             setFile(File)
            }
           
            
        };
    const sendProposal=()=>{
        if(coverLetter.length<100){
            toast.error('Ther should be at least 100 characters in the cover leter')
            return 
        }else if(resume.trim().length===0){
            toast.error('Resume field cannot be empty')
            return 
        }
     AxiosInstance.post(`/dev/sendProposal/${jobId}`,{coverLetter,developerId,score,resume})
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
     
    const uploadCertificates =(e:React.MouseEvent<HTMLButtonElement>)=>{
        e.preventDefault()
        console.log('uploadCertificateButton is clicked')
        if(file){
            
            setLoader(true)
        uploadImageToCloudinary(file)
        .then((data)=>{
            AxiosInstance.patch(`/dev/uploadResume`,{url:data?.url,id:developerId})
            .then((res)=>{  
                if(res.status===200){
                    setResume(data?.url)
                closeModal()
                    toast.success('resume uploaded successfully')
                }       
                
            }).catch(()=>{
        
            })
        }).catch((error)=>{
            toast.error(error)
        }).finally(()=>{
            setLoader(false)
           
        })
        
        }else{
            toast.error('select certificates')
        }
        
        }
        


    const closeModal = ()=>{
        setPdfUrl('')
        setFile(null)
        setResumeAddModal(false)

    }

return(
    <>
    
    {loader==true
    ?
  <Loader/>
  :
  <div className="h-screen w-screen absolute top-0 z-[9999] bottom-0 left-0 flex  justify-center items-center backdrop-blur-md">
  {resumeAddModal===true&&(
          <div className=" absolute h-auto w-[450px] bg-gray-700 p-3">
             <div className="flex justify-between">
              <h1 className="text-xl text-white font-semibold">Attach Resume </h1>
              <FontAwesomeIcon icon={faCircleXmark} className='text-white h-7' onClick={closeModal} />
              </div>
             {pdfUrl&&(
              <div className='flex flex-col space-y-2'>
              <iframe className='w-[300px] h-[250px]'  src={pdfUrl} ></iframe> 
              </div>
               )}

              <div className='flex justify-end pt-5'>
         <input type="file" ref={fileInputRef } hidden  onChange={handleFileChange} accept=".pdf" />
          <button className='bg-white text-violet px-5 py-1 rounded-[15px]  mr-5' onClick={selectImage}>choose file</button>
          <button className="text-white bg-violet px-5 py-1 rounded-[15px]" onClick={uploadCertificates}>Next</button>
          </div>
          </div>
  )}
      <div className="h-[500px] w-[600px] bg-black border-2 rounded-3xl shadow-custom-black pt-0 p-10 ">
        <div className="flex justify-between items-center my-4">
        <h1 className="text-white text-2xl font-bold my-4">Supmit a proposal</h1>
        <FontAwesomeIcon className="text-white h-7" icon={faCircleXmark} onClick={()=>hideProposalPage(false)}/>
        </div>
           <div className="flex flex-col border border-violet p-5 rounded-2xl " >
            <h1 className="text-white text-lg font-bold">Add Cover Letter</h1>
            <textarea name="" id="" rows={8} className=" my-5 resize-none rounded-md" onChange={(e)=>setCoverLetter(e.target.value)}></textarea>
            <div>
            <button className="text-white bg-violet px-5 py-1" onClick={()=>setResumeAddModal(true)}>{resume&&resume.length>0?'change Resume':'Add Resume'}</button>
            </div>
            <div className="flex justify-end">
            <button className="text-white bg-violet px-3 py-1 rounded-[5px]" onClick={sendProposal}>Send proposal</button> 
            </div>
           
           </div>
      </div>
     </div>
 }
    
   
    </>
    
)
}
export default ProposalPage