import React, { useState,useRef, useEffect,Dispatch,SetStateAction } from 'react'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faCircleXmark,faTrashAlt } from '@fortawesome/free-regular-svg-icons'
import { faPlus } from '@fortawesome/free-solid-svg-icons'
import uploadImageToCloudinary  from '../../../utils/cloudinary'
import { toast } from 'react-toastify'
import { RootState } from '../../store/store'
import { useSelector } from 'react-redux'
import Axiosinstance from '../../../utils/axios'
import { useNavigate } from 'react-router-dom'
import AxiosInstance from '../../../utils/axios'

interface MyComponentProps {
    setLoader: Dispatch<SetStateAction<boolean>>;
  }

  interface Certificate {
    url:string;
    certificateName:string
  }


const Certificates:React.FC<MyComponentProps> = ({setLoader})=>{
    const id = useSelector((state:RootState)=>{
        return state?.developerRegisterData._id
     })    
const [card,setCard] = useState(false)
const [pdfUrl, setPdfUrl] = useState<string>('');
const [file,setFile] = useState<File>()
const fileInputRef  = useRef<HTMLInputElement>(null)
const [certificateName,setCertificateName] = useState<string>('')
const [certificate,setCertificate] = useState<Certificate[]>([])
const navigate = useNavigate()
useEffect(()=>{
    Axiosinstance.get(`/dev/profile?id=${id}`)
    .then((res)=>{
      if(res.data.data){
        const {certificates} = res.data.data 
        setCertificate(certificates)

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
if(file){
    if(certificateName.trim().length===0){
        toast.error('Certificate name cannot be empty')
        return 
    }else{
       setLoader(true)
uploadImageToCloudinary(file)
.then((data)=>{
    Axiosinstance.patch(`/dev/uploadCertificates`,{url:data?.url,id,certificateName})
    .then((res)=>{  
        if(res.status===200){
        setCertificate((prevState)=>{
          return[
            ...prevState,
            {url:data?.url,certificateName}
          ]
        }) 
        closeCard()
            toast.success('certificates uploaded successfully')
        }       
        
    }).catch(()=>{

    })
}).catch((error)=>{
    toast.error(error)
}).finally(()=>{
    setLoader(false)
   
})
    }

}else{
    toast.error('select certificates')
}

}
function closeCard(){
    setCard(false)
    setPdfUrl('')
    setFile(undefined)
    setCertificateName('')

}

const viewPdf = async(url:string)=>{
    navigate('/dev/pdfView',{state:{url:url}})
}
 
const DeleteCertificate = (url:string)=>{
setLoader(true)
AxiosInstance.patch('/dev/deleteCertificate',{id,url,resourcetype:'image'})
.then((res)=>{
     console.log('response after deleting certificate = ',res)
     if(res.status===200){
        setCertificate((prevState)=>{
            return prevState.filter((item)=>item.url!==url)
        })
        toast.success(res.data.message)
     }
}).catch((error)=>{
    toast.error(error)
}).finally(()=>{
    setLoader(false)
})
}


return(
    <>
      
    {card&&(
        <div className="fixed top-0 left-0 z-10 w-full h-full flex justify-center items-center bg-black bg-opacity-65">
        <div className='bg-slate-800 px-10 py-5 h-auto w-[600px] rounded-[25px]'>
           <div className='flex justify-between  '>
            <h1 className='text-white font-semibold  text-2xl'>Upload Certificate</h1>
            <FontAwesomeIcon icon={faCircleXmark} className='text-white h-7' onClick={closeCard}/>
           </div>
            <div>
            </div>
               
               {pdfUrl&&(
                <div className='flex flex-col space-y-2'>
                <iframe className='w-[300px] h-[250px]'  src={pdfUrl} ></iframe> 
                <input className='text-black placeholder:text-gray-700 w-2/3' placeholder='Enter certificate name' onChange={(e)=>setCertificateName(e.target.value)} type="text" />
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
    <div className=' mt-2 bg-slate-500 bg-opacity-[15%] shadow-lg shadow-black rounded-[10px] p-6 '>
          
            <div className='flex  justify-between items-center'>
                {certificate&&certificate.length>0
            ?
            <h1 className='text-white text-2xl  font-semibold'>Certificates</h1>
            :
             <h1 className='text-white text-2xl  font-semibold'> Add Certificates</h1>
              }
            <FontAwesomeIcon icon={faPlus} className='text-white  h-[30px]' onClick={()=>setCard(true)} />
            </div>
             
            
           
        
    {certificate.length>0&&(
   <div className='flex-co space-y-2 l p-5 pb-10 h-full'>
        {certificate&&certificate.map((item)=>(
                <div className='flex items-center space-x-3'>
              <h1 className='text-xl font-semibold'>{item.certificateName}</h1>
              <button className='bg-violet text-white px-5 py-1 rounded-lg' onClick={()=>viewPdf(item.url)}>view</button>
              <FontAwesomeIcon icon={faTrashAlt} onClick={()=>DeleteCertificate(item.url)} />
                </div>
        ))}
     </div>
    )}
      
    </div> 
    </>
    
)
} 

export default Certificates