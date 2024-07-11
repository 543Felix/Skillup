// import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
// import { faCircleXmark } from "@fortawesome/free-regular-svg-icons"
import { useSelector } from "react-redux"
import { RootState } from "../../store/store"
import { useEffect, useState } from "react"
import AxiosInstance from "../../../utils/axios"

const DeveloperProposals =()=>{
    const [data,setData] = useState([])
    const devId = useSelector((state:RootState)=>{
        return state.developerRegisterData._id
    })
    useEffect(()=>{
        AxiosInstance.get(`/dev/submittedProposals/${devId}`)
        .then((res)=>{
            setData(res.data.data)
            console.log('submitted proposals = ',res.data.data)
        })
    })
return(
    <div>
        {/* <div className="flex text-xl text-white font-bold space-x-5"> 
            <h1 className="border-b-2">Submitted Proposal</h1>
            <h1 className="border-b-2" >Accepted Proposal</h1>
        </div> */}
        <div>
              <div className="col-span-12  mt-5 w-5/6">
    <div className="grid gap-2 grid-cols-1 lg:grid-cols-1">
        <div className="bg-black p-4 shadow-lg rounded-lg">
            <div className="flex justify-start">
             <h1 className="font-bold text-white text-xl"> Submitted Proposals</h1>
            </div>
           
            <div className="mt-4">
                <div className="flex flex-col">
                    <div className="-my-2 overflow-x-auto">
                        <div className="py-2 align-middle inline-block min-w-full">
                            <div
                                className="shadow overflow-hidden  sm:rounded-lg ">
                                {data.length>0?
                                <table className="min-w-full">
                                    <thead>
                                        <tr>
                                            <th
                                                className="px-6 py-3 bg-black text-xs leading-4 font-medium text-gray-500 uppercase tracking-wider">
                                                <div className="flex cursor-pointer">
                                                    <span className="mr-2">Job NAME</span>
                                                </div>
                                            </th>
                                            <th
                                                className="px-6 py-3 bg-black text-xs leading-4 font-medium text-gray-500 uppercase tracking-wider">
                                                <div className="flex cursor-pointer">
                                                    <span className="mr-2">Company Name</span>
                                                </div>
                                            </th>
                                            <th
                                                className="px-6 py-3 bg-black text-xs leading-4 font-medium text-gray-500 uppercase tracking-wider">
                                                <div className="flex cursor-pointer">
                                                    <span className="mr-2">Cover Letter</span>
                                                </div>
                                            </th>
                                            <th
                                                className="px-6 py-3 bg-black    text-xs leading-4 font-medium text-gray-500 uppercase tracking-wider">
                                                <div className="flex cursor-pointer">
                                                    <span className="mr-2">STATUS</span>
                                                </div>
                                            </th>
                                            {/* <th
                                                className="px-6 py-3 bg-black text-xs leading-4 font-medium text-gray-500 uppercase tracking-wider">
                                                <div className="flex cursor-pointer">
                                                    <span className="mr-2">ACTION</span>
                                                </div>
                                            </th> */}
                                        </tr>
                                    </thead>
                                    <tbody className="bg-black ">
  {data.map((item) => (
    <tr >
      <td className="px-6 py-4 text-white whitespace-no-wrap text-sm leading-5">
        <p>{item.job.jobTitle}</p>
      </td>
      <td className="px-6 py-4 text-white whitespace-no-wrap text-sm leading-5">
        <p>Company Name</p>
      </td>
       <td className="px-6 py-4 text-white whitespace-no-wrap text-sm leading-5">
        <p>view cover Letter</p>
      </td>
      <td className="px-6 py-4 whitespace-no-wrap text-sm leading-5">
          <div className={`${item.status==='selected'?'text-green-500':item.status==='rejected'?'text-red-500':'text-orange'}  `}>
            <p>{item.status}</p>
            </div>
            
      </td>
      <td className="px-6 py-4 flex whitespace-no-wrap text-sm leading-5">
          {/* <FontAwesomeIcon className="ml-6 text-white" icon={faEllipsisVertical}  /> */}
      </td>
      {/* {showStatus===true&&(
        <div className="absolute right-32 w-32 flex flex-col justify-center bg-white  text-black rounded shadow-lg">
          {status.map((statusItem)=>(
            <h1 className="hover:bg-black hover:text-white" onClick={()=>updateJobStatus(statusItem,item.developer?._id)}>{statusItem}</h1>
          ))} */}
        {/* </div> */}
      {/* )} */}
    </tr>
 ))} 
</tbody>

                                </table>
                                  : 
                                <div className="flex justify-center text-white text-3xl font-semibold py-5"  >
                                     <h1>No one applied for the job</h1>
                                </div> 
                    }
                            </div>
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
export default DeveloperProposals