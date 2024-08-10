import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import { faCircleXmark } from "@fortawesome/free-regular-svg-icons"
import { useSelector } from "react-redux";
import { RootState } from "../../store/store";
import { useEffect, useState, useCallback } from "react";
import AxiosInstance from "../../../utils/axios";
// import { jobDetails } from "../../../types/interface"
import { useNavigate } from "react-router-dom";
import moment from "moment";

interface ProposalData {
  _id: string;
  jobId: string;
  coverLetter: string;
  resume:string;
  status: string;
  createdAt: Date;
  jobName: string;
  companyName: string;
}

const DeveloperProposals = () => {
  const [data, setData] = useState<ProposalData[]>([]);
  const devId = useSelector((state: RootState) => {
    return state.developerRegisterData._id;
  });
  const [proposalModal,showProposalModal] = useState<boolean>(false)
  const [coverLetter,setCoverLetter] = useState<string>('')
  const navigate = useNavigate();
  const getProposals = useCallback(() => {
    AxiosInstance.get(`/dev/submittedProposals/${devId}`).then(res => {
      setData(res.data.data);
      console.log("submitted proposals = ", res.data.data);
    });
  }, [devId]);
  useEffect(() => {
    getProposals();
  }, [getProposals]);

  const displayJob = (id: string) => {
    navigate(`/dev/job/${id}`, { state: { Applied: true } });
  };
 
   const viewCoverLetter = (coverLetter:string)=>{
    setCoverLetter(coverLetter)
    showProposalModal(true)
   }
     
   const showResume = (url:string)=>{
    navigate('/dev/pdfView',{state:{url:url}})
  }

  
  return (
    <>
    
     
    {proposalModal&&(
       <div className="h-screen fixed w-screen  top-0 z-[9999] bottom-0 left-0 flex  justify-center items-center backdrop-blur-md">
        
       <div className="h-auto w-[600px] bg-black border-2 rounded-3xl shadow-custom-black pt-0 p-10 ">
         <div className="flex justify-end items-center my-4">
         <FontAwesomeIcon className="text-white h-7" icon={faCircleXmark} onClick={()=>showProposalModal(false)}/>
         </div>
            <div className="flex flex-col border border-violet p-5 rounded-2xl " >
             <h1 className="text-white text-lg font-bold">Cover Letter</h1>
             <textarea name="" id="" rows={10} value={coverLetter} className=" my-5 resize-none rounded-md"></textarea>
             <div className="flex justify-end">
             </div>
            
            </div>
       </div>
      </div>
                             )}


       <div>
      <div>
        <div className="col-span-12  mt-5 w-full">
          <div className="grid gap-2 grid-cols-1 lg:grid-cols-1">
            <div className="bg-black p-4 shadow-lg rounded-lg">
              <div className="flex justify-start">
                <h1 className="font-bold text-white text-xl">Applied jobs</h1>
              </div>

              <div className="mt-4">
                <div className="flex flex-col">
                  <div className="-my-2 overflow-x-auto">
                    <div className="py-2 align-middle inline-block min-w-full">
                      <div className="shadow overflow-hidden  sm:rounded-lg ">
                        {data.length > 0 ? (
                            <>
                            
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
                                    <span className="mr-2">Date</span>
                                  </div>
                                </th>
                                <th className="px-6 py-3 bg-black text-xs leading-4 font-medium text-gray-500 uppercase tracking-wider">
                                  <div className="flex cursor-pointer">
                                    <span className="mr-2">Job NAME</span>
                                  </div>
                                </th>
                                <th className="px-6 py-3 bg-black text-xs leading-4 font-medium text-gray-500 uppercase tracking-wider">
                                  <div className="flex cursor-pointer">
                                    <span className="mr-2">Company Name</span>
                                  </div>
                                </th>
                                <th className="px-6 py-3 bg-black text-xs leading-4 font-medium text-gray-500 uppercase tracking-wider">
                                  <div className="flex cursor-pointer">
                                    <span className="mr-2">Cover Letter</span>
                                  </div>
                                </th>
                                <th className="px-6 py-3 bg-black text-xs leading-4 font-medium text-gray-500 uppercase tracking-wider">
                                  <div className="flex cursor-pointer">
                                    <span className="mr-2">Resume</span>
                                  </div>
                                </th>
                                <th className="px-6 py-3 bg-black    text-xs leading-4 font-medium text-gray-500 uppercase tracking-wider">
                                  <div className="flex cursor-pointer">
                                    <span className="mr-2">STATUS</span>
                                  </div>
                                </th>
                              </tr>
                            </thead>
                            <tbody className="bg-black ">
                              {data.map((item, index) => (
                                <tr key={item.jobId}>
                                  <td className="px-6 py-4 text-white whitespace-no-wrap text-sm leading-5">
                                    <p>{index + 1}</p>
                                  </td>
                                  <td className="px-6 py-4 text-white whitespace-no-wrap text-sm leading-5">
                                    <p>
                                    {new Date(item?.createdAt).toISOString().split('T')[0]}
                                    </p>
                                  </td>
                                  <td
                                    className="px-6 py-4 text-white whitespace-no-wrap text-sm leading-5"
                                    onClick={() => displayJob(item.jobId)}
                                  >
                                    <p>{item.jobName}</p>
                                  </td>
                                  <td className="px-6 py-4 text-white whitespace-no-wrap text-sm leading-5">
                                    <p>{item.companyName}</p>
                                  </td>
                                  <td className="px-6 py-4 text-white whitespace-no-wrap text-sm leading-5" onClick={()=>viewCoverLetter(item.coverLetter)}>
                                    <p>View cover Letter</p>
                                  </td>
                                  <td className="px-6 py-4 text-white whitespace-no-wrap text-sm leading-5" onClick={()=>showResume(item.resume)}>
                                    <p>View Resume</p>
                                  </td>
                                  <td className="px-6 py-4 whitespace-no-wrap text-sm leading-5">
                                    <div
                                      className={`${
                                        item.status === "selected"
                                          ? "text-green-500"
                                          : item.status === "rejected"
                                          ? "text-red-500"
                                          : "text-orange"
                                      }  `}
                                    >
                                      <p>{item.status}</p>
                                    </div>
                                  </td>
                                  <td className="px-6 py-4 flex whitespace-no-wrap text-sm leading-5"></td>
                                </tr>
                              ))}
                            </tbody>
                          </table>
                            </>
                          
                        ) : (
                          <div className="flex justify-center text-white text-3xl font-semibold py-5">
                            <h1>No one applied for the job</h1>
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
    </div>
    </>
    
  );
};
export default DeveloperProposals;
