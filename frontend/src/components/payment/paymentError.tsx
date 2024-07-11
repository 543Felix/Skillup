import React from 'react'

const Paymenterror:React.FC = ()=>{
    return(
        <div className='absolute h-screen w-screen top-0 right-0 backdrop-blur-xl flex justify-center items-center'>
         <div className='h-[120px] w-[200px] bg-white'>
           <h1 className='text-3xl text-red-600'>payment failed</h1>
         </div>
        </div>
    )
}
export default Paymenterror