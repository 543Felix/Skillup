import React, { useEffect, useState,Dispatch,SetStateAction } from 'react'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faPen } from '@fortawesome/free-solid-svg-icons'
import { faCircleXmark } from '@fortawesome/free-regular-svg-icons'
import Axiosinstance from '../../../utils/axios'
import { RootState } from '../../store/store'
import { useSelector } from 'react-redux'
import { toast } from 'react-toastify'

interface MyComponentProps {
  setLoader: Dispatch<SetStateAction<boolean>>;
}

const RoleAndDescription:React.FC<MyComponentProps> = ({setLoader})=>{
// const setLoader =data
const [roleAndDesCard,setRoleandDescCard] = useState(false)
const [devData,setDevData] = useState({
  role:'',
  description:''
})
const [data,setData] = useState({
  role:'',
  description:''
})
const [updatedData,setUpdatedData] = useState({
  role:'',
  description:''
})
const id = useSelector((state:RootState)=>{
  return state.developerRegisterData._id
})
useEffect(()=>{
  Axiosinstance.get(`/dev/profile?id=${id}`)
  .then((res)=>{
    if(res.data.data){
      const {role,description}= res.data.data
      console.log('role and describtion = ', {role,description})
      setDevData({role,description})
      setData({role,description})
    }
  })
},[id,updatedData])

function updateData(e :React.ChangeEvent<HTMLInputElement>){
  const {name,value} = e.target
  setData((prevData)=>({
    ...prevData,
    [name] : value,
  }))
}
const submitData =(e: React.MouseEvent<HTMLButtonElement, MouseEvent>)=>{
e.preventDefault()
if(data.role.trim().length ===0){
  toast.error('Role field cannot be empty')
  return
}
else if (data.description.length===0) {
  toast.error('Description cannot be empty');
  return;
}

Axiosinstance.post(`/dev/profileRoleandDescription?id=${id}`,{data})
.then((res)=>{
  setRoleandDescCard(false)
  setLoader(true)
  if(res.data.data){
    const {role,description} = res.data.data
    console.log('role and description = ',{role,description})
    setUpdatedData((prevState)=>{
    return{
      ...prevState,
      role,
      description
    }  
    })
    toast.success('role and description updated successfully')
  }
})
.catch((error)=>{
  toast.error(error.message)
})
.finally(()=>{
  setLoader(false)
})
}

return(
<>
{roleAndDesCard &&(
    <div className="fixed top-0 left-0 z-30 w-full h-full flex justify-center items-center bg-black bg-opacity-45">
        <div className='h-[350px] w-[550px] bg-[#1F2937] rounded-[25px] justify-center items-center p-5'>
        <div className="flex justify-end">
              
              <FontAwesomeIcon
                className="h-6 text-white"
                icon={faCircleXmark}
                onClick={() => setRoleandDescCard(false)}
              />
        </div>
        <div className='px-[100px]'>
        <h1 className="text-white text-xl font-semibold mb-2">Role</h1> 
        <input
  type="text"
  value={data.role}
  name="role"
  className="h-[45px] w-[280px] border border-gray-600 bg-transparent placeholder-text-white text-white focus:outline-none px-4 rounded-[12px]"
  onChange={updateData}
  required
  pattern="^[A-Za-z]+(?: [A-Za-z]+)+$"
  title="Please enter a valid role consisting of letters and spaces."
/>
        <h1 className="text-white text-xl font-semibold mt-2 mb-2">Description </h1>
        <input
  type="text"
  value={data.description}
  name="description"
  className="h-[45px] w-[280px] border border-gray-600 bg-transparent placeholder-text-white text-white focus:outline-none px-4 rounded-[12px]"
  onChange={updateData}
  required
  pattern="^[A-Za-z0-9,' .?!]+(?: [A-Za-z0-9,' .?!]+)+$"
  title="Please use only letters, numbers, spaces, and punctuation marks in the description."
/>
        <div className='flex flex-col mt-[50px]  '>
                 <button className='bg-violet self-end px-4 py-2 rounded-[25px]' onClick={submitData} >Save changes</button>
                </div>
        </div>
        

        </div>
    </div>
)}
<div className="col-start-2 bg-slate-500 bg-opacity-[15%] max-h-[300px] col-span-3 rounded-[15px] p-7  ml-2 shadow-xl shadow-black">
            <div className="flex justify-between items-center">
              <h1 className="text-2xl font-bold  text-white"><span className='font-semibold '>Role  :  </span>{devData.role}</h1>
              <div className="flex items-end" onClick={()=>setRoleandDescCard(true)}>
                <div className="border-2 rounded-full h-7 w-7 text-white border-white flex justify-center items-center">
                  <FontAwesomeIcon
                    className="flex items-center h-3  w-3"
                    icon={faPen}
                  />
                </div>
              </div>
            </div>
            <div className="">
              <span className=' text-xl font-semibold'> Description : </span>
              <p className='max-h-[165px] overflow-y-auto'> {devData.description}</p>
            </div>
</div>
</>
)

}

export default RoleAndDescription