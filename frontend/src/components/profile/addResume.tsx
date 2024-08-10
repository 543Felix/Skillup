import React,{ useState,useEffect,useRef,Dispatch,SetStateAction } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faEllipsisV } from '@fortawesome/free-solid-svg-icons';
import { faCircleXmark } from '@fortawesome/free-regular-svg-icons';
import Axiosinstance from '../../../utils/axios';
import { toast } from 'react-toastify';
import uploadImageToCloudinary from '../../../utils/cloudinary';
import { useSelector } from 'react-redux';
import { RootState } from '../../store/store';
import AxiosInstance from '../../../utils/axios';
import { useNavigate } from 'react-router-dom';


interface MyComponentProps {
    setLoader: Dispatch<SetStateAction<boolean>>;
  }


const AddResume:React.FC<MyComponentProps> = ({setLoader})=>{


    const [resumeModal,setResumeModal] = useState<boolean>(false)
    const [resumeUrl,setResumeUrl] = useState<string>('')
    const [pdfUrl, setPdfUrl] = useState<string>('');
const [file,setFile] = useState<File>()
const fileInputRef  = useRef<HTMLInputElement>(null)
const navigate = useNavigate()
const id = useSelector((state:RootState)=>{
    return state.developerRegisterData._id
})

useEffect(()=>{
 AxiosInstance.get(`/dev/resume/${id}`)
 .then((response)=>{
    if(response.data){
        setResumeUrl(response.data.resume)
    }
 })
},[id])

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

const uploadCertificates =(e:React.MouseEvent<HTMLButtonElement>)=>{
e.preventDefault()
console.log('uploadCertificateButton is clicked')
if(file){
    
    setLoader(true)
uploadImageToCloudinary(file)
.then((data)=>{
    Axiosinstance.patch(`/dev/uploadResume`,{url:data?.url,id})
    .then((res)=>{  
        if(res.status===200){
        setResumeUrl(data?.url)
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
    setFile(undefined)
    setResumeModal(false)
}

    return(
        <>
        {resumeModal===true&&(
            <div className="fixed top-0 left-0 z-10 w-full h-full flex justify-center items-center bg-black bg-opacity-65">
        <div className='bg-slate-800 px-10 py-5 h-auto w-[600px] rounded-[25px]'>
           <div className='flex justify-between  '>
            <h1 className='text-white font-semibold  text-2xl'>{resumeUrl.length>0?'Resume':'Upload Resume'}</h1>
            <FontAwesomeIcon icon={faCircleXmark} className='text-white h-7' onClick={closeModal}/>
           </div>
            <div>
            </div>
               
               {pdfUrl&&(
                <div className='flex flex-col space-y-2'>
                <iframe className='w-[300px] h-[250px]'  src={pdfUrl} ></iframe> 
                </div>
                 )}

                 

        <div className='flex justify-end pt-5'>
           <input type="file" ref={fileInputRef } hidden  onChange={handleFileChange} accept=".pdf" />
            <button className='text-violet mr-5' onClick={selectImage}>choose file</button>
            <button className='bg-violet text-white px-5 justify-center items-center p-1 rounded-[15px]' onClick={uploadCertificates}>upload</button>
            </div>
            
        </div>
        </div>
        )}
         <div className=' bg-slate-500 bg-opacity-[15%] shadow-lg shadow-black rounded-[10px] p-6'>
          <div className='flex justify-between'>
          <h1 className='text-white text-2xl font-semibold'>{typeof resumeUrl === 'string' && resumeUrl.trim().length > 0 ? 'Resume uploaded' : 'Upload Resume'}</h1>
          <div className='flex space-x-3 items-center'>
<button
  className='bg-violet text-white font-semibold px-5 py-1 rounded-lg'
  onClick={() => {
    if (typeof resumeUrl === 'string' && resumeUrl.trim().length === 0) {
      setResumeModal(true);
    }else{
        navigate('/dev/pdfView',{state:{url:resumeUrl}})
    }
  }}
>
  {typeof resumeUrl === 'string' && resumeUrl.trim().length > 0 ? 'View' : 'Upload'}
</button>          <FontAwesomeIcon icon={faEllipsisV} />
          </div>
          
          </div>
          
        </div>
        </>
        
    )
}

export default AddResume