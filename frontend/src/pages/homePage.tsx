import React, { useEffect, useRef } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faSearch } from "@fortawesome/free-solid-svg-icons";
import { useNavigate } from "react-router-dom";
import HomeHeader from "../components/headerandFooter/homeHeader";

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

  const scrollLeft = (distance: number) => {
    if (elementRef.current) {
      const container = elementRef.current;
      container.scrollLeft = Math.max(container.scrollLeft - distance, 0);
    }
  };

  const scrollRight = (distance: number) => {
    if (elementRef.current) {
      const container = elementRef.current;
      const maxScrollLeft = container.scrollWidth - container.clientWidth;
      container.scrollLeft = Math.min(container.scrollLeft + distance, maxScrollLeft);
    }
  };

  return (
    <div className="bg- h-auto">
      <HomeHeader />
      <div className="h-[300px] mt-[64px] text-white bg-[url('../developer/bannerImage2.jpg')] bg-cover font-semibold font-kelly-slab sm:h-[450px]">
        <div className="bg-gradient-to-t from-transparent to-black h-[450px] w-full flex justify-center items-center">
          <div className="lg:w-3/4">
            <div className="flex flex-col space-y-3 items-center">
              <p className="xl:text-4xl lg:text-3xl md:text-2xl sm:text-xl">
                Are you a developer looking to improve your skills?
              </p>
              <p className="xl:text-4xl lg:text-3xl md:text-2xl sm:text-xl">
                Then upskill will be a better choice for you
              </p>
              <div className="relative group hover:scale-105 transition-transform duration-500 w-[500px]">
                <FontAwesomeIcon
                  icon={faSearch}
                  className="absolute xl:left-4 left-9 top-[22px] transform -translate-y-1/2 text-gray-200 sm:h-5 md:h-4 h-3"
                />
                <input
                  className="w-full bg-transparent border-2 border-white rounded-[40px] placeholder:text-gray-200 xl:px-9 px-14 sm:placeholder:text-base md:placeholder:text-lg lg:placeholder:text-lg xl:placeholder:text-xl py-2 placeholder:font-serif focus:ring-0"
                  placeholder="Search for jobs which match your profile"
                  type="text"
                />
              </div>
            </div>
          </div>
        </div>
      </div>
      <div className="h-[600px] text-white">
        <h1 className="flex justify-center text-2xl font-serif mt-[25px]">
          Discover jobs across popular roles
        </h1>
        <div className="button-container flex justify-between mb-4 px-[60px]">
          <button
            onClick={() => scrollLeft(350)}
            className="p-2 bg-gray-200 text-black rounded opacity-50"
          >
            Left
          </button>
          <button
            onClick={() => scrollRight(350)}
            className="p-2 bg-gray-200 rounded text-black opacity-50"
          >
            Right
          </button>
        </div>
        <div ref={elementRef} className="overflow-x-scroll mx-[60px]">
          <div className="flex gap-x-8 py-[50px] w-max h-auto overflow-x-scroll">
          <div className="flex p-5 space-x-8  items-center bg-black text-white rounded-[15px]">
            <img className="h-[90px] w-[90px]" src="https://res.cloudinary.com/dsnq2yagz/image/upload/v1720757628/userIcon-removebg-preview_blkbxz_c_crop_w_330_h_330_dahy2o.png" alt="" />
            <div className="">
            <h1 className="text-2xl">Zoho</h1>
            <span>company Type</span>
            </div>
            <button className="bg-violet px-5 py-1 rounded ">Message</button>
            </div>
            <div className="flex p-5 space-x-8  items-center bg-black text-white rounded-[15px]">
            <img className="h-[90px] w-[90px]" src="https://res.cloudinary.com/dsnq2yagz/image/upload/v1720757628/userIcon-removebg-preview_blkbxz_c_crop_w_330_h_330_dahy2o.png" alt="" />
            <div className="">
            <h1 className="text-2xl">Zoho</h1>
            <span>company Type</span>
            </div>
            <button className="bg-violet px-5 py-1 rounded ">Message</button>
            </div>
            <div className="flex p-5 space-x-8  items-center bg-black text-white rounded-[15px]">
            <img className="h-[90px] w-[90px]" src="https://res.cloudinary.com/dsnq2yagz/image/upload/v1720757628/userIcon-removebg-preview_blkbxz_c_crop_w_330_h_330_dahy2o.png" alt="" />
            <div className="">
            <h1 className="text-2xl">Zoho</h1>
            <span>company Type</span>
            </div>
            <button className="bg-violet px-5 py-1 rounded ">Message</button>
            </div>
            <div className="flex p-5 space-x-8  items-center bg-black text-white rounded-[15px]">
            <img className="h-[90px] w-[90px]" src="https://res.cloudinary.com/dsnq2yagz/image/upload/v1720757628/userIcon-removebg-preview_blkbxz_c_crop_w_330_h_330_dahy2o.png" alt="" />
            <div className="">
            <h1 className="text-2xl">Zoho</h1>
            <span>company Type</span>
            </div>
            <button className="bg-violet px-5 py-1 rounded ">Message</button>
            </div>
            <div className="flex p-5 space-x-8  items-center bg-black text-white rounded-[15px]">
            <img className="h-[90px] w-[90px]" src="https://res.cloudinary.com/dsnq2yagz/image/upload/v1720757628/userIcon-removebg-preview_blkbxz_c_crop_w_330_h_330_dahy2o.png" alt="" />
            <div className="">
            <h1 className="text-2xl">Zoho</h1>
            <span>company Type</span>
            </div>
            <button className="bg-violet px-5 py-1 rounded ">Message</button>
            </div>
          </div>
        </div>
      </div>

      <footer className="bottom-0 left-0 w-full bg-black text-white text-center py-4 text-xl">
        &copy; {new Date().getFullYear()} upSkill
      </footer>
    </div>
  );
};
