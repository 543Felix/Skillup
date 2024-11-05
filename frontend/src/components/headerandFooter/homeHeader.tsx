import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";

const HomeHeader:React.FC = ()=>{

    
    const [showMenu, setShowMenu] = useState(false);
    const [isDropdownOpen, setIsDropdownOpen] = useState(false);
    const navigate = useNavigate()
    const toggleDropdown = () => {
        setIsDropdownOpen(!isDropdownOpen);
    };

return(
    <nav className="fixed top-0 left-0 w-full bg-black border-b-2 border-violet text-white h-16 flex items-center  justify-between px-4 z-10">
    <div className="flex items-center">
      <img src="/developer/logo.png" alt="Logo" className="h-12" onClick={()=>navigate('/')} />
    </div>
    {/* <div className="hidden sm:flex  justify-center">
      <ul className="flex space-x-4">
        <li>
         <Link to={'/job'}>Jobs</Link></li>
      </ul>
    </div> */}
    <div className="hidden sm:flex justify-end space-x-2">
    <div className="relative">
    <button onClick={()=>navigate('/job')} className="px-4 py-1 hover:scale-110 transition-transform duration-500">
    Jobs
            </button>
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
  </nav>
)
}

export default HomeHeader