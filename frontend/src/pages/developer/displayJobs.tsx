import React, { useEffect, useState, useRef } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faBookmark as regularBookmark,
  faCircleCheck,
  faCircleXmark,
} from "@fortawesome/free-regular-svg-icons";
import { faBookmark } from "@fortawesome/free-solid-svg-icons";
import AxiosInstance from "../../../utils/axios";
import JobData from "../../components/job/jobData";
import { jobDetails } from "../../../types/interface";
import { formatDistanceToNow, parseISO } from "date-fns";
import { useSelector } from "react-redux";
import { RootState } from "../../store/store";
import Loader from "../loader";
import queryString from "query-string";

interface Props {
  jobType?: string | undefined;
}

interface Filter {
  qualification: string[];
  experienceLevel: string[];
  sort:string
}

interface Obj {
  [key: string]: string[] | string;
}

const Displayjob: React.FC<Props> = ({ jobType }) => {
  const id = useSelector((state: RootState) => {
    return state?.developerRegisterData._id;
  });
  const isInitialRender = useRef(true);
  const [jobs, setJobs] = useState<jobDetails[]>([]);
  const [saveOrUnsave, setSaveOrUnsave] = useState(0);
  const [showJob, setShowJob] = useState(false);
  const [savedJobs, setSavedJobs] = useState<string[]>([]);
  const [loader, setLoader] = useState<boolean>(false);
  const [animation, setAnimation] = useState(
    showJob ? "animate-zoomOut" : "animate-zoomIn"
  );
  const [jobData, setJobData] = useState<jobDetails>({
    _id: "",
    companyId: "",
    jobTitle: "",
    length: "",
    workingHoursperWeek: "",
    salary: "",
    description: "",
    responsibilities: "",
    qualification: "",
    experienceLevel: "",
    skills: [],
    Quiz: {},
    createdAt: "",
    companyDetails: [],
    status: "open",
  });
  const [filter, setFilter] = useState<Filter>({
    qualification: [],
    experienceLevel: [],
    sort:''
  });

  const showJobComponent = (
    e: React.MouseEvent<HTMLDivElement>,
    data: jobDetails
  ) => {
    e.preventDefault();
    setAnimation("animate-zoomOut");
    setShowJob(true);
    setJobData(data);
  };

  useEffect(() => {
    const type = jobType === "savedJobs" ? "savedJobs" : "allJobs";
    if (isInitialRender.current) {
      isInitialRender.current = false;
      setLoader(true);
    }
    const obj: Obj = {};
    if (filter.qualification.length > 0) {
      obj.qualification = filter.qualification;
    }
    if (filter.experienceLevel.length > 0) {
      obj.experienceLevel = filter.experienceLevel;
    }
    if(filter.sort.length>0){
      obj.sort = filter.sort
    }
    const query = queryString.stringify(obj, { arrayFormat: "bracket" });

    AxiosInstance.get(`/dev/${type}/${id}?${query}`)
      .then(response => {
        console.log("response of savedJobs = ", response.data);
        if (type === "savedJobs") {
          console.log("savedJobs  = ", response.data.data);
          setJobs(response.data.data);
        } else {
          setJobs(response.data.data);
          setSavedJobs(response.data.savedJobs);
        }
      })
      .catch(() => {})
      .finally(() => {
        setLoader(false);
      });
  }, [id, jobType, saveOrUnsave, filter]);

  const calculateTimeDifference = (startDate: string): string => {
    const date = parseISO(startDate);
    return formatDistanceToNow(date, { addSuffix: true });
  };

  const savejob = (e: React.MouseEvent<SVGSVGElement>, jobId: string) => {
    e.stopPropagation();
    AxiosInstance.patch(`/dev/saveJob/${id}`, { jobId }).then(() => {
      setSaveOrUnsave(() => saveOrUnsave + 1);
      setSavedJobs(prevState => {
        return [...prevState, jobId];
      });
    });
  };
  const unSaveJob = (e: React.MouseEvent<SVGSVGElement>, jobId: string) => {
    e.stopPropagation();
    AxiosInstance.patch(`/dev/unSaveJob/${id}`, { jobId }).then(() => {
      const updatedSavedJobe = savedJobs.filter(item => item !== jobId);
      setSaveOrUnsave(() => saveOrUnsave + 1);
      setSavedJobs(() => {
        return [...updatedSavedJobe];
      });
    });
  };

  const onFilterOptioChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value, checked } = e.target;

    setFilter(prevState => {
      let newArray = [...prevState[name as keyof Filter]];

      if (checked) {
        newArray.push(value);
      } else {
        newArray = newArray.filter(item => item !== value);
      }

      return {
        ...prevState,
        [name]: newArray,
      };
    });
  };
  const sortValueSet = (e:React.ChangeEvent<HTMLInputElement>)=>{
     const {name,value} = e.target
     console.log('name = ',name)
     console.log('value = ',value)
     setFilter((prevState)=>{
      return{
        ...prevState,
        [name]:value
      }
     })
  }

  return (
    <>
      {loader && <Loader />}
      <div className=" fixed flex flex-col space-y-2  py-5 px-10 rounded-xl bg-opacity-[15%] shadow-custom-black text-white h-auto">
        <h1 className="text-xl font-semibold">Filter by</h1>
        <div className="flex flex-col space-y-1">
          <h1>Qualification</h1>
          <div className="flex flex-col">
            {["Doctorate/phd", "Masters", "Bachelors", "12", "Any"].map(
              qualification => (
                <label key={qualification}>
                  <input
                    type="checkbox"
                    name="qualification"
                    value={qualification}
                    className="mr-1"
                    onChange={onFilterOptioChange}
                  />
                  {qualification}
                </label>
              )
            )}
          </div>
        </div>
        <div className="flex flex-col space-y-1">
          <h1>Experience Level</h1>
          <div className="flex flex-col">
            {[
              "0-1 years",
              "1-3 years",
              "3-6 years",
              "6-10 years",
              "more than 10 years",
            ].map(experienceLevel => (
              <label key={experienceLevel}>
                <input
                  type="checkbox"
                  name="experienceLevel"
                  value={experienceLevel}
                  className="mr-1"
                  onChange={onFilterOptioChange}
                />
                {experienceLevel}
              </label>
            ))}
          </div>
        </div>
        <h1 className="text-xl font-semibold">Sort by</h1>
        <div className="text-white flex flex-col">
          <label>
            <input
              type="checkbox"
              name="sort"
              value={'1'}
              checked={filter.sort==='1'}
              className="mr-1"
              onChange={sortValueSet}
            />
            A - Z
          </label>
          <label>
            <input
              type="checkbox"
              name="sort"
              value={'-1'}
              checked={filter.sort==='-1'}
              className="mr-1"
              onChange={sortValueSet}
            />
            Z-A
          </label>
        </div>
      </div>
      <div className="  space-x-3">
        <div className="">
          {showJob ? (
            <JobData
              data={jobData}
              showData={showJob}
              setParentAnimation={setAnimation}
              setShowData={setShowJob}
            />
          ) : jobs.length > 0 ? (
            <>
              <div className="flex ">
                <div className={`pl-[235px]`}>
                  {jobs.length > 0 &&
                    jobs.map(job => (
                      <div
                        className={` bg-opacity-[15%] rounded-[15px] shadow-custom-black h-[290px] w-[730px]  mb-[20px] px-5 py-3 text-white transition-transform duration-75 ${animation}`}
                        key={job._id}
                        onClick={e => showJobComponent(e, job)}
                      >
                        <div className="flex justify-between">
                          <h1 className="text-2xl font-bold">{job.jobTitle}</h1>
                          <div className="flex space-x-5">
                            <span>
                              {calculateTimeDifference(job.createdAt)}
                            </span>
                            {savedJobs.length > 0 &&
                            savedJobs.includes(job._id) ? (
                              <FontAwesomeIcon
                                className="h-[23px]"
                                icon={faBookmark}
                                onClick={e => unSaveJob(e, job._id)}
                              />
                            ) : jobType === "savedJobs" ? (
                              <FontAwesomeIcon
                                className="h-[23px]"
                                icon={faBookmark}
                                onClick={e => unSaveJob(e, job._id)}
                              />
                            ) : (
                              <FontAwesomeIcon
                                className="h-[23px]"
                                icon={regularBookmark}
                                onClick={e => savejob(e, job._id)}
                              />
                            )}
                          </div>
                        </div>
                        <div className="flex space-x-2">
                          <h1 className="text-slate-400 text-xs">
                            {job.companyDetails[0]?.companyName}
                          </h1>
                          <h1 className="text-slate-400 text-xs">
                            {job.companyDetails[0]?.isVerified ? (
                              <>
                                verified
                                <FontAwesomeIcon
                                  className="ml-1"
                                  icon={faCircleCheck}
                                />
                              </>
                            ) : (
                              <>
                                not verified
                                <FontAwesomeIcon
                                  className="ml-1"
                                  icon={faCircleXmark}
                                />
                              </>
                            )}
                          </h1>
                        </div>
                        <div>
                          <h1 className="mt-2 max-h-[100px]  overflow-y-auto">
                            {job.description}
                          </h1>
                        </div>
                        <div className="mt-3 flex  flex-wrap max-h-[80px] overflow-y-auto">
                          {job.skills.length > 0 &&
                            job.skills.map((item, index) => (
                              <button
                                className="bg-transparent mt-1 border-violet border-2 rounded-[8px] mr-1 px-4 py-[3px]"
                                key={index}
                              >
                                {item}
                              </button>
                            ))}
                        </div>
                      </div>
                    ))}
                </div>
              </div>
            </>
          ) : !loader ? (
            <div className="flex justify-center">
              <h1 className="text-white text-6xl">There Are no saved jobs</h1>
            </div>
          ) : (
            <></>
          )}
        </div>
      </div>
    </>
  );
};

export default Displayjob;
