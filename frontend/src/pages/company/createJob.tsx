import React, {useState,useEffect,Dispatch, SetStateAction } from "react";
// import { toast } from "react-toastify";
import AxiosInstance from "../../../utils/axios";
import { useSelector } from "react-redux";
import { RootState } from "../../store/store";
import { useNavigate } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import { faCircleXmark } from "@fortawesome/free-regular-svg-icons";
import AddQuestions from "../../components/job/addQuestions";
import { toast } from "react-toastify";


interface Props{
  action:'createJob'|'editJob',
  jobId?:string,
  setShowData?:Dispatch<SetStateAction<boolean>>
}



const Createjob: React.FC<Props> = ({action,jobId,setShowData}) => {


  const [jobData, setJobData] = useState({
    jobTitle: "",
    length: "",
    workingHoursperWeek: "",
    salary: "",
    qualification:'',
    experienceLevel:'',
    description: "",
    responsibilities: "",
    Quiz:{
      questions:[],
      passingScore:0
    },
    skills: "",
    createdAt:new Date().toISOString()
  });
  const [JobId,setJobId] = useState(jobId)
  const [questionsPage,setQuestionsPage] = useState(false)
  const companyId =  useSelector((state:RootState)=>{
    return state.companyRegisterData._id
  })
 
  useEffect(()=>{
if(jobId!==undefined){
  AxiosInstance.get(`/company/getJob/${jobId}`)
  .then((res)=>{
     if(res.data.data){
      setJobData(res.data.data)
     }
  })
}

  },[jobId])

  const navigate = useNavigate()

  const handleFromChange = (e:React.ChangeEvent<HTMLInputElement>|React.ChangeEvent<HTMLTextAreaElement>|React.ChangeEvent<HTMLSelectElement>) => {
    const { name, value } = e.target;
    setJobData((prevState) => ({
      ...prevState,
      [name]: value,
    })); 
  };

  
const HandleNext = ()=>{
  if(jobData.jobTitle.trim().length===0){
    toast.error('jobTitle cannot be empty')
    return
  }
  else if(jobData.length.trim().length===0){
    toast.error('length cannot be empty')
    return
  }
 else if(jobData.workingHoursperWeek.trim().length===0){
    toast.error('workingHoursperWeek cannot be empty')
    return
  }
 else if(jobData.salary.trim().length===0){
    toast.error('salary cannot be empty')
    return
  }
  else if(jobData.description.trim().length===0){
    toast.error('description cannot be empty')
    return
  }
  else if(jobData.responsibilities.trim().length===0){
    toast.error('responsibilities cannot be empty')
    return
  }
 else if(jobData.skills.trim().length===0){
    toast.error('skills cannot be empty')
    return
  }else if(jobData.qualification.trim().length===0){
    toast.error('Qualification field is required')
    return
  }else if(jobData.experienceLevel.trim().length===0){
    toast.error('Experience Level field is required')
    return
  }
  else{
    const id = jobId??companyId
    AxiosInstance.post(`/company/${action}/${id}`, jobData).then((res) => {
      if(action ==='createJob'){
        setJobId(res.data.jobId)
      }
      setJobData({
        jobTitle: "",
        length: "",
        workingHoursperWeek: "",
        salary: "",
        qualification:'',
        experienceLevel:'',
        description: "",
        responsibilities: "",
        Quiz:{
           questions:[],
      passingScore:0
        },
        skills: "",
        createdAt:new Date().toISOString()
      });
     setQuestionsPage(true)
     
    }).catch((error) => {
      toast.error(error.response.data.message);
    });
    setQuestionsPage(true)
  }
}



  

  return (
    <>
      <div className="bg-baseBaground bg-opacity-[25%] w-[800px]  rounded-lg shadow-custom-black relative sm:mx-[50px] md:mx-[150px] xl:mx-0">
        <div className="flex items-start justify-between p-5 border-b rounded-t">
          {questionsPage?<h3 className="text-2xl font-bold text-white" >Add Questions For Selection</h3>
          :
          <h3 className="text-2xl font-bold text-white">{action==='createJob'?'Add job details':'Edit job details'}</h3>
          }
          <FontAwesomeIcon
      className="text-white h-8 cursor-pointer"
      icon={faCircleXmark}
      onClick={() => {
        if (setShowData) {
          setShowData(false);
        } else {
          navigate('/company/job');
        }
      }}
    />
        </div>

        <div className={`${questionsPage?'flex  flex-col':''}`}>
          {questionsPage ===true?<AddQuestions jobId={JobId} Quiz={jobData.Quiz} />
          :
          <>
           <form className="p-8" > 
            <div className="grid grid-cols-6 gap-4">
              <div className="col-span-6 sm:col-span-3">
                <label
                  htmlFor="jobTitle"
                  className="text-sm font-medium text-white block mb-2"
                >
                  Job title
                </label>
                <input
                  type="text"
                  name="jobTitle"
                  id="jobTitle"
                  className="shadow-sm bg-gray-50 border border-gray-300 text-gray-900 sm:text-sm rounded-lg focus:ring-0 focus:border-none block w-full p-2.5"
                  placeholder="React Developer"
                  pattern="^[A-Z][a-zA-Z0-9 ]{5,79}$"
                  title="Must start with a capital letter and be 6-30 characters long."
                  required
                  onChange={handleFromChange}
                  value={jobData.jobTitle} // Added value
                />
              </div>
              <div className="col-span-6 sm:col-span-3">
                <label
                  htmlFor="length"
                  className="text-sm font-medium text-white block mb-2"
                >
                  Job length
                </label>
                <input
                  type="text"
                  name="length"
                  id="length"
                  className="shadow-sm bg-gray-50 border border-gray-300 text-gray-900 sm:text-sm rounded-lg focus:ring-0 focus:border-none block w-full p-2.5"
                  placeholder="2-4 months"
                  title="field is required"
                  onChange={handleFromChange}
                  value={jobData.length} // Added value
                  required
                />
              </div>
              <div className="col-span-6 sm:col-span-3">
                <label
                  htmlFor="workingHoursperWeek"
                  className="text-sm font-medium text-white block mb-2"
                >
                  Number of working hours per week
                </label>
                <input
                  type="text"
                  name="workingHoursperWeek"
                  id="workingHoursperWeek"
                  className="shadow-sm bg-gray-50 border border-gray-300 text-gray-900 sm:text-sm rounded-lg focus:ring-0 focus:border-none block w-full p-2.5"
                  placeholder="20-30 hours per week"
                  onChange={handleFromChange}
                  value={jobData.workingHoursperWeek} // Added value
                  required
                />
              </div>
              <div className="col-span-6 sm:col-span-3">
                <label
                  htmlFor="salary"
                  className="text-sm font-medium text-white block mb-2"
                >
                  Salary per hour /per project
                </label>
                <input
                  type="text"
                  name="salary"
                  id="salary"
                  className="shadow-sm bg-gray-50 border border-gray-300 text-gray-900 sm:text-sm rounded-lg focus:ring-0 focus:border-none block w-full p-2.5"
                  placeholder="$2300"
                  onChange={handleFromChange}
                  value={jobData.salary} 
                  required
                />
              </div>
               <div className="col-span-6 sm:col-span-3">
                <label
                  htmlFor="qualification"
                  className="text-sm font-medium text-white block mb-2"
                >
                  Eligible qualification
                </label>
                <select name="qualification" id="" value={jobData.qualification} className="shadow-sm bg-gray-50 border border-gray-300 text-gray-900 sm:text-sm rounded-lg focus:ring-0 focus:border-none block w-full p-2.5" onChange={handleFromChange}>
                  <option value="" disabled selected>Select an option</option>
                  <option value="Doctorate/phd">Doctorate/phd</option>
                  <option value="Masters">Masters</option>
                  <option value="Bachelors">Bachelors</option>
                  <option value="12">12</option>
                  <option value="Any">Any</option>
                </select>
              </div>
              <div className="col-span-6 sm:col-span-3">
                <label
                  htmlFor="experienceLevel"
                  className="text-sm font-medium text-white block mb-2"
                >
                  Experience level
                </label>
                <select name="experienceLevel" id="" value={jobData.experienceLevel} className="shadow-sm bg-gray-50 border border-gray-300 text-gray-900 sm:text-sm rounded-lg focus:ring-0 focus:border-none block w-full p-2.5" onChange={handleFromChange}>
                  <option value=""disabled selected>Select an option</option>
                  <option value="0-1 years">0-1 years</option>
                  <option value="1-3 years">1-3 years</option>
                  <option value="3-6 years">3-6 years</option>
                  <option value="6-10 years">6-10 years</option>
                  <option value="more than 10 years">more than 10 years</option>
                </select>
              </div>
              <div className="col-span-full">
                <label
                  htmlFor="description"
                  className="text-sm font-medium text-white block mb-2"
                >
                  Description
                </label>
                <textarea
                  id="description"
                  name="description"
                  rows={6}
                  className="bg-gray-50 border border-gray-300 text-gray-900 sm:text-sm rounded-lg focus:ring-0 focus:border-none block w-full p-4 resize-none"
                  placeholder=""
                  onChange={handleFromChange}
                  value={jobData.description} // Added value
                  required
                ></textarea>
              </div>
              <div className="col-span-full">
                <label
                  htmlFor="responsibilities"
                  className="text-sm font-medium text-white block mb-2"
                >
                  Key responsibilities
                </label>
                <textarea
                  id="responsibilities"
                  name="responsibilities"
                  rows={6}
                  className="bg-gray-50 border border-gray-300 text-gray-900 sm:text-sm rounded-lg focus:ring-0 focus:border-none block w-full p-4 resize-none"
                  placeholder=""
                  onChange={handleFromChange}
                  value={jobData.responsibilities} // Added value
                  required
                ></textarea>
              </div>
              <div className="col-span-full">
                <label
                  htmlFor="skills"
                  className="text-sm font-medium text-white block mb-2"
                >
                  Skills required
                </label>
                <textarea
                  id="skills"
                  name="skills"
                  rows={4}
                  className="bg-gray-50  text-gray-900 sm:text-sm rounded-lg focus:ring-0 focus:border-none block w-full p-4 resize-none"
                  placeholder="Skills needed for the job"
                  onChange={handleFromChange}
                  value={jobData.skills} // Added value
                  required
                ></textarea>
              </div>
            </div>
          </form>
          <div className="py-10 border-t flex justify-end ">
          {action==='createJob'?<button className="bg-violet text-white px-7 py-1 font-semibold rounded-[5px] mr-7" onClick={HandleNext}>Next</button>
          : 
          <button className="bg-violet text-white px-7 py-1 font-semibold rounded-[5px] mr-7" onClick={()=>setQuestionsPage(true)}>{jobData.Quiz?'Edit Question':'Add Questions'}</button>
          }
        </div>
          </>
}
</div>
      </div>
    </>
  );
};

export default Createjob;
