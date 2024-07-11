import React, { useState,useRef, useEffect,Dispatch,SetStateAction } from 'react'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faCircleXmark,faImages } from '@fortawesome/free-regular-svg-icons'
import { faPlus } from '@fortawesome/free-solid-svg-icons'
import { uploadMultipleImagesToCloudinary } from '../../../utils/cloudinary'
import { toast } from 'react-toastify'
import { RootState } from '../../store/store'
import { useSelector } from 'react-redux'
import Axiosinstance from '../../../utils/axios'


interface MyComponentProps {
    setLoader: Dispatch<SetStateAction<boolean>>;
  }



const Certificates:React.FC<MyComponentProps> = ({setLoader})=>{
    const id = useSelector((state:RootState)=>{
        return state?.companyRegisterData._id
     })    
const [card,setCard] = useState(false)
const [images, setImages] = useState<string[]>(new Array(4).fill(undefined));
const fileInputRef  = useRef(null)
const [certificate,setCertificate] = useState([])
const [updatedCertificate,setUpdatedCertificate] = useState([])
useEffect(()=>{
    Axiosinstance.get(`/company/profile?id=${id}`)
    .then((res)=>{
      if(res.data.data){
        const {certificates} = res.data.data 
        setCertificate(certificates)
        setImages(()=>{
            return [...certificates]
        })
      }
    })
},[id,updatedCertificate])
const selectImage = ()=>{
    fileInputRef.current.click()
    
}
    const handleFileChange = (e) => {
        const files = Array.from(e.target.files);
        const newFiles = files.map((file)=>{
            return URL.createObjectURL(file)
        })
        const selectedFiles = newFiles.length>0?newFiles.slice(0, 4):newFiles.slice(0,newFiles.length)
        if(selectedFiles.length ===4){
            setImages(()=>{
                return[
                    ...selectedFiles
                ]
            });
        }else{
            setImages((prev)=>{
                return[
                    ...prev,...selectedFiles
                ]
            });
        }
        
        console.log('images = ',images)
    };

const uploadCertificates =(e:React.MouseEvent<HTMLButtonElement>)=>{
e.preventDefault()
setLoader(true)
uploadMultipleImagesToCloudinary(images)
.then((data)=>{
    console.log('res = ',{data})
    Axiosinstance.post(`/company/uploadCertificates?id=${id}`,{data})
    .then((res)=>{         
       setCard(false)
        setUpdatedCertificate(res) 
    toast.success('certificates uploaded successfully')
    })

}).catch((error)=>{
    toast.error(error)
}).finally(()=>{
    setLoader(false)
   
})
}
function closeCard(e){
    e.preventDefault()
    setCard(false)
    setImages(()=>{
        return[...certificate]
    })
}
 
return(
    <>
    {card&&(
        <div className="fixed top-0 left-0 z-10 w-full h-full flex justify-center items-center bg-black bg-opacity-65">
        <div className='bg-slate-800 px-10 py-5 h-[300px] w-[600px] rounded-[25px]'>
           <div className='flex justify-between  '>
            <h1 className='text-white text-xl'>update certificates</h1>
            <FontAwesomeIcon icon={faCircleXmark} className='text-white h-7' onClick={(e)=>closeCard(e)}/>
           </div>
            <div>
            </div>
            <div className='grid h-[100px] grid-cols-4 m-5'>
            {images.length > 0 ? images.map((image, index) => (
    <div className={`col-start-${index + 1} bg-white mr-2`} key={index}>
       
       {typeof image === 'string' ? (
                        <img
                            src={image}
                            alt={`Image ${index}`}
                            className=" h-[100px]"
                            key={`image-${index}`}
                        />
                    )  :image === 'undefined'?<div className='h-[100px] bg-white'>
                       <h1>image</h1>
                    </div>:null}

    </div>
)) :<div className='col-start-2 col-span-2'>
                <FontAwesomeIcon icon={faImages} className='text-white h-28'/>
            </div>}
                  
            </div>
           
        <div className='flex justify-end pt-5'>
           <input type="file" ref={fileInputRef } hidden multiple onChange={handleFileChange} accept=".png, .jpg, .jpeg" />
            <button className='text-violet mr-5' onClick={selectImage}>choose file</button>
            <button className='bg-violet text-white px-5 justify-center items-center p-1 rounded-[15px]' onClick={uploadCertificates}>upload</button>
            </div>
            
        </div>
        </div>
    )}
    <div className='row-start-3 mt-2 bg-slate-500 bg-opacity-[15%] shadow-lg shadow-black rounded-[10px] py-5 px-10'>
        <div className='relative'>
        <h1 className='text-white text-2xl  font-semibold'>Certificates</h1>
        <FontAwesomeIcon icon={faPlus} className='text-white absolute top-0 right-5 h-[30px]' onClick={()=>setCard(true)} />
        </div>
    
     <div className='grid - grid-cols-4 p-5 pb-10 h-full'>
        {certificate?certificate.map((item,index)=>(
            <img key={index} src={item} className={`col-start-${index+1} text-black mr-3`} alt="" />
        )): <h1 className='text-gray-300'>No certificates added</h1>}
       
     </div>
    </div> 
    </>
    
)
} 

export default Certificates