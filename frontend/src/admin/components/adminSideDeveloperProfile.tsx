import React, { Dispatch, SetStateAction } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faImage, faCircleXmark } from "@fortawesome/free-regular-svg-icons";
// import Axiosinstance from "../../../utils/axios";
// import { toast } from "react-toastify";
import {DeveloperData} from '../../../types/interface'


interface Props{
  data:DeveloperData,
  closeProfile:Dispatch<SetStateAction<boolean>>
}

const AdminSideDeveloperProfile: React.FC<Props> = ({ data, closeProfile,}) => {

  return (
      <div className=" flex justify-center   py-[10px]">
         <div className=" justify-end"> 
         <FontAwesomeIcon
          icon={faCircleXmark}
          className="absolute right-[50px] text-white h-[30px]"
          onClick={() => closeProfile(false)}
        />
        </div>
        <div className="h-[900px] w-[900px] grid grid-rows-3 ">
          <div className=" grid grid-cols-4 ">
            <div className="col-start-1 bg-slate-500 bg-opacity-[15%] rounded-[15px] grid grid-rows-2 shadow-custom-black">
              <div className="row-start-1 flex justify-center items-center">
                {data && data.image ? (
                  <img
                    src={`${data.image}`}
                    className="h-20 w-20 rounded-full"
                  />
                ) : (
                  <div className="h-24 w-24 rounded-full border-2 border-white flex justify-center items-center ">
                    <FontAwesomeIcon
                      className="h-16  text-white"
                      icon={faImage}
                    />
                  </div>
                )}
              </div>
              <div className="row-start-2 px-4 py-2 border-t items-center grid grid-rows-3  grid-cols-3 ">
                {data && (
                  <>
                    <input
                      defaultValue={data.name}
                      type="text"
                      className="text-xl font-bold  row-start-1 col-span-2 bg-transparent focus:outline-none border-none text-white"
                      readOnly
                    />
                    <input
                      defaultValue={data.email}
                      type="text"
                      className="text-lg font-light  row-start-2 col-span-3 bg-transparent focus:outline-none border-none text-white "
                      readOnly
                    />
                    <input
                      defaultValue={data.phoneNo}
                      type="text"
                      className="text-lg font-light  row-start-3 col-span-2 bg-transparent focus:outline-none border-none text-white "
                      readOnly
                    />
                  </>
                )}
              </div>
            </div>
            <div className="col-start-2 bg-slate-500 bg-opacity-[15%] col-span-3 rounded-[15px] grid grid-rows-4 p-7 ml-2  shadow-custom-black">
            <div className="flex justify-between items-center">
              <h1 className="text-2xl font-bold font-serif text-white"><span className='font-light '>Role  :  </span>{data.role}</h1>
            
            </div>
            <div className="flex justify-between items-center">
              <h1 className="text-2xl text-white font-bold font-serif"> <span className='font-light'> Description : </span>{data.description}</h1>
            </div>
</div>
          </div>
          <div className="row-start-2 bg-slate-500 bg-opacity-[15%] rounded-[15px] p-7 mt-2 shadow-custom-black">
            <div className="flex justify-between items-center">
              <h1 className="text-2xl text-white font-bold font-serif">
                Skills
              </h1>
            </div>
            <div className="p-4">
              {data.skills!.length > 0 &&
                data.skills!.map((item, index) => (
                  <button
                    key={index}
                    className="justify-center items-center bg-violet text-white px-3 py-1              mr-3 mb-3 rounded-[15px]"
                  >
                    {item}
                  </button>
                ))}
            </div>
          </div>
          <div className="row-start-3 mt-2 bg-slate-500 bg-opacity-[15%] rounded-[15px] py-5 px-10 shadow-custom-black">
            <div className="relative">
              <h1 className="text-white text-2xl  font-semibold">
                CompleterdWorks
              </h1>
              {/* <FontAwesomeIcon icon={faPlus} className='text-white absolute top-0 right-5 h-[30px]' onClick={()=>setCard(true)} /> */}
            </div>

            <div className="grid - grid-cols-4 p-5 pb-10 h-full">
            </div>
          </div>
        </div>
      </div>
  );
};
export default AdminSideDeveloperProfile;
