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
const [roleAndDesCard,setRoleandDescCard] = useState(false)
const [devData,setDevData] = useState({
  role:'',
  description:'',
  qualification:''
})
const [data,setData] = useState({
  role:'',
  description:'',
  qualification:''
})
// const [updatedData,setUpdatedData] = useState({
//   role:'',
//   description:'',
//   qualification:''
// })
const id = useSelector((state:RootState)=>{
  return state.developerRegisterData._id
})
useEffect(()=>{
  Axiosinstance.get(`/dev/profile?id=${id}`)
  .then((res)=>{
    if(res.data.data){
      const {role,description,qualification}= res.data.data
      setDevData({role,description,qualification})
      setData({role,description,qualification})
    }
  })
},[id])

function updateData(e :React.ChangeEvent<HTMLTextAreaElement>|React.ChangeEvent<HTMLInputElement>|React.ChangeEvent<HTMLSelectElement>){
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
else if (data.description.trim().length===0) {
  toast.error('Description cannot be empty');
  return;
}


Axiosinstance.post(`/dev/profileRoleandDescription?id=${id}`,{data})
.then((res)=>{
  setRoleandDescCard(false)
  setLoader(true)
  if(res.status===200){
    setDevData(()=>{
      return data
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
        <div className='h-auto w-[550px] bg-white rounded-[25px] p-8'>
        <div className="flex justify-end">
              
              <FontAwesomeIcon
                className="h-6 text-black"
                icon={faCircleXmark}
                onClick={() => setRoleandDescCard(false)}
              />
        </div>
        <div className='flex flex-col'>
        {/* <h1 >Role</h1>  */}
        <label className="text-black ml-1  font-semibold " htmlFor="">Role</label>
        <input
  type="text"
  value={data.role}
  name="role"
  className=" border border-gray-600 bg-transparent placeholder-text-black text-black focus:outline-none px-4 rounded-[12px]"
  onChange={updateData}
  required
  pattern="^[A-Za-z]+(?: [A-Za-z]+)+$"
  title="Please enter a valid role consisting of letters and spaces."
/>
        {/* <h1 className="text-black text-xl font-semibold mt-2 mb-2">Description </h1> */}
        <label className="text-black ml-1  font-semibold " htmlFor="">Description</label>
        {/* <textarea name="" id=""></textarea> */}
        <textarea
  value={data.description}
  name="description"
  className=" border border-gray-600 bg-transparent placeholder-text-black text-black focus:outline-none px-4 rounded-[12px]"
  onChange={updateData}
  required
  // pattern="^[A-Za-z0-9,' .?!]+(?: [A-Za-z0-9,' .?!]+)+$"
  rows={4} cols={50}
  title="Please use only letters, numbers, spaces, and punctuation marks in the description."
/>
                      <div className='flex flex-col text-black'>
                         <label className='font-semibold ml-1' htmlFor="qualification">Select your highest qualification</label>
                        <select className='w-full h-10 p-2 rounded-[10px]' aria-placeholder='select education' name="qualification" id="" onChange={updateData}> 
                            <option  value="" selected>Select an option</option>
                           <option value="Doctorate/Phd" >Doctorate/Phd</option>
                           <option value="Masters">Masters</option>
                           <option value="Bachelors/Diploma">Bachelors/Diploma</option>
                           <option value="12th">12th</option>
                        </select>
                        </div>   
        <div className='flex flex-col mt-[50px]  '>
                 <button className='bg-violet self-end px-4 py-2 rounded-[25px]' onClick={submitData} >Save changes</button>
                </div>
        </div>
        

        </div>
    </div>
)}
<div className="w-full relative bg-slate-500 bg-opacity-[15%]  col-span-3 rounded-[15px] p-5  ml-2 shadow-lg shadow-black">
             <div className="absolute right-7 top-3  border-2 rounded-full h-7 w-7 text-white border-white flex justify-center items-center" onClick={()=>setRoleandDescCard(true)}>
                  <FontAwesomeIcon
                    className="flex items-center h-3  w-3"
                    icon={faPen}
                  />
                </div>
            <div className='flex flex-col space-y-1'>
              <div className='flex flex-col '>
                <label htmlFor="" className='text-sm font-semibold'>Role</label>
                <input className='w-full bg-transparent border-2 text-xl border-white focus:ring-0 focus:border-white rounded-lg ' readOnly value={devData.role} type="text" />
            </div>
            <div className="flex flex-col">
                <label htmlFor="" className='text-sm font-semibold'>Description</label>
                <textarea className='bg-transparent h-[90px] border-2 text-lg px-3 border-white focus:ring-0 focus:border-white rounded-lg' name="" readOnly value={devData.description} id=""></textarea>
            </div>
            <div className="flex flex-col" >
                <label htmlFor="" className='text-sm font-semibold' >Education qualification</label>
                <input className='bg-transparent  border-2 text-lg border-white focus:ring-0 focus:border-white rounded-lg' readOnly value={devData.qualification} type="text" />
            </div>  
            </div>
            
</div>
</>
)

}

export default RoleAndDescription