import React, { useEffect, useState,Dispatch,SetStateAction } from 'react'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faPenToSquare,faCircleXmark } from '@fortawesome/free-regular-svg-icons'
import { useSelector } from 'react-redux'
import { RootState } from '../../store/store'
import Axiosinstance from '../../../utils/axios'
import { toast } from 'react-toastify'

interface MyComponentProps {
  setLoader: Dispatch<SetStateAction<boolean>>;
}

const CompanyData :React.FC<MyComponentProps> =({setLoader})=>{
    const [editPage,setEditPage] = useState(false)
  const [data,setData] = useState({
    companyType:'',
    noOfEmployes:'',
    website:'',
    overview:''
  })
  const [formData,setFormData] = useState({
    companyType:'',
    noOfEmployes:'',
    website:'',
    overview:''
  })
  const [updatedData,setUpdatedData] = useState({
    companyType:'',
    noOfEmployes:'',
    website:'',
    overview:''
  })

    const id = useSelector((state:RootState)=>{
       return state?.companyRegisterData._id
    })
    
    useEffect(()=>{
        Axiosinstance.get(`/company/profile?id=${id}`)
        .then((res)=>{
          if(res.data.data){
            console.log('data =',res.data.data)
            const {companyType,noOfEmployes,website,overview} = res.data.data
            setData({companyType,noOfEmployes,website,overview})
            setFormData({companyType,noOfEmployes,website,overview})
          }
        })
    },[id,updatedData])
    
    function updateData(e :React.ChangeEvent<HTMLInputElement>|React.ChangeEvent<HTMLTextAreaElement>|React.ChangeEvent<HTMLSelectElement>){
        const {name,value} = e.target
        setFormData((prevData)=>({
          ...prevData,
          [name] : value,
        }))
      }

   

    function submitData(e){
        e.preventDefault()
        setLoader(true)
        const {noOfEmployes,website,overview} = formData
        if(noOfEmployes.length ===0){
          toast.error('Company size cannot be empty')
          return
        }
        if (!noOfEmployes.match(/^\d{1,4}(?:-\d{1,4})?|^\d+k(?:-\d+k)?$/)) {
            toast.error('Either use a number or range; if it has more than 4 digits, use "k"');
            return;
        }
        
        if (website.length > 0 && !website.match(/^(https?:\/\/)?(www\.)?([a-zA-Z0-9-]+\.){1,}[a-zA-Z]{2,}(\.[a-zA-Z]{2,})?\/?([^\s]*)$/)) {
            toast.error('Invalid URL syntax');
            return;
        }
        
        if (overview.length > 0 && !overview.match(/^[\w\s.,'’+—-]+$/)) {
            toast.error('Invalid overview format');
            return;
        }
        
        Axiosinstance.post(`/company/updateAbout?id=${id}`,{formData})
        .then((res)=>{
            if(res.data.data){
                setEditPage(false)
                const {companyType,noOfEmployes,website,overview} = res.data.data
                setUpdatedData((state)=>{
                  return{
                    ...state,
                    companyType,noOfEmployes,website,overview
                  }

                })

                console.log('resData = ',res.data.data)
            }
        }).catch((err)=>{
            console.log('err = ',err)
            toast.error('hh')
        })
        .finally(()=>{
            setLoader(false)
        })

    }
    return(
        <>
        {editPage&&(
            <div className="fixed top-0 left-0 z-10 w-full h-full flex justify-center items-center bg-black bg-opacity-65">
                <div className='bg-slate-800 p-[70px] rounded-[25px]'>
                <div className='relative  flex flex-col'>
  <FontAwesomeIcon icon={faCircleXmark} className='absolute text-white top-0 right-0 h-8' onClick={()=>setEditPage(false)} />
  <div className='flex flex-row justify-between'>
    <div className='flex flex-col mr-6'>
      <label className='text-white text-sm font-light '>Company type :</label>
      {/* <input value={formData.companyType} type="text" name='companyType' className='mt-1 bg-transparent text-white text-lg border py-1 px-2 rounded-[8px]  border-white focus:outline-none' placeholder="Product based" onChange={updateData} /> */}
      <select
      value={formData.companyType}
      onChange={(e)=>updateData(e)}
      name='companyType'
      className='mt-1 bg-transparent text-white text-lg border py-1 px-2 rounded-[8px] w-[240px] border-white focus:outline-none focus:ring-0 focus:border-white'
    >
      <option value="service" className="bg-transparent text-white hover:bg-black">Service Based</option>
      <option value="product"  className="bg-transparent text-white">Product Based</option>
    </select>
    </div>
    <div className='flex flex-col mr-[180px] '> {/* Adjust the margin as needed */}
      <label className='text-white text-sm font-light'>Company size :</label>
      <input value={formData.noOfEmployes} type="text" name='noOfEmployes' className='mt-1 bg-transparent text-white text-lg border rounded-[8px] border-white py-1 px-2 focus:outline-none focus:ring-0 focus:border-white'  placeholder="Company Size" onChange={(e)=>updateData(e)} required pattern='^\d{0,4}(?:-\d{1,4}|k\d{1,4}|k)?$' title='' />
    </div>
  </div>

  <label className='text-white text-sm font-light mt-2'>Website url :</label>
  <input value={formData.website} type="url" name='website' className='mt-1 bg-transparent text-white text-lg border rounded-[8px] border-white py-1 px-2 focus:outline-none focus:ring-0 focus:border-white' placeholder="Website URL" onChange={(e)=>updateData(e)}  />
  <label className='text-white text-sm font-light mt-2'>Overview :</label>
  <textarea value={formData.overview} name='overview' className='mt-1 text-white text-lg  py-1 px-2 font-semibold rounded-[8px] bg-transparent border h-[100px] focus:outline-none border-white resize-none focus:ring-0 focus:border-white'  placeholder="Overview" onChange={(e)=>updateData(e)} ></textarea>
                </div>
                <div className='flex justify-end'>
                <button className='bg-violet text-white px-2 py-1 rounded-[25px] mt-5' onClick={(e)=>submitData(e)}>Save changes</button>
                </div>
                </div>
              
            </div>
        )}
        <div className='col-start-2 col-span-3 ml-2 bg-slate-500 bg-opacity-[15%] shadow-lg shadow-black rounded-[10px] py-5 px-12 z-0'> 
        <div className='relative  flex flex-col'>
           <FontAwesomeIcon icon={faPenToSquare} className='absolute text-white top-0 right-0' onClick={()=>setEditPage(true)} />
        <div className='flex flex-row justify-between'>
    <div className='flex flex-col mr-6'>
      <label className='text-white text-sm font-light '>Company type :</label>
      <input defaultValue={data.companyType} type="text" className='mt-1 bg-transparent text-white text-lg border py-1 px-2 rounded-[8px] focus:border-white focus:ring-0 border-white focus:outline-none' placeholder="Product based" readOnly />
    </div>
    <div className='flex flex-col mr-[180px] '> {/* Adjust the margin as needed */}
      <label className='text-white text-sm font-light'>Number of employes :</label>
      <input defaultValue={data.noOfEmployes} type="text" className='mt-1 bg-transparent text-white text-lg border rounded-[8px] focus:border-white focus:ring-0 border-white py-1 px-2 focus:outline-none'  placeholder="Company Size" readOnly/>
    </div>
  </div>

  <label className='text-white text-sm font-light mt-2'>Website url :</label>
  <input defaultValue={data.website} type="url" className='mt-1 bg-transparent text-white text-lg border rounded-[8px] border-white focus:border-white focus:ring-0 py-1 px-2 focus:outline-none' placeholder="Website URL" readOnly />
  <label className='text-white text-sm font-light mt-2'>Overview :</label>
  <textarea defaultValue={data.overview} className='mt-1 text-white text-base  py-1 px-2 rounded-[8px] bg-transparent border h-[100px] focus:outline-none border-white focus:border-white focus:ring-0 resize-none'  placeholder="Overview" readOnly></textarea>
       </div>


        </div>
        
        </>
        
    )
}

export default CompanyData