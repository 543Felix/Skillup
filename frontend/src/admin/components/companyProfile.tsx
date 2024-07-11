import React from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faImage, faCircleXmark } from "@fortawesome/free-regular-svg-icons";
import Axiosinstance from "../../../utils/axios";
import { toast } from "react-toastify";

const AdminCompanyProfile: React.FC = ({ data, closeProfile,updateData}) => {
  console.log('data = ',data.isVerified)
  const verifyCompany = ()=>{
    Axiosinstance.patch(`/admin/companies/verify?id=${data._id}`).then((res)=>{
      const data = res.data.data
      console.log('data =',data)
      updateData(data)
      closeProfile(false)
      toast.success(`${data.companyName} mark as verified`)
    })
  }
  const unVerifyCompany =()=>{
    Axiosinstance.patch(`/admin/companies/unverify?id=${data._id}`).then((res)=>{
      const data = res.data.data
      updateData(data)
      closeProfile(false)
      toast.success(`${data.companyName} mark as unverified`)
    })
  }
  return (
    <div className="fixed h-screen w-screen bottom-0 left-0 right-0 z-10 bg-black bg-opacity-[75%] py-[50px] justify-center items-center overflow-auto ">
      <div className=" flex justify-center  relative py-[80px] z-30">
        <FontAwesomeIcon
          icon={faCircleXmark}
          className="absolute top-[70px] right-[150px] text-white h-[30px]"
          onClick={() => closeProfile(false)}
        />

        <div className="h-[900px] w-[900px] grid grid-rows-3 bg-black bg-opacity-[75%] rounded-[15px] ">
          <div className=" grid grid-cols-4 ">
            <div className="col-start-1 bg-black border border-white rounded-[15px] grid grid-rows-2 ">
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
              <div className="row-start-2 px-4 py-2 border-t items-center grid grid-rows-3  grid-cols-3">
                {data && (
                  <>
                    <input
                      defaultValue={data.name}
                      type="text"
                      className="text-xl font-bold  row-start-1 col-span-2 bg-transparent focus:outline-none text-white"
                      readOnly
                    />
                    <input
                      defaultValue={data.email}
                      type="text"
                      className="text-lg font-light  row-start-2 col-span-3 bg-transparent focus:outline-none text-white "
                      readOnly
                    />
                    <input
                      defaultValue={data.phoneNo}
                      type="text"
                      className="text-lg font-light  row-start-3 col-span-2 bg-transparent focus:outline-none text-white "
                      readOnly
                    />
                  </>
                )}
              </div>
            </div>
            <div className="col-start-2 col-span-3 ml-2 bg-black border border-white rounded-[10px] py-5 px-12 z-0">
              <div className="relative  flex flex-col">
                {/* <FontAwesomeIcon icon={faPenToSquare} className='absolute text-white top-0 right-0' onClick={()=>setEditPage(true)} /> */}
                <div className="flex flex-row justify-between">
                  <div className="flex flex-col mr-6">
                    <label className="text-white text-sm font-light ">
                      Company type :
                    </label>
                    {data.companyType ? (
                      <input
                        defaultValue={data.companyType}
                        type="text"
                        className="mt-1 bg-transparent text-white text-lg border py-1 px-2 rounded-[8px]  border-white focus:outline-none"
                        placeholder="Product based"
                        readOnly
                      />
                    ) : (
                      <input
                        type="text"
                        className="mt-1 bg-transparent text-white text-lg border py-1 px-2 rounded-[8px]  border-white focus:outline-none"
                        placeholder="Product based"
                        readOnly
                      />
                    )}
                  </div>
                  <div className="flex flex-col mr-[180px] ">
                    {" "}
                    {/* Adjust the margin as needed */}
                    <label className="text-white text-sm font-light">
                      Company size :
                    </label>
                    {data.noOfEmployes ? (
                      <input
                        defaultValue={data.noOfEmployes}
                        type="text"
                        className="mt-1 bg-transparent text-white text-lg border rounded-[8px] border-white py-1 px-2 focus:outline-none"
                        placeholder="Company Size"
                        readOnly
                      />
                    ) : (
                      <input
                        type="text"
                        className="mt-1 bg-transparent text-white text-lg border rounded-[8px] border-white py-1 px-2 focus:outline-none"
                        placeholder="Company Size"
                        readOnly
                      />
                    )}
                  </div>
                </div>

                <label className="text-white text-sm font-light mt-2">
                  Website url :
                </label>
                {data.website ? (
                  <input
                    defaultValue={data.website}
                    type="url"
                    className="mt-1 bg-transparent text-white text-lg border rounded-[8px] border-white py-1 px-2 focus:outline-none"
                    placeholder="Website URL"
                    readOnly
                  />
                ) : (
                  <input
                    type="url"
                    className="mt-1 bg-transparent text-white text-lg border rounded-[8px] border-white py-1 px-2 focus:outline-none"
                    placeholder="Website URL"
                    readOnly
                  />
                )}

                <label className="text-white text-sm font-light mt-2">
                  Overview :
                </label>
                {data.overview ? (
                  <textarea
                    defaultValue={data.overview}
                    className="mt-1 text-white text-base  py-1 px-2 rounded-[8px] bg-transparent border h-[100px] focus:outline-none border-white resize-none"
                    placeholder="Overview"
                    readOnly
                  ></textarea>
                ) : (
                  <textarea
                    className="mt-1 text-white text-base  py-1 px-2 rounded-[8px] bg-transparent border h-[100px] focus:outline-none border-white resize-none"
                    placeholder="Overview"
                    readOnly
                  ></textarea>
                )}
              </div>
            </div>
          </div>
          <div className="row-start-2 bg-black border border-white rounded-[15px] p-7 mt-2">
            <div className="flex justify-between items-center">
              <h1 className="text-2xl text-white font-bold font-serif">
                Specialities
              </h1>
            </div>
            <div className="p-4">
              {data.specialties.length > 0 &&
                data.specialties.map((item, index) => (
                  <button
                    key={index}
                    className="justify-center items-center bg-violet text-white px-3 py-1              mr-3 mb-3 rounded-[15px]"
                  >
                    {item}
                  </button>
                ))}
            </div>
          </div>
          <div className="row-start-3 mt-2 bg-black border border-white rounded-[15px] py-5 px-10">
            <div className="relative">
              <h1 className="text-white text-2xl  font-semibold">
                Certificates
              </h1>
              {/* <FontAwesomeIcon icon={faPlus} className='text-white absolute top-0 right-5 h-[30px]' onClick={()=>setCard(true)} /> */}
            </div>

            <div className="grid - grid-cols-4 p-5 pb-10 h-full">
              {/* {certificate?certificate.map((item,index)=>(
            <img key={index} src={item} className={`col-start-${index+1} text-black mr-3`} alt="" />
        )): <h1 className='text-gray-300'>No certificates added</h1>} */}
            </div>
          </div>
        </div>
        <button 
  className="bg-violet absolute right-[190px] bottom-6 text-white px-[25px] py-1 font-semibold rounded-[15px] items-center" 
  onClick={() => {
    data.isVerified === true ? unVerifyCompany() : verifyCompany();
  }}
>
  {data.isVerified === true ? 'un verify' : 'verify'}
</button>
      </div>
    </div>
  );
};
export default AdminCompanyProfile;
