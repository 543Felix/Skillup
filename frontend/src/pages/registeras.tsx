import React from "react";
import { Link } from "react-router-dom";
const RegisterAs: React.FC = () => { 
  return (
    <div className="grid grid-cols-12 grid-rows-10 h-registration-page bg-black text-white ">
      <h1 className="xl:ml-[30px] xl:text-5xl xl:mt-0 lg:row-start-2 lg:col-start-3 md:row-start-2 md:col-start-3 col-span-9 lg:text-4xl md:text-3xl md:ml-12 md:mt-12 sm:row-start-3 sm:col-start-3 sm:ml-6 sm:mt-4 sm:text-xl ">
        Join as a company or junior developer
      </h1>
      
      <Link  className=" group xl:w-56 xl:h-56 row-start-4 col-start-4 lg:w-48 lg:h-48 md:w-44 md:h-44 sm:h-32 sm:w-32 border-2 rounded-lg border-zinc-100 grid grid-cols-8 grid-rows-4 hover:border-violet hover:text-violet focus:border-violet focus:text-violet hover:last:bg-violet hover:scale-110 transition-transform duration-300" to='/company/register'>
      <p className="grid row-start-3 col-start-2 col-span-6 lg:text-lg md:text-sm sm:text-sm group-focus:text-violet">
        Register as a company
      </p>
      <span className="flex items-center justify-center md:col-end-8 md:mt-4 md:h-6 md:w-6 lg:h-7 lg:w-7 sm:h-4 sm:w-4 sm:col-start-7 sm:mt-3 bg-white rounded-full group-hover:bg-violet group-focus:bg-violet">
      <i className="fas fa-circle text-black"></i>
      </span>
    </Link>
    
    <Link className="group xl:w-56 xl:h-56 lg:w-48 lg:h-48 md:w-44 md:h-44 sm:h-32 sm:w-32 row-start-4 col-start-7 border-2 rounded-lg border-zinc-100 grid grid-cols-8 grid-rows-4 hover:border-violet hover:text-violet  hover:scale-110 transition-transform duration-300" to ='/dev/register'>
        <p className="grid row-start-3 col-start-2 col-span-6 lg:text-lg md:text-sm sm:text-sm">
          Register as a junior developer
        </p>
        <span className="flex items-center justify-center md:col-end-8 md:mt-4 md:h-6 md:w-6 lg:h-7 lg:w-7 sm:h-4 sm:w-4 sm:col-start-7 sm:mt-3 bg-white group-hover:bg-violet rounded-full">
        <i className="fas fa-circle text-black"></i>
        </span>
        </Link>
      
      {/* <div className="xl:mt-[100px] xl:col-start-5 xl:ml-[105px] lg:row-start-7 lg:col-end-7 lg:ml-3 lg:mt-6 md:row-start-7 md:col-start-6 sm:row-start-6 sm:col-start-6 sm:mt-4">
        <button className="xl:w-32 xl:text-lg font-semibold h-7 w-20 rounded-3xl bg-violet flex justify-center hover:scale-125 transition-transform duration-300">
          Register
        </button>
      </div> */}
    </div>
  );
};
export default RegisterAs;
