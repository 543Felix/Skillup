import React, {useEffect } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faSearch } from "@fortawesome/free-solid-svg-icons";
import { useNavigate } from "react-router-dom";
import HomeHeader from "../components/headerandFooter/homeHeader";

export const Homepage: React.FC = () => {
   const navigate = useNavigate()
  //  const [isDropdownOpen, setIsDropdownOpen] = useState(false);

  //  const toggleDropdown = () => {
  //      setIsDropdownOpen(!isDropdownOpen);
  //  };

   useEffect(()=>{
    const devData = localStorage.getItem('developerData')
    const companyData = localStorage.getItem('companyData')
    if(devData){
       navigate('/dev/')

    }
    if(companyData){
      navigate('/company/')
    }
    
   },[navigate])

  return (
    <div className=" bg- h-auto">
      {/* <nav className="fixed top-0 left-0 w-full bg-black border-b-2 border-violet text-white h-16 flex items-center  justify-between px-4 z-10">
        <div className="flex items-center">
          <img src="/developer/logo.png" alt="Logo" className="h-12" />
        </div>
        <div className="hidden sm:flex  justify-center">
          <ul className="flex space-x-4">
            <li>
             <Link to={'/job'}>Jobs</Link></li>
            <li>Company</li>
          </ul>
        </div>
        <div className="hidden sm:flex justify-end space-x-4">
        <div className="relative">
                <button onClick={toggleDropdown} className="px-4 py-2 hover:scale-110 transition-transform duration-500">
                    Login
                </button>
                {isDropdownOpen && (
                    <div className="absolute flex right-0 mt-2 bg-black w-28 justify-center py-3 rounded-lg shadow-md">
                        <ul>
                            <li className="hover:bg-white hover:text-black" >
                                <Link to="/dev/login">Developer</Link>
                            </li>
                            <li className="hover:bg-white hover:text-black" >
                                <Link to="/company/login">Company </Link>
                            </li>
                        </ul>
                    </div>
                )}
            </div>
          
          <Link to="/registerAs">
            <button className="bg-black border-2 border-violet text-white px-4 py-1 rounded-lg hover:scale-110 transition-transform duration-500">
              Sign Up
            </button>
          </Link>
        </div>
        <div className="sm:hidden flex items-center justify-end w-full">
          <button
            className="block text-white focus:outline-none"
            onClick={() => setShowMenu(!showMenu)}
          >
            {showMenu ? (
              <svg
                className="w-6 h-6"
                fill="currentColor"
                viewBox="0 0 20 20"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  fillRule="evenodd"
                  d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z"
                  clipRule="evenodd"
                />
              </svg>
            ) : (
              <svg
                className="w-6 h-6"
                fill="currentColor"
                viewBox="0 0 20 20"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  fillRule="evenodd"
                  d="M3 5a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zM3 10a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zM3 15a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1z"
                  clipRule="evenodd"
                />
              </svg>
            )}
          </button>
        </div>
        {showMenu && (
          <div className="sm:hidden absolute top-16 right-0 bg-black w-32 px-8 py-2">
            <ul className="space-y-2">
              <li>Jobs</li>
              <li>Company</li>
              <li>Login</li>
              <li>Signup</li>
            </ul>
          </div>
        )}
      </nav> */}
      <HomeHeader/>
      <div className="h-[300px] mt-[64px]  text-white   bg-[url('../developer/bannerImage2.jpg')] bg-cover font-semibold  font-kelly-slab sm:h-[450px]  ">
        <div className="bg-gradient-to-t from-transparent to-black h-[450px] w-full flex justify-center items-center  ">
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
              className="absolute xl:left-4  left-9 top-[22px] transform -translate-y-1/2 text-gray-200 sm:h-5 md:h-4 h-3"
            />
            <input
              className=" w-full bg-transparent border-2  border-white rounded-[40px] placeholder:text-gray-200  xl:px-9 px-14 sm:placeholder:text-base md:placeholder:text-lg lg:placeholder:text-lg xl:placeholder:text-xl  py-2 placeholder:font-serif focus:ring-0"
              placeholder="Search for jobs which match your profile"
              type="text"
            />
          </div>
           </div>
          
         
          </div>
          </div>
      </div>
      <div className="h-[600px] text-white">
         <h1 className="flex justify-center text-2xl font-serif  mt-[25px]">
          Discover jobs across popular roles
         </h1>
         <div className="my-[40px] mx-[60px] h-[350px] bg-white grid grid-cols-4 px-[50px] gap-x-8 py-[50px]">
          <div className="bg-gray-950 col-start-1"></div>
          <div className="bg-yellow-900 col-start-2"></div>
          <div className="bg-red-900 col-start-3"></div>
          <div className="bg-blue col-start-4"></div>
          </div>
        </div>
    
        <footer className="bottom-0 left-0 w-full bg-black text-white text-center py-4 text-xl">
           &copy; {new Date().getFullYear()} upSkill
        </footer>
    </div>
  );
};

