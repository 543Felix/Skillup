import React,{useEffect, useState} from 'react'
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import { faPlus } from '@fortawesome/free-solid-svg-icons'
import { faCircleXmark,faEdit,faTrashAlt } from '@fortawesome/free-regular-svg-icons'
import { WorkData } from '../../../types/interface'
import AxiosInstance from '../../../utils/axios'
import { useSelector } from 'react-redux'
import { RootState } from '../../store/store'
import { toast } from 'react-toastify'


interface MyComponentProps {
  role:string
}

const WorkExpierience:React.FC<MyComponentProps> = ({role})=>{

   const id = useSelector((state:RootState)=>{
    return role==='dev'?state.developerRegisterData._id:state.companyRegisterData._id
   })
  
   const [workExpierience,setWorkExperience] = useState<WorkData[]>([])
    const [workModal,setWorkModal] = useState(false)
    const [workData,setWorkData] = useState<WorkData>({
        companyName:'',
        role:'',
        startDate:'',
        endDate:'',
    })
    const [submissionType,setSubmissionType] = useState<'Add'|'Update'>('Add')
     useEffect(()=>{
      AxiosInstance.get(`/dev/workExperience/${id}`)
      .then((res)=>{
           const {workExperience} = res.data
           setWorkExperience(workExperience)
      }).catch(()=>{
        toast.error('An unexpected error occured while fetching data')
      })
   },[id])
    const handleInputChange = (name:string,value:string)=>{
            setWorkData((prevData)=>{
               return{
                 ...prevData,
               [name]:value
               } 
            })
          }

    const postWorkExperience = ()=>{
        if(workData.companyName.trim().length===0){
            toast.error('Company name field cannot be empty')
        }else if(workData.role.trim().length===0){
            toast.error('Role field cannot be empty')
        }else if(workData.startDate.trim().length===0){
          toast.error('startDate cannot be empty')
        }else if(workData.endDate.trim().length===0){
          toast.error('endDate cannot be empty')
        }
        else{
          const type = submissionType==='Add'?'add':'update'
           AxiosInstance.post(`/dev/${type}WorkExperience`,{id,workData})
        .then((res)=>{
          if(res.status===200&&type==='add'){
            const newDate = new Date(workData.startDate)
             setWorkExperience((prevState)=>{
              const index = prevState.findIndex((item)=>new Date(item.startDate)<newDate)
              if(index>-1){
              return[...prevState.slice(0,index),workData,...prevState.slice(index)]
              }else{
                return[...prevState,workData]
              }
             })
          }else if(res.status===200&&type==='update'){
            setWorkExperience((prevState)=>{
              // const index =  prevState.findIndex((item)=>item._id===workData._id)
              // return[...prevState.slice(0,index),workData,...prevState.slice(index+1)]
              return prevState.map((item)=>{
                if(item._id===workData._id){
                  return workData
                }
                return item
              })
          })
          }
        }).catch(()=>{
          toast.error('Error occured while updating query')
        }).finally(()=>{
          setWorkData(()=>{
            return{
        companyName:'',
        role:'',
        startDate:'',
        endDate:'',
    }
          })
          setWorkModal(false)
        })
        setSubmissionType('Add')
        }
       
    }

    const deleteExperience = (workId:string)=>{
      AxiosInstance.patch(`/dev/deleteWorkExperience/${id}/${workId}`)
      .then((res)=>{
       if(res.status ===200){
        setWorkExperience((prevState)=>{
          return prevState.filter((item)=>item._id!==workId)
        })
       }
      })
      .finally(()=>{
        setWorkModal(false)
      })
    }

    const getCurrentYearMonth = (): string => {
    const now = new Date();
    const year = now.getFullYear();
    const month = String(now.getMonth() + 1).padStart(2, '0'); // Months are 0-based, so add 1
    return `${year}-${month}`;
  };

  const displayDate = (date: string): string => {
    if (!date) return '';
    if(date==='current') return date;
    const [year, month] = date.split('-');
    const dateObject = new Date(parseInt(year), parseInt(month) - 1);
    return dateObject.toLocaleString('default', { month: 'long', year: 'numeric' });
  };
  const editWorkExperience = (data:WorkData)=>{
    setSubmissionType('Update')
    setWorkData(data)
    setWorkModal(true)
  }
    return(
        <>
        <div className=' bg-slate-500 bg-opacity-[15%] shadow-lg shadow-black rounded-[10px] p-6'>
          <div className='flex justify-between'>
          <h1 className='text-white text-2xl font-semibold'>Work Experience</h1>
          <FontAwesomeIcon className="text-white h-[30px]" icon={faPlus} onClick={()=>setWorkModal(true)} />
          </div>

          {workExpierience.length>0&&(
            <div className='mt-2'>
             {
              workExpierience.map((item)=>(
              <div className='flex flex-col' key={item._id}>
                <div className='text-white flex space-x-3 items-center'>
                <h1 className='text-xl '>{item.role}</h1>
                  <FontAwesomeIcon className='text-[15px]' icon={faEdit}  onClick={()=>editWorkExperience(item)}/>
                  <FontAwesomeIcon className='text-[15px]' icon={faTrashAlt} onClick={()=>deleteExperience(item._id as string)} />
                </div>
                <div className='flex space-x-2 text-gray-400 text-sm font-light'>
                  <span>{item.companyName}</span>
                  <span>{`${displayDate(item.startDate)} - ${displayDate(item.endDate)}`}</span>
                </div>
              </div>
            ))
             }
            </div>
            
          )}


          
          
        </div>
        {workModal&&(
            <div className="fixed top-0 pt-0 left-0 z-30 w-full h-full flex justify-center items-center bg-black bg-opacity-75 ">
              <div className='h-auto   w-[700px] text-black bg-white p-8  rounded-[15px] '>
                <div className='flex items-center justify-between '>
                      <h1 className=' font-semibold text-2xl'>Work Experience</h1>
                <FontAwesomeIcon  className=" h-[30px]" icon={faCircleXmark} onClick={()=>setWorkModal(false)} />
                </div>
                      <div className='mt-2 flex flex-col space-y-3 '>
                        <div className='flex flex-col '>
                         <label className='font-semibold text-sm ' htmlFor="companyName">Company Name</label>
                        <input className='w-full h-12 p-2 rounded-[10px]' value={workData?.companyName} name='companyName' type="text" onChange={(e)=>handleInputChange('companyName',e.target.value)}/>
                        </div>
                        
                        <div className='flex flex-col '>
                          <label className='font-semibold text-sm ' htmlFor="role">Role</label>
                         <input className='w-full h-12 p-2 rounded-[10px]' value={workData?.role} name='role' type="text" onChange={(e)=>handleInputChange('role',e.target.value)} />
                        </div>
                        <div className='flex space-x-2'>
                           <div className='flex flex-col w-1/2 ' >
                          <label className='font-semibold text-sm ' htmlFor="startDate">Start Date </label>
                         <input className='w-full h-12 p-2 rounded-[10px]' value={workData?.startDate} name='startDate' type="month" onChange={(e)=>handleInputChange('startDate',e.target.value)} max={getCurrentYearMonth()} />
                        </div>
                        <div className='flex flex-col w-1/2 ' >
                        <div className='flex space-x-2 items-center'>
                          <label className='font-semibold text-sm ' htmlFor="endDate">End Date</label>
                          <span className='text-sm mb-1'>( if currently working select current )</span>
                        </div>
                          
                          <div className='relative '>
                         <input className='w-full h-12 p-2 rounded-[10px]' value={workData?.endDate} name='endDate' type="month" onChange={(e)=>handleInputChange('endDate',e.target.value)} max={getCurrentYearMonth()} />
                           <button className=' absolute right-[10%] mt-2 bg-black text-white px-5 py-1' onClick={()=>handleInputChange('endDate','current')}>Current</button>
                          </div>
                        </div>
                        </div>
                        
                      </div>
                      <div className='mt-2 flex justify-end'>
                      <button className='bg-violet text-white font-semibold px-5 py-1 rounded' onClick={postWorkExperience}>{submissionType}</button>
                      </div>
              </div>
            </div>
        )}
        </>
    )
}

export default WorkExpierience