import React, { useEffect, useRef } from "react";
// import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
// import { faSearch } from "@fortawesome/free-solid-svg-icons";
import { useNavigate } from "react-router-dom";
import HomeHeader from "../components/headerandFooter/homeHeader";
// import TechNews from "../components/techNews";
import { IconCloudDemo } from "../components/home/icons";
import TopSkills from "../components/home/topSkills";



export const Homepage: React.FC = () => {
  const navigate = useNavigate();
  const elementRef = useRef<HTMLDivElement>(null);

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

  // const scrollLeft = (distance: number) => {
  //   if (elementRef.current) {
  //     const container = elementRef.current;
  //     container.scrollLeft = Math.max(container.scrollLeft - distance, 0);
  //   }
  // };

  // const scrollRight = (distance: number) => {
  //   if (elementRef.current) {
  //     const container = elementRef.current;
  //     const maxScrollLeft = container.scrollWidth - container.clientWidth;
  //     container.scrollLeft = Math.min(container.scrollLeft + distance, maxScrollLeft);
  //   }
  // };

  return (
    <div className="h-auto relative">
      <HomeHeader />
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
              {/* <div className="relative group hover:scale-105 transition-transform duration-500 w-[500px]">
                <FontAwesomeIcon
                  icon={faSearch}
                  className="absolute xl:left-4 left-9 top-[22px] transform -translate-y-1/2 text-gray-200 sm:h-5 md:h-4 h-3"
                />
                <input
                  className="w-full bg-transparent border-2 border-white rounded-[40px] placeholder:text-gray-200 xl:px-9 px-14 sm:placeholder:text-base md:placeholder:text-lg lg:placeholder:text-lg xl:placeholder:text-xl py-2 placeholder:font-serif focus:ring-0"
                  placeholder="Search for jobs which match your profile"
                  type="text"
                />
              </div> */}
            </div>
          </div>
        </div>
      </div>
      <div className="h-auto text-white">
        <h1 className="flex justify-center text-2xl font-serif mt-[25px]">
          Discover jobs across popular roles
        </h1>
        
        <div ref={elementRef} className="overflow-x-scroll mx-[60px] relative">
          <div className="flex gap-x-8 py-[50px] w-max h-auto overflow-x-scroll">
          <div className="flex p-5 space-x-8  items-center bg-black text-white rounded-[15px]">
            <img className="h-[90px] w-[90px]" src="http://res.cloudinary.com/dsnq2yagz/image/upload/v1715522998/j2d4i41y6n1chxrsgzjn.png" alt="" />
            <div className="">
            <h1 className="text-2xl">Zoho</h1>
            <span>company Type</span>
            </div>
            <button className="bg-violet px-5 py-1 rounded ">Message</button>
            </div>
            <div className="flex p-5 space-x-8  items-center bg-black text-white rounded-[15px]">
            <img className="h-[90px] w-[90px]" src="http://res.cloudinary.com/dsnq2yagz/image/upload/v1715522998/j2d4i41y6n1chxrsgzjn.png" alt="" />
            <div className="">
            <h1 className="text-2xl">Zoho</h1>
            <span>company Type</span>
            </div>
            <button className="bg-violet px-5 py-1 rounded ">Message</button>
            </div>
            <div className="flex p-5 space-x-8  items-center bg-black text-white rounded-[15px]">
            <img className="h-[90px] w-[90px]" src="http://res.cloudinary.com/dsnq2yagz/image/upload/v1715522998/j2d4i41y6n1chxrsgzjn.png" alt="" />
            <div className="">
            <h1 className="text-2xl">Zoho</h1>
            <span>company Type</span>
            </div>
            <button className="bg-violet px-5 py-1 rounded ">Message</button>
            </div>
            <div className="flex p-5 space-x-8  items-center bg-black text-white rounded-[15px]">
            <img className="h-[90px] w-[90px]" src="http://res.cloudinary.com/dsnq2yagz/image/upload/v1715522998/j2d4i41y6n1chxrsgzjn.png" alt="" />
            <div className="">
            <h1 className="text-2xl">Zoho</h1>
            <span>company Type</span>
            </div>
            <button className="bg-violet px-5 py-1 rounded ">Message</button>
            </div>
            <div className="flex p-5 space-x-8  items-center bg-black text-white rounded-[15px]">
            <img className="h-[90px] w-[90px]" src="http://res.cloudinary.com/dsnq2yagz/image/upload/v1715522998/j2d4i41y6n1chxrsgzjn.png" alt="" />
            <div className="">
            <h1 className="text-2xl">Zoho</h1>
            <span>company Type</span>
            </div>
            <button className="bg-violet px-5 py-1 rounded ">Message</button>
            </div>
          </div>
          {/* <div className="button-container top-1/2 absolute flex justify-between mb-4 px-[60px]">
          <button
            onClick={() => scrollLeft(350)}
            className="p-2 bg-gray-200 text-black rounded opacity-50 "
          >
            Left
          </button>
          <button
            onClick={() => scrollRight(350)}
            className="p-2 bg-gray-200 rounded text-black opacity-50"
          >
            Right
          </button>
        </div> */}
        </div>
      </div>
      {/* <TechNews></TechNews> */}
      <TopSkills/>
      <IconCloudDemo/>
      <footer className="bottom-0 absolute left-0 w-full bg-black text-white text-center py-4 sm:text-lg lg:text-xl text-sm">
        &copy; {new Date().getFullYear()} upSkill
      </footer>
    </div>
  );
};
