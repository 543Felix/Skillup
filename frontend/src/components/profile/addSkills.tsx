import React,{useEffect, useState} from 'react'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faPlus,faXmark } from '@fortawesome/free-solid-svg-icons'
import { faCircleXmark } from '@fortawesome/free-regular-svg-icons'
import AxiosInstance from '../../../utils/axios'
import { useSelector } from 'react-redux'
import { RootState } from '../../store/store'
import { toast } from 'react-toastify'


interface MyComponentProps {
  // setLoader: Dispatch<SetStateAction<boolean>>;
  role:string
}


const AddSkill:React.FC<MyComponentProps> = ({role})=>{
  const [addSkillPage,setAddSkillPage] = useState(false)

  const id = useSelector((state:RootState)=>{
    return role==='dev'?state.developerRegisterData._id:state.companyRegisterData._id
  })
  const dataModel = role==='dev'?'Skills':role ==='company'?'Specialties':''
  const [skills,addSkills] = useState<string[]>([])
  const [skill,setSkill] = useState('')
  const [updateSkill,setupdateSkill] = useState<string[]>([])
  const [updatedSkill,setUpdateSkill] = useState<string[]>([])
  
  useEffect(()=>{
   AxiosInstance.get(`/${role}/profile?id=${id}`)
   .then((res)=>{
    if(res.data.data){
      const skill = role==='dev'?res.data.data.skills:role==='company'?res.data.data.specialties:''
      addSkills(skill)
      setupdateSkill(()=>{
        return[...skill]
      })
    }
   })
  },[id,updatedSkill,dataModel,role])

     function removeSkills(i:number){
      const arr = [...updateSkill]
      arr.splice(i,1)
      setupdateSkill([...arr])
     }
    
     function addnewSkills(value:string){
      if(value.trim().length === 0){
        toast.error(`cannot add empty string as a ${dataModel}` )
        return
      }
      if(!value.match(/^\s*[a-zA-Z0-9 ]+\s*(,\s*[a-zA-Z0-9 ]+\s*)*$/)){
        toast.error(`You can add ${dataModel} one by one or separated by commas without any special characters.`)
        return
      }else{
        const length = updateSkill.length
        const arr:string[] = value.split(',').filter((item)=>item.trim()!== ''&&!updateSkill.includes(item))  
        if(length>20){
          toast.error(`maximum ${dataModel} allowded is 20`)
          return
        }
        setupdateSkill([...updateSkill,...arr])
        setSkill('')
      }
      
     }

     function submitSkills(e: React.MouseEvent<HTMLButtonElement>){
      e.preventDefault()
        AxiosInstance.post(`/${role}/update${dataModel}?id=${id}`,{data:updateSkill})
      .then((res)=>{
        setUpdateSkill([...res.data.data])
        toast.success('skill updated in the profile')
        setAddSkillPage(false)
      })
      .catch((error)=>{
        toast.error(error.message)
      })
      
     }
    return(
        <>
        {addSkillPage&&(
<div className="fixed top-0 pt-0 left-0 z-30 w-full h-full flex justify-center items-center bg-black bg-opacity-45 ">
  <div className='h-[auto] w-[550px] bg-[#1F2937] rounded-[25px] justify-center items-center p-5 '>
  <div className="flex justify-between">
              <h1 className="text-white text-2xl font-semibold">Edit {dataModel}</h1>
              <FontAwesomeIcon
                className="h-6 text-white hover:text-violet"
                icon={faCircleXmark}
                onClick={() => setAddSkillPage(false)}
              />
  </div>
  <div className='my-10  bg-white
    h-[auto] w-[510px] p-4  rounded-[25px]'>
    <div className='flex text-violet w-[500px] flex-wrap' >
    {updateSkill.length>0 && updateSkill.map((item,index) => (
  <div
    key={index} // Assuming 'key' is unique for each item
    className='flex border-2 border-violet rounded-[15px] items-center justify-center px-2 py-1 mt-2 mr-2 transform hover:scale-105 transition-transform duration-300'
  >
    <button className='text-sm px-2'>{item}</button>
    <FontAwesomeIcon
      className="h-4 text-violet pr-2"
      icon={faXmark}
      onClick={()=>{removeSkills(index)}}
    />
  </div>
))}
    </div>
    <div className='relative'>
    <input type="text" value={skill} className='mt-3 w-[450px] h-10 rounded-[15px] border-2 focus:outline-none border-violet bg-transparent text-black pl-5 focus:ring-0 focus:border-violet' onChange={(e)=>setSkill(e.target.value)} pattern='^\s*[a-zA-Z0-9 ]+\s*(,\s*[a-zA-Z0-9 ]+\s*)*$' title='You can add skills one by one or separated by commas without any special characters.' />
    <button className='bg-violet px-3 absolute right-[29px] mt-[12px] h-[40px] rounded-r-[15px] items-center justify-center border border-violet' onClick={()=>addnewSkills(skill)}>Add +</button>
    </div>   
  </div>
  <div className='flex flex-col'>
  <button className='self-end bg-violet px-3 py-2 rounded-[25px]' onClick={submitSkills}>Save changes</button>
  </div>
  </div>
</div>

        )}
        <div className="row-start-2 bg-slate-500 bg-opacity-[15%] shadow-lg shadow-black rounded-[15px] p-7 mt-3 ">
          <div className="flex justify-between items-center">
            <h1 className="text-2xl text-white font-bold font-serif">{dataModel} :</h1>
            <div className="flex items-end" onClick={()=>setAddSkillPage(true)}>
              <div className="border-2 rounded-full h-7 w-7 text-white border-white  flex justify-center items-center">
                <FontAwesomeIcon
                  className="flex items-center h-3  w-3"
                  icon={faPlus}
                />
              </div>
            </div>
          </div>
          <div className='p-4'>
            {skills&&skills.map((item,index)=>(
              <button key={index} className='justify-center items-center bg-transparent border-2 border-violet text-white px-4 py-[6px]  mr-3 mb-3 rounded-[8px]'>{item}</button>
            ))}
            
          </div>
        </div>
        </>
    )
}

export default AddSkill