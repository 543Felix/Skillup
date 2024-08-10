import {useState,useEffect} from 'react'
import { useLocation } from "react-router-dom";
import AxiosInstance from '../../utils/axios';

 interface Members{
    _id:string;
    name:string
 }

interface MeetingHistory{
    _id:string;
    roomId:string;
    createdAt:Date;
    createdBy:string;
    callDuration:string;
    members:Members[]
}

const MeetingHistory = ()=>{
    const location = useLocation()
    const {id} = location.state
    const [data,setData] = useState<MeetingHistory[]>([])
      
    useEffect(()=>{
        AxiosInstance.get(`/meeting/meetingHistory/${id}`)
        .then((res)=>{
          if(res.data){
            setData(res.data)
          }
        })
    })

    return(
        <div className="w-screen px-4">
        <div className="col-span-12 w-full">
          <div className="grid gap-2 grid-cols-1 lg:grid-cols-1">
            <div className="bg-black p-4 shadow-lg rounded-lg">
              <div className="mt-4">
                <div className="flex flex-col">
                  <div className="-my-2 overflow-x-auto">
                    <div className="py-2 align-middle inline-block min-w-full">
                      <div className="shadow overflow-hidden sm:rounded-lg">
                        {data.length > 0 ? (
                          <table className="min-w-full">
                            <thead>
                              <tr>
                              <th className="px-6 py-3 bg-black text-xs leading-4 font-medium text-gray-500 uppercase tracking-wider">
                                  <div className="flex cursor-pointer">
                                    <span className="mr-2"></span>
                                  </div>
                                </th>
                                <th className="px-6 py-3 bg-black text-xs leading-4 font-medium text-gray-500 uppercase tracking-wider">
                                  <div className="flex cursor-pointer">
                                    <span className="mr-2">Meeting Date</span>
                                  </div>
                                </th>
                                <th className="px-6 py-3 bg-black text-xs leading-4 font-medium text-gray-500 uppercase tracking-wider">
                                  <div className="flex cursor-pointer">
                                    <span className="mr-2">RoomId</span>
                                  </div>
                                </th>
                                <th className="px-6 py-3 bg-black text-xs leading-4 font-medium text-gray-500 uppercase tracking-wider">
                                  <div className="flex cursor-pointer">
                                    <span className="mr-2">Room Created By</span>
                                  </div>
                                </th>
                                <th className="px-6 py-3 bg-black text-xs leading-4 font-medium text-gray-500 uppercase tracking-wider">
                                  <div className="flex cursor-pointer">
                                    <span className="mr-2">Members</span>
                                  </div>
                                </th>
                                <th className="px-6 py-3 bg-black text-xs leading-4 font-medium text-gray-500 uppercase tracking-wider">
                                  <div className="flex cursor-pointer">
                                    <span className="mr-2">Duration</span>
                                  </div>
                                </th>
                              </tr>
                            </thead>
                            <tbody className="bg-black">
                                {data.length>0&&data.map((item,index)=>(
                                   <tr key={item._id} >
                                   <td className="px-6 py-4 text-white whitespace-no-wrap text-sm leading-5">
                                     <p>{index+1}</p>
                                   </td>
                                   <td className="px-6 py-4 text-white whitespace-no-wrap text-sm leading-5">
                                     <p>{new Date(item?.createdAt).toISOString().split('T')[0]}</p>
                                   </td>
                                   <td className="px-6 py-4 text-white whitespace-no-wrap text-sm leading-5">
                                     <p>{item.roomId}</p>
                                   </td>
                                   <td className="px-6 py-4 text-white whitespace-no-wrap text-sm leading-5">
                                     <p>{item.createdBy}</p>
                                   </td>
                                   <td className="px-6 py-4 flex justify-center items-center whitespace-no-wrap text-sm leading-5">
                                     {item.members.length>0&&item.members.map((member)=>(
                                        <p>{member.name}</p>
                                     ))}
                                   </td>
                                   <td className="px-6 py-4 text-white whitespace-no-wrap text-sm leading-5">
                                     <p>{item.callDuration}</p>
                                   </td>
                                 </tr>
                                ))}
                               
                            </tbody>
                          </table>
                        ) : (
                          <div className="flex justify-center text-white text-3xl font-semibold py-5">
                            <h1>Currently no meeting history </h1>
                          </div>
                        )}
                      </div>
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

export default MeetingHistory