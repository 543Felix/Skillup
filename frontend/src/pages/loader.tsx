import React from 'react'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {faSpinner } from "@fortawesome/free-solid-svg-icons";

const Loader:React.FC =()=>{
    return(
        <div className='justify-center items-center flex fixed top-0 left-0 z-50 w-full h-full bg-black bg-opacity-45'>
        <FontAwesomeIcon className='text-white animate-spin h-16' icon={faSpinner} />
      </div>
    )
}
export default Loader