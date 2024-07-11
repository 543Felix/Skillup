import React, { useEffect, useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faBookmark as regularBookmark, faCircleCheck, faCircleXmark } from "@fortawesome/free-regular-svg-icons";
import { faBookmark } from "@fortawesome/free-solid-svg-icons";
import Axiosinstance from "../../../utils/axios";
import JobData from "../../components/job/jobData";
import { jobDetails } from "../../../types/interface";
import {formatDistanceToNow , parseISO} from 'date-fns'
import { useSelector } from "react-redux";
import { RootState } from "../../store/store";

interface Props{
  jobType?:string
}

const Displayjob: React.FC<Props> = ({jobType}) => {

  const id = useSelector((state:RootState)=>{
   return state.developerRegisterData._id
  })
  const [jobs, setJobs] = useState<jobDetails[]>([]);
  const[saveOrUnsave,setSaveOrUnsave] = useState(0)
  const [showJob, setShowJob] = useState(false);
  const [savedJobs,setSavedJobs] = useState<string[]>([])
  const [animation,setAnimation] = useState(showJob?'animate-zoomOut':'animate-zoomIn')
  const [jobData, setJobData] = useState<jobDetails>({
    _id: '',
    companyId:'',
    jobTitle: "",
    length: "",
    workingHoursperWeek: "",
    salary: "",
    description: "",
    responsibilities: "",
    skills: [],
    Quiz:{},
    createdAt: '',
    companyDetails: [],
    status: 'open'
  });

  const showJobComponent = (e: React.MouseEvent<HTMLDivElement>, data: jobDetails) => {
    e.preventDefault();
    setAnimation('animate-zoomOut')
      setShowJob(true);
      setJobData(data);
  }

  useEffect(() => {
    const type = jobType==='savedJobs'?'savedJobs':'dev'
    Axiosinstance.get(`/job/${type}/${id}`)
      .then((response) => {
        console.log('response of savedJobs = ',response.data)
        if(type==='savedJobs'){
          setJobs(response.data.data);
        }else{
          setJobs(response.data.data);
          setSavedJobs(response.data.savedJobs)
        }
        
         
      }).catch((error)=>{
        if(error.response.status === 404){
          setJobs([])
        }
        console.log(error)
      })
  }, [id,jobType,saveOrUnsave]);

  const calculateTimeDifference = (startDate :string):string => {
    const date = parseISO(startDate);
    return formatDistanceToNow(date, { addSuffix: true });
}; 

const savejob = (e :React.MouseEvent<SVGSVGElement>,jobId:string)=>{
  e.stopPropagation()
Axiosinstance.patch(`/job/saveJob/${id}`,{jobId})
.then(()=>{
  setSaveOrUnsave(()=>saveOrUnsave+1)
    setSavedJobs((prevState)=>{
      return [
        ...prevState,
        jobId
      ]
    })
  
})
}
const unSaveJob = (e :React.MouseEvent<SVGSVGElement>,jobId:string)=>{
  e.stopPropagation()
Axiosinstance.patch(`/job/unSaveJob/${id}`,{jobId})
.then(()=>{
  const updatedSavedJobe = savedJobs.filter((item )=>item!==jobId) 
    setSaveOrUnsave(()=>saveOrUnsave+1)
    setSavedJobs(()=>{
      return [
        ...updatedSavedJobe
      ]
    })
  
})
}
  return (
    <>
    <div className=" ">
      {showJob ? (
        
        <JobData data={jobData} showData={showJob} setParentAnimation={setAnimation} setShowData={setShowJob} />
      ) : (
        
 jobs.length > 0?jobs.map((job) => (
         <div
         className={` bg-opacity-[15%] rounded-[15px] shadow-custom-black h-[290px] w-[730px]  mb-[20px] px-5 py-3 text-white transition-transform duration-75 ${animation}`}
            key={job._id}
            onClick={(e) => showJobComponent(e, job)}
          >
            <div className="flex justify-between">
              <h1 className="text-2xl font-bold">{job.jobTitle}</h1>
              <div className="flex space-x-5">
                <span>{calculateTimeDifference(job.createdAt)}</span>
                {savedJobs.length>0&&savedJobs.includes(job._id)?<FontAwesomeIcon className="h-[23px]" icon={faBookmark}  onClick={(e)=>unSaveJob(e,job._id)}/>:jobType==='savedJobs'?<FontAwesomeIcon className="h-[23px]" icon={faBookmark}  onClick={(e)=>unSaveJob(e,job._id)}/>:<FontAwesomeIcon className="h-[23px]" icon={regularBookmark}  onClick={(e)=>savejob(e,job._id)}/>}
              </div>
            </div>
            <div className="flex space-x-2">
              <h1 className="text-slate-400 text-xs">{job.companyDetails[0]?.companyName}</h1>
              <h1 className="text-slate-400 text-xs">
                {job.companyDetails[0]?.isVerified ? (
                  <>
                    verified<FontAwesomeIcon className="ml-1" icon={faCircleCheck} />
                  </>
                ) : (
                  <>
                    not verified<FontAwesomeIcon className="ml-1" icon={faCircleXmark} />
                  </>
                )}
              </h1>
            </div>
            <div>
              <h1
                className="mt-2 max-h-[100px]  overflow-y-auto"
              >
                {job.description}
              </h1>
            </div>
            <div className="mt-3 flex  flex-wrap max-h-[80px] overflow-y-auto">
              {job.skills.length > 0 && job.skills.map((item, index) => (
                <button className="bg-transparent mt-1 border-violet border-2 rounded-[8px] mr-1 px-4 py-[3px]" key={index}>
                  {item}
                </button>
              ))}
            </div>
          </div>
        )):
        <div className="flex justify-center">
       <h1 className="text-white text-6xl">There Are no saved jobs</h1>
       </div>
      )}
       </div>
    </>
  );
};

export default Displayjob;
