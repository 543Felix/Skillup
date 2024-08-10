

const ViewCompany = ()=>{
    return(
        <div className="text-white p-5 space-y-5">
          <div className="flex flex-col bg-[#1a1a1a] shadow-custom-black justify-center items-center p-5 rounded-[15px]">
            <img className="h-[150px] w-[150px]" src="https://res.cloudinary.com/dsnq2yagz/image/upload/v1720757628/userIcon-removebg-preview_blkbxz_c_crop_w_330_h_330_dahy2o.png" alt="" />
            <div className="flex flex-col justify-center items-center">
                <h1>Company Name</h1>
                <div className="flex space-x-5">
                    <h1>EmailId</h1>
                    <h1>phone No</h1>
                </div>
            </div>
          </div> 
          <div className="flex flex-col p-10 space-y-2 bg-[#1a1a1a] shadow-custom-black  rounded-[15px]">
            <div className="flex w-full space-x-4 " >
            <div className="flex flex-col space-y-1 w-1/2">
            <label className="text-sm" htmlFor="companyType">Compnay Type</label>
            <input className="bg-transparent focus:ring-0 border-white focus:border-white" name="companyType" type="text" />
            </div>
            <div className="flex flex-col space-y-1 w-1/2">
            <label className="text-sm" htmlFor="companyType">Compnay Type</label>
            <input className="bg-transparent focus:ring-0 border-white focus:border-white" name="companyType" type="text" />
            </div>
            </div>
            <div className="flex flex-col space-y-1">
                <label className="text-sm" htmlFor="url">Website url</label>
                <input className="bg-transparent focus:ring-0 border-white focus:border-white" readOnly type="text" name="url" id="" />
            </div>
            <div className="flex flex-col">
                <label htmlFor="overView">Company Overview</label>
                <textarea className="h-24 bg-transparent border  resize-none border-white focus:ring-0 focus:border-white" name="overView" readOnly id=""></textarea>
            </div>
          </div>
          <div className="flex flex-col p-4 space-y-2 bg-[#1a1a1a] shadow-custom-black  rounded-[15px]">
               <h1>Certificates</h1> 
          </div>
          <div className="flex flex-col p-4 space-y-2 bg-[#1a1a1a] shadow-custom-black  rounded-[15px]">
               <h1>Specialities</h1> 
          </div>

        </div>
    )
}

export default ViewCompany