import { useState, useEffect } from "react";
import { useSelector } from "react-redux";
import { RootState } from "../../store/store";
import Axiosinstance from "../../../utils/axios";
import { toast } from "react-toastify";
import { jobDetails } from "../../../types/interface";
import Createjob from "./createJob";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faTrashCan } from "@fortawesome/free-regular-svg-icons";
// import { Link } from "react-router-dom";
import AppliedDevelopers from "../../components/job/showAppliedDevelopers";

const CompanyJob = () => {
  const id = useSelector((state: RootState) => state.companyRegisterData._id);
  const [jobs, setJobs] = useState<jobDetails[]>([]);
  const [jobId,setJobId] = useState<string>('')
  const [showData,setShowData] = useState<boolean>(false)
  const [showAppliedDevelopers,setAppliedDevelopers] = useState<boolean>(false)
  const [jobName,setJobName] = useState<string>('')
  useEffect(() => {
    if (id) {
      Axiosinstance.get(`/company/allJobs/${id}`)
        .then((Data) => {
          console.log('jobs = ', Data.data.response);
          setJobs(Data.data.response);
  
        })
        .catch((error) => {
          console.error("Error fetching data: ", error);
        });
    }
  }, [id,showData]);

  const handleVaccancy = (e:React.MouseEvent<HTMLButtonElement, MouseEvent>,status :('open'|'closed'),id:string)=>{
    e.stopPropagation()
   Axiosinstance.patch(`/company/setStatus?id=${id}`,{status}).then((response)=>{
    if(response.data.message){
      const updatedJobs = jobs.map((job) => {
        if (job._id === id) {
          // Create a new object with the updated status
          return { ...job, status: status };
        }
        return job; // Return the unchanged job
      });
      
      console.log(updatedJobs);
      
      setJobs(updatedJobs);
       toast.success(response.data.message)
    }
   
   }).catch((error)=>{
     console.log(error)
   })
  }
  const showJobData = (id:string)=>{
   setJobId(id)
   setShowData(true)
  }

  const deleteJob = (e:React.MouseEvent<SVGSVGElement, MouseEvent>,id:string)=>{
    e.stopPropagation()
   Axiosinstance.delete(`/company/deleteJob/${id}`)
   .then((res)=>{
    const updateJobs = jobs.filter((job)=>job._id!==id)
    setJobs(updateJobs)
    toast.success(res.data.message)
   }).catch((error)=>{
     console.log(error)
   })
  }

  const displayAppliedDevelopers = (e:React.MouseEvent<HTMLButtonElement, MouseEvent>,jobId:string,jobName:string)=>{
   e.stopPropagation()
   console.log('')
   setJobId(jobId)
   setJobName(jobName)
   setAppliedDevelopers(true)
  }

  const hideAppliedDeveloperPage = ()=>{
    setJobId('')
   setAppliedDevelopers(false)
  }

  return (
    <>
    {showData===false&&showAppliedDevelopers === false?<div className="">
      {jobs.length > 0 && jobs.map((job) => (
        <div className="w-screen flex justify-center items-center">
           <div
          key={job._id}
          className="bg-slate-600 bg-opacity-[5%] rounded-[15px] shadow-custom-black h-[280px] w-[730px] mt-[15px] px-5 py-3 text-white"
          onClick={()=>showJobData(job._id)}
        >
          <div className="flex justify-between">
            <h1 className="text-2xl font-bold">{job.jobTitle}</h1>
            {/* Add any additional elements here */}
            <div className="flex space-x-2 items-center">
            {job.status==='open'?
             <button className="bg-violet text-xs px-2 py-1 rounded-[5px]" onClick={(e)=>handleVaccancy(e,'closed',job._id)} >Close  vaccancy</button>
            :job.status === 'closed'? <button className="bg-violet text-xs  rounded-[5px] px-2 py-1" onClick={(e)=>handleVaccancy(e,'open',job._id)} >open  vaccany</button>:''}
            <FontAwesomeIcon className="text-white h-5" icon={faTrashCan} onClick={(e)=>deleteJob(e,job._id)} />
            </div>
           
           
          </div>
          <div>
            <h1 className="mt-2 max-h-[70px] overflow-y-auto">
              {job.description}
            </h1>
          </div>
          <div className="mt-3 h-[80px] overflow-y-auto ">
            {job.skills.length > 0 && job.skills.map((item, index) => (
              <button className="bg-transparent mt-1 border-violet border-2 rounded-[8px] mr-[5px] px-4 py-[3px]" key={index}>
                {item}
              </button>
            ))}
          </div>
           <div className=" my-4 flex justify-end space-x-2 ">
            <button className="bg-violet text-white px-5 py-1 font-semibold rounded-[5px]" onClick={(e)=>displayAppliedDevelopers(e,job._id,job.jobTitle)}>Show Applied Developers</button>
          </div>
        </div>
        </div>
        
      ))}
    </div>:
    showData===true?
     <Createjob action={'editJob'} jobId={jobId} setShowData={setShowData} />
    :showAppliedDevelopers ===true?
    <AppliedDevelopers jobId={jobId} jobName={jobName} hidePage={hideAppliedDeveloperPage} />
    :<></>
}
    </>
    
  );
};

export default CompanyJob;
