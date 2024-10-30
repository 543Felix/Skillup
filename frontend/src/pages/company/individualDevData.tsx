import { useNavigate, useParams } from 'react-router-dom'
import {useState,useEffect} from 'react'

import { DeveloperData } from '../../../types/interface'
import AxiosInstance from '../../../utils/axios'

const  IndividualDevData  = ()=>{
      

    const {id} = useParams() 
    const [devData,setDevData] = useState<DeveloperData|undefined>()
    const navigate = useNavigate()
    useEffect(()=>{
     AxiosInstance.get(`/company/devProfile/?id=${id}`)
     .then((response)=>{
        const {_id,name,email,image,role,skills,certificates,description,phoneNo,workExperience,resume} = response.data.data
        console.log(response.data)
        setDevData({_id,name,email ,image,role,skills,certificates,description,phoneNo,workExperience,resume})
     })

    },[id])
     
    const showResume = (resume:string)=>{
        console.log('resume  = ',resume)
        navigate('/company/pdfView',{state:{url:resume}})
    }
     
    return(
       <div className=" p-10 flex flex-col w-full   space-y-4 text-white">
            <div className="flex relative flex-col justify-center items-center bg-[#1a1a1a]  shadow-custom-black py-7 rounded-[15px]">
                {devData?.resume&&(<button className="bg-violet px-5 py-1 rounded absolute right-4 top-3" onClick={()=>showResume(devData?.resume as string)}>View Resume</button>)}
            <img className="h-[150px] w-[150px]" src={devData?.image} alt="" />
             <h1 className="text-2xl font-semibold">{devData?.name}</h1>
             <span>{devData?.role}</span>
             <div className="flex space-x-3">
               <span>{devData?.email}</span>
                <span>{devData?.phoneNo}</span>
            </div>

            
            
            </div> 
            <div className="flex flex-col p-4 bg-[#1a1a1a]  shadow-custom-black space-y-1 rounded-[15px]">
                <label className=" text-2xl font-semibold" htmlFor="description">Description</label>
                {/* <textarea className="bg-transparent w-full h-24 px-2 rounded-xl " name="description" value={'The vast and ever-expanding universe, filled with countless stars, galaxies, and mysterious celestial bodies, continues to captivate the imagination of scientists, astronomers, and dreamers alike, as they strive to unravel the intricate complexities of space, time, and existence, delving deeper into the mysteries of black holes, dark matter, and the possibility of extraterrestrial life, all while considering the implications of their discoveries on our understanding of the cosmos, our place within it, and the potential future of humanity as we explore, evolve, and perhaps one day venture beyond the confines of our own solar system.'} readOnly id=""></textarea> */}
                <p className="text-lg font-extralight">{devData?.description}</p>
            </div>
            <div className="flex flex-col p-4 bg-[#1a1a1a]  shadow-custom-black space-y-1 rounded-[15px] ">
            <label className=" text-xl font-semibold" htmlFor="skills">Skills</label>
            <div className="flex flex-wrap">
                {devData && devData.skills && devData.skills.length > 0&&devData?.skills?.map((item,index)=>(
                <button key={index} className="border mr-2 mt-2 border-violet px-5 py-1 rounded ">{item}</button>
            ))}
            </div>
            </div>
            <div className="flex flex-col p-4 bg-[#1a1a1a]  shadow-custom-black space-y-1 rounded-[15px] ">
            <label className=" text-xl font-semibold" htmlFor="skills">Work Experience </label>
            </div>
            <div className="flex flex-col p-4 bg-[#1a1a1a]  shadow-custom-black space-y-1 rounded-[15px] ">
            <label className=" text-2xl font-semibold" htmlFor="skills">Certificates</label>
            {devData && devData.certificates && devData.certificates.length > 0&&devData?.certificates?.map((item,index)=>(
                    <div key={index} className='flex space-x-3 items-center space-y-2 '>
                    <h1 className='font-semibold text-lg'>{item.certificateName}</h1>
                    <button className='bg-violet px-5 py-1 text-white rounded-[8px]'>View</button>
                    </div>
                
            ))}
            </div>
                
               
       </div>
    )
}

export default IndividualDevData