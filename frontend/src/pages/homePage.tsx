import React, { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import HomeHeader from "../components/headerandFooter/homeHeader";
import { IconCloudDemo } from "../components/home/icons";
import TopSkills from "../components/home/topSkills";



export const Homepage: React.FC = () => {
  const navigate = useNavigate();

  useEffect(() => {
    const devData = localStorage.getItem("developerData");
    const companyData = localStorage.getItem("companyData");
    if (devData) {
      navigate("/dev/");
    }
    if (companyData) {
      navigate("/company/");
    }
  }, [navigate]);

  

  return (
    <div className="h-auto relative ">
      <HomeHeader />
      <div className="flex flex-col space-y-5">
      <div className="mt-[20px] text-white bg-[url('../developer/bannerImage2.jpg')] bg-cover font-semibold font-kelly-slab h-[250px] sm:h-[450px] xl:h-screen">
        <div className="bg-gradient-to-t from-transparent to-black h-[250px] sm:h-[450px] xl:h-screen  w-full flex justify-center items-center">
          <div className="">
            <div className="flex flex-col space-y-5 items-center">
              <p className="xl:text-4xl lg:text-3xl md:text-2xl sm:text-xl text-sm">
                Are you a developer looking for better opportunities?
              </p>
              <p className="xl:text-3xl lg:text-3xl md:text-2xl sm:text-xl text-xs">
                Then upskill will be a better choice for you
              </p>
             <button className="bg-violet px-7 py-2 rounded-lg font-bold text-xl" onClick={()=>navigate('/registerAs')} >Join Now</button>
            </div>
          </div>
        </div>
      </div>
      <TopSkills/>
      <IconCloudDemo/>
      </div>
     
 
     <div className="pt-32">
     <footer className="bottom-0  absolute left-0 w-full bg-black text-white text-center py-4 sm:text-lg lg:text-xl text-sm">
        &copy; {new Date().getFullYear()} upSkill
      </footer>
     </div>
      
    </div>
  );
};
