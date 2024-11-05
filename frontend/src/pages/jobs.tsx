import { useEffect, useState,useRef } from "react";
import HomeHeader from '../components/headerandFooter/homeHeader'
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faBookmark ,
  faCircleCheck,
  faCircleXmark,
} from "@fortawesome/free-regular-svg-icons";
import { faMagnifyingGlass } from "@fortawesome/free-solid-svg-icons";
import queryString from "query-string";
import { formatDistanceToNow, parseISO } from "date-fns";

import Loader from './loader'
import { jobDetails } from "types/interface";
import AxiosInstance from '../../utils/axios'
import { useNavigate } from "react-router-dom";


interface Filter {
    qualification: string[];
    experienceLevel: string[];
    sort:string;
    search:string
  }

  interface Obj {
    [key: string]: string[] | string;
  }


const AllJobs = ()=>{

    const [jobs, setJobs] = useState<jobDetails[]>([]);
    const [loader,setLoader] = useState(false)
    const [search,setSearch] = useState<string>('')
    const navigate = useNavigate()
    const isInitialRender = useRef(true);

    const [filter, setFilter] = useState<Filter>({
    qualification: [],
    experienceLevel: [],
    sort:'',
    search:''
  });
  useEffect(() => {
    const handler = setTimeout(() => {
      setFilter((prev) => ({ ...prev, search }));
    }, 500);

    return () => {
      clearTimeout(handler);
    };
  }, [search]);
    useEffect(()=>{
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
        if (filter.search.length > 0) {
            obj.search = filter.search;
          }
        const query = queryString.stringify(obj, { arrayFormat: "bracket" });
        console.log('query = ',query)
        AxiosInstance.get(`/dev/jobs/?${query}`).then((response)=>{
            setJobs(response.data.data);
        })
        .catch(() => {})
      .finally(() => {
        setLoader(false);
      });
    },[filter])

    const calculateTimeDifference = (startDate: string): string => {
        const date = parseISO(startDate);
        return formatDistanceToNow(date, { addSuffix: true });
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
         setFilter((prevState)=>{
          return{
            ...prevState,
            [name]:value
          }
         })
      }

   return(
    <div className="h-auto relative">
      <HomeHeader />
      {loader? <Loader />:
      <>
      <div className='mt-[80px] w-full px-40'>
      <div className="fixed flex flex-col space-y-2  py-5 px-10 rounded-xl bg-opacity-[15%] shadow-custom-black text-white h-auto">
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
      
      <div className=" space-x-3">
        <div className={`pl-[235px] space-y-2`}>
         
        <div className="w-[71%] flex flex-col fixed items-center justify-center">
        <div className="w-full relative ">
        <input type="text" placeholder='Search jobs based on the skills..' value={search} onChange={(e)=>setSearch(e.target.value)} className="w-3/4 relative justify-center placeholder:text-black rounded-lg px-10" />
        </div>
          <FontAwesomeIcon className="h-5 text-black absolute left-3" icon={faMagnifyingGlass} />
         
          </div>
          { jobs.length > 0 ? (
            <>
              <div className="flex pt-[50px] ">
                <div >
                  {jobs.length > 0 &&
                    jobs.map(job => (
                      <div
                        className={` bg-opacity-[15%] rounded-[15px] shadow-custom-black h-[290px] w-[730px]  mb-[20px] px-5 py-3 text-white transition-transform duration-75 `}
                        key={job._id}
                        onClick={() => navigate('/dev/login')}
                      >
                        <div className="flex justify-between">
                          <h1 className="text-2xl font-bold">{job.jobTitle}</h1>
                          <div className="flex space-x-5">
                            <span>
                              {calculateTimeDifference(job.createdAt)}
                            </span>
                            
                              <FontAwesomeIcon
                                className="h-[23px]"
                                icon={faBookmark}
                                 onClick={()=>navigate('/dev/login')}
                              />
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
              <h1 className="text-white text-6xl">There Are no  jobs</h1>
            </div>
          ) : (
            <></>
          )}
        </div>
      </div>
      </div>
      
     
      </>
      }
      </div>
   )
}
export default AllJobs