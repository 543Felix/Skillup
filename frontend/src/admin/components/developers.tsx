import React, { useEffect, useState } from 'react'
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
 import { faCircleXmark } from '@fortawesome/free-regular-svg-icons';
 import { faCircleCheck } from '@fortawesome/free-regular-svg-icons';
import Axiosinstance from '../../../utils/axios';
import AdminSideDeveloperProfile from './adminSideDeveloperProfile';

const Developers:React.FC =()=>{

const [data,setData] = useState([])
const [showData,setShowData] = useState(false)
const [developerId,setDeveloperId] = useState('')
useEffect(()=>{
    Axiosinstance.get('http://localhost:3001/admin/developers').then((res)=>{
        if(res.status === 200){
            setData(res.data.developers)
        }
    })
},[])

function block(e,id:string){
    e.stopPropagation()
    Axiosinstance.patch(`http://localhost:3001/admin/developers/block?id=${id}`).
    then((res)=>{
      if(res.status === 200){
       setData(res.data.developer)
      }
    }).catch((error)=>{
        console.error(error.message);
        
    })
}
function unBlock(e,id:string){
    e.stopPropagation()
    Axiosinstance.patch(`http://localhost:3001/admin/developers/unBlock?id=${id}`).
    then((res)=>{
        if(res.status === 200){
            setData(res.data.developer)
        }
      }).catch((error)=>{
          console.error(error.message);
          
      })
}

const ShowDeveloperData=(data:string)=>{
setShowData(true)
 setDeveloperId(data)
}
return(
   showData === true?
    <AdminSideDeveloperProfile data={developerId} closeProfile={setShowData}/>
    :
    <div className="col-span-12 mt-5">
    <div className="grid gap-2 grid-cols-1 lg:grid-cols-1">
        <div className="bg-white p-4 shadow-lg rounded-lg">
            <h1 className="font-bold text-base">Developers</h1>
            <div className="mt-4">
                <div className="flex flex-col">
                    <div className="-my-2 overflow-x-auto">
                        <div className="py-2 align-middle inline-block min-w-full">
                            <div
                                className="shadow overflow-hidden border-b border-gray-200 sm:rounded-lg ">
                                <table className="min-w-full divide-y divide-gray-200">
                                    <thead>
                                        <tr>
                                            <th
                                                className="px-6 py-3 bg-gray-50 text-xs leading-4 font-medium text-gray-500 uppercase tracking-wider">
                                                <div className="flex cursor-pointer">
                                                    <span className="mr-2">NAME</span>
                                                </div>
                                            </th>
                                            <th
                                                className="px-6 py-3 bg-gray-50 text-xs leading-4 font-medium text-gray-500 uppercase tracking-wider">
                                                <div className="flex cursor-pointer">
                                                    <span className="mr-2">Email</span>
                                                </div>
                                            </th>
                                            <th
                                                className="px-6 py-3 bg-gray-50 text-xs leading-4 font-medium text-gray-500 uppercase tracking-wider">
                                                <div className="flex cursor-pointer">
                                                    <span className="mr-2">STATUS</span>
                                                </div>
                                            </th>
                                            <th
                                                className="px-6 py-3 bg-gray-50 text-xs leading-4 font-medium text-gray-500 uppercase tracking-wider">
                                                <div className="flex cursor-pointer">
                                                    <span className="mr-2">ACTION</span>
                                                </div>
                                            </th>
                                        </tr>
                                    </thead>
                                    <tbody className="bg-white divide-y divide-gray-200">
  {data.map((item) => (
    <tr key={item._id} onClick={()=>ShowDeveloperData(item)}>
      <td className="px-6 py-4 whitespace-no-wrap text-sm leading-5">
        <p>{item.name}</p>
      </td>
      <td className="px-6 py-4 whitespace-no-wrap text-sm leading-5">
        <p>{item.email}</p>
      </td>
      <td className="px-6 py-4 whitespace-no-wrap text-sm leading-5">
        
          {/* Add your logic for active/inactive status here */}
          {item.isBlocked === false?
          <div className="flex text-green-500 items-center">
            <FontAwesomeIcon className='mr-1' icon={faCircleCheck}/><p>Active</p>
            </div>:
            <div className="flex text-red-600 items-center">
            <FontAwesomeIcon className='mr-1' icon={faCircleXmark}/>
            <p  >Blocked</p>
            </div>
            }
          
        
      </td>
      <td className="px-6 py-4 whitespace-no-wrap text-sm leading-5">
        <div className="flex space-x-4">
          <a href="#" className="text-blue-500 hover:text-blue-600">
            {
                item.isBlocked === false?<button className="bg-red-600 text-white px-3 py-1rounded-xl" onClick={(e)=>block(e,item._id)}>Block</button>:
                <button className="bg-green-500 text-white px-3 rounded-xl" onClick={(e)=>unBlock(e,item._id)}>unBlock</button>
            }
            
            
          </a>
        </div>
      </td>
    </tr>
  ))}
</tbody>

                                </table>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>
</div>
    
   
)
}
export default Developers