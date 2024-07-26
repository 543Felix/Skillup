
import React,{useEffect} from 'react'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faCheckCircle } from '@fortawesome/free-regular-svg-icons'
import { useNavigate } from 'react-router-dom'

const Paymentsucess:React.FC = ()=>{
  const navigate = useNavigate()
  useEffect(()=>{
    const timeInterval = setTimeout(()=>{
       navigate('/dev/job')
    },4000)

    return()=>{
      clearTimeout(timeInterval)
    }
  },[navigate])
    return(
        <div className='absolute z-[9999] h-screen w-screen top-0 right-0 backdrop-blur-lg flex justify-center items-center'>
         <div className='h-[120px] w-[200px] flex flex-col justify-center items-center rounded-md bg-white'>
            <FontAwesomeIcon className='h-8  text-green-600' icon={faCheckCircle}  />
           <h1 className='text-xl font-semibold text-green-600'>Payment Success</h1>
         </div>
        </div>
    )
}
export default Paymentsucess
