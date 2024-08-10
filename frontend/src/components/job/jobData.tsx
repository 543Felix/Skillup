import React, { useEffect, useState,useCallback } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
// import { faBookmark } from "@fortawesome/free-regular-svg-icons";
import { faTimes } from "@fortawesome/free-solid-svg-icons";
import { jobDetails } from "../../../types/interface";
import ProposalPage from "./proposalPage";
import Quiz from "./QuizPage";
import AxiosInstance from "../../../utils/axios";
import { useSelector } from "react-redux";
import { RootState } from "../../store/store";
import { useNavigate,useParams,useLocation } from "react-router-dom";
import { toast } from "react-toastify";
import Loader from "../../pages/loader";




const JobData: React.FC = () => {
  const [data,setData] = useState<jobDetails|undefined>()
  const {id} = useParams()
  const location = useLocation()
  let Applied  
  if(location.state){
    Applied = location.state.Applied
   }else{
    Applied = false
   } 
  const [loader,setLoader] = useState<boolean>(false)
  const [showProposalPage,setShowProposalPage] = useState(false)
  // const [isApplied,setIsApplied] = useState(false)
  const navigate = useNavigate()
  const developerId = useSelector((state:RootState)=>{
    return state.developerRegisterData._id
  })
  const getJobData = useCallback(()=>{
    if(id){
      setLoader(true)
      AxiosInstance.get(`/dev/getJob/${id}`)
      .then((res)=>{
        if(res.data.data){
          setData(res.data.data[0])
        }
      }).catch(()=>{

      }).finally(()=>{
        setLoader(false)
      })
    }
    
  },[id])

  useEffect(()=>{
    getJobData()
  },[getJobData])


  // useEffect(()=>{
    
  //   if(data){
  //     if(data?.Quiz){
  //       AxiosInstance.get(`/dev/quizAttendedDevs/${data?._id}/${developerId}`)
  //       .then((res)=>{
  //         if(res.status === 401){
  //           setIsApplied(true)
  //         }
  //       })
  //     }else{
  //    AxiosInstance.get(`/job/appliedDevelopers/${data?._id}`)
  //      .then((res)=>{ 
  //       if(res.data.data){
  //         const filteredArray = res.data.data.filter((item:AppliedDevs)=>developerId===item.developer._id)
  //         if(filteredArray.length>0){
  //           setIsApplied(true)
  //         }
  //       }
       
  //      })
  //     }
  //   } 

  // },[data,developerId])
  
  


    
 
 const   displayJobComponent =()=>{ 
  setShowProposalPage(false)
    navigate('/dev/job')
  
 }

  const handleApply = ()=>{
    AxiosInstance.get(`/dev/appliedJobsCount/${developerId}`)
    .then((res)=>{
     if(res.status===200){
        setShowProposalPage(true)
     }
    }).catch((error)=>{
      if(error.response.status===401){
        toast.warning(error.response.data.message)
         navigate('/dev/pricingPage')
         
      }
       console.log(error.response.status)
    })
  }
   
  
  return (
    <>
    {loader&&(
      <Loader />
    )}
      {showProposalPage===false&&(
   <div
                className={`fixed top-[60px] right-0 bottom-0  shadow-custom-black  w-full bg-black overflow-y-auto `}
              >
      <div className="flex justify-end top-0  w-full py-[14px] p-3 sticky bg-violet">
        <FontAwesomeIcon
          className="text-white  bg-violet px-3 py-1 rounded-md text-3xl cursor-pointer"
          icon={faTimes}
          onClick={displayJobComponent}
        />
      </div>
      <div className="grid grid-cols-7 border-t-2">
        <div className="col-start-1 col-span-5 border-r-2">
          <div className="flex flex-col space-y-1 pb-5 p-3">
            <h1 className="text-white font-bold text-3xl">
              {data?.jobTitle}
            </h1>
            <span className="text-sm text-neutral-500 font-semibold">
              {data?.createdAt}
            </span>
          </div>
          <div className="text-white flex flex-col border-t-2 px-3 py-6 space-y-1">
            <h1 className="font-bold text-2xl">Description</h1>
            <h3 className="max-w-full text-neutral-300 text-sm">
              {data?.description}
            </h3>
          </div>
          <div className="flex flex-col border-t-2">
          <ul className="list-disc text-white pl-7 py-5">
            <li className="text-white">
               <div className="flex items-center space-x-2">
              <h1 className=" text-base font-semibold">Salary</h1>
              <span>:</span>
              <span className="text-neutral-300 text-sm">{data?.salary}</span>
            </div>
            </li>
            <li className="text-white">
               <div className="flex items-center space-x-2">
              <h1 className=" text-base font-semibold">
                Project length
              </h1>
              <span>:</span>
              <span className="text-neutral-300 text-sm">{data?.length}</span>
            </div>
            </li>
            <li className="text-white">
               <div className="flex items-center space-x-2">
              <h1 className=" text-base font-semibold">
                Working hours per week
              </h1>
              <span>:</span>
              <span className="text-neutral-300 text-sm">{data?.workingHoursperWeek}</span>
            </div>
            </li>
            <li>
               <div className="flex items-center space-x-2">
              <h1 className=" text-base font-semibold">Qualification</h1>
              <span>:</span>
              <span className="text-neutral-300 text-sm">{data?.qualification}</span>
            </div>
            </li>
            <li>
               <div className="flex items-center space-x-2">
              <h1 className=" text-base font-semibold">Experience needed</h1>
              <span>:</span>
              <span className="text-neutral-300 text-sm">{data?.experienceLevel}</span>
            </div>
            </li>
          </ul>
          </div>
          
          <div className="text-white border-t-2 px-3 py-5 space-y-2">
            <h1 className="text-xl font-semibold">Key responsibilities</h1>
            <span className="max-w-10 text-neutral-300 text-sm">
              {data?.responsibilities}
            </span>
          </div>
          <div className="text-white border-t-2 px-3 py-5 space-y-3">
            <h1 className="text-xl font-semibold">Required Skills</h1>
            <div className="flex flex-wrap justify-start items-start">
              {data&&data.skills && data?.skills.map((item, index) => (
                <button
                  key={index}
                  className="bg-violet font-semibold px-4 py-1 rounded-[8px] m-1"
                >
                  {item}
                </button>
              ))}
            </div>
          </div>
        </div>
        <div className="col-start-6 col-span-2  p-3">
          <div className="flex flex-col ">
            {!Applied&&(
               <button className="bg-violet font-semibold text-white hover:bg-white hover:text-violet py-2 rounded-[10px]"  onClick={handleApply}>
               Apply now
             </button>
            )}
            
          </div>
          <div className="flex flex-col justify-center space-y-1 text-white mt-24">
            <h1 className="xl:text-3xl text-lg font-bold self-center underline underline-offset-4">About Company</h1>
            <div className="flex pt-10 flex-col justify-center items-center">
              <h1 className="text-xl font-bold">Company Name</h1>
              <div className="flex space-x-1 text-neutral-300 justify-center items-center">
              <h1 className="text-base  font-semibold">{data&&data.companyDetails[0].companyName}</h1>
              <div className="flex justify-start">
                 {data&&data.companyDetails[0].isVerified===true?
                 <div className="flex space-x-1 justify-center items-center">
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" aria-hidden="true" viewBox="0 0 24 24" width="20" height="20" role="img"><path fill="var(--icon-color, #7f00ff)" fillRule="evenodd" vectorEffect="non-scaling-stroke" stroke="var(--icon-color, #7f00ff)" strokeLinecap="round" strokeLinejoin="round" strokeMiterlimit="10" strokeWidth="1.5" d="M20.4 13.1c.8 1 .3 2.5-.9 2.9-.8.2-1.3 1-1.3 1.8 0 1.3-1.2 2.2-2.5 1.8-.8-.3-1.7 0-2.1.7-.7 1.1-2.3 1.1-3 0-.5-.7-1.3-1-2.1-.7-1.4.4-2.6-.6-2.6-1.8 0-.8-.5-1.6-1.3-1.8-1.2-.4-1.7-1.8-.9-2.9.5-.7.5-1.6 0-2.2-.9-1-.4-2.5.9-2.9.8-.2 1.3-1 1.3-1.8C5.9 5 7.1 4 8.3 4.5c.8.3 1.7 0 2.1-.7.7-1.1 2.3-1.1 3 0 .5.7 1.3 1 2.1.7 1.4-.5 2.6.5 2.6 1.7 0 .8.5 1.6 1.3 1.8 1.2.4 1.7 1.8.9 2.9-.4.6-.4 1.6.1 2.2z" clipRule="evenodd"></path><path vectorEffect="non-scaling-stroke" stroke="var(--icon-color-bg, #fff)" strokeLinecap="round" strokeLinejoin="round" strokeMiterlimit="10" strokeWidth="1.5" d="M15.5 9.7L11 14.3l-2.5-2.5"></path></svg>
                    <h1>verified</h1>
                 </div>
                  :(
                    <div className="flex space-y-1">
<svg xmlns="http://www.w3.org/2000/svg" fill="none" aria-hidden="true" viewBox="0 0 24 24" width="20" height="20" role="img">
<path fill="var(--icon-color, #7f00ff)" fillRule="evenodd" vectorEffect="non-scaling-stroke" stroke="var(--icon-color, #7f00ff)" strokeLinecap="round" strokeLinejoin="round" strokeMiterlimit="10" strokeWidth="1.5" d="M20.4 13.1c.8 1 .3 2.5-.9 2.9-.8.2-1.3 1-1.3 1.8 0 1.3-1.2 2.2-2.5 1.8-.8-.3-1.7 0-2.1.7-.7 1.1-2.3 1.1-3 0-.5-.7-1.3-1-2.1-.7-1.4.4-2.6-.6-2.6-1.8 0-.8-.5-1.6-1.3-1.8-1.2-.4-1.7-1.8-.9-2.9.5-.7.5-1.6 0-2.2-.9-1-.4-2.5.9-2.9.8-.2 1.3-1 1.3-1.8C5.9 5 7.1 4 8.3 4.5c.8.3 1.7 0 2.1-.7.7-1.1 2.3-1.1 3 0 .5.7 1.3 1 2.1.7 1.4-.5 2.6.5 2.6 1.7 0 .8.5 1.6 1.3 1.8 1.2.4 1.7 1.8.9 2.9-.4.6-.4 1.6.1 2.2z" clipRule="evenodd"></path>
<path vectorEffect="non-scaling-stroke" stroke="var(--icon-color-bg, #fff)" strokeLinecap="round" strokeLinejoin="round" strokeMiterlimit="10" strokeWidth="1.5" d="M14 10L10 14M10 10L14 14"></path>
</svg> 
<h1>not verified</h1>
                    </div>
                  
                 )}
                               
           
            </div>
              </div>
              
            </div>
           
            <div className="flex flex-col justify-center items-center">
              <h1 className="text-xl font-semibold">Company Type</h1>
              <h3 className="text-sm text-neutral-300">product based</h3>
              </div>

             <div className="flex flex-col justify-center items-center">
              <h1 className="text-xl font-semibold">Number of employes</h1>
              <h3 className="text-sm text-neutral-300">20 - 30 employes</h3>
              </div>
              <div className="flex space-x-1 pt-5 justify-center items-center hover:scale-105">
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" aria-hidden="true" viewBox="0 0 24 24" width="16" height="16" role="img"><path vectorEffect="non-scaling-stroke" stroke="var(--icon-color, #feffff)" strokeLinecap="round" strokeLinejoin="round" strokeMiterlimit="10" strokeWidth="1.5" d="M21 12v6.3c0 1.53-1.17 2.7-2.7 2.7H5.7C4.17 21 3 19.83 3 18.3V5.7C3 4.17 4.17 3 5.7 3H12m4.5.09H21v4.5m-9 4.5l9-9"></path></svg>
              <h1 className="xl:text-sm text-xs font-bold self-center underline underline-offset-2">
<a href={data&&data.companyDetails[0].website} target="_blank" rel="noopener noreferrer">
Open official site in new window
</a>
</h1>
              </div>
            
            
            </div>
        </div>
      </div>
    </div>
      )}
             
  
  {showProposalPage===true&&(data&&data.Quiz?<Quiz displayJobComponent={displayJobComponent} jobId={data?._id}/>:<ProposalPage hideProposalPage={setShowProposalPage} displayJobComponent={displayJobComponent} jobId={data?._id}/>)}
  
    </>
  );
};

export default JobData;
