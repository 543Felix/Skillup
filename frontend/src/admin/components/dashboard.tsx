import React from 'react'
import { BarChart,PieChart } from '@mui/x-charts';



const DashBoard:React.FC =()=>{

    

    return(
     <div className='flex flex-col space-y-5 h-screen w-full  ml-[220px] py-20 ' >
       <div className='flex  space-x-3 '>
        <div className='flex flex-col text-white bg-black h-[120px] w-[150px] p-2 rounded-lg justify-center items-center '>
            <h1 className='font-semibold text-2xl'>Users </h1>
            <h1 className='text-xl font-bold' >300</h1>
        </div> 
        <div className='flex flex-col text-white bg-black h-[120px] w-[180px] p-2 rounded-lg justify-center items-center '>
         <h1  className='font-semibold text-2xl' >Companies</h1>
         <h1 className='text-xl font-bold' >300</h1>
        </div>
        <div className='flex flex-col text-white bg-black h-[120px] w-[200px] p-2 rounded-lg justify-center items-center '>
            <h1 className='font-semibold text-2xl'>Total income</h1>
            <h1 className='text-xl font-bold' >500</h1>
        </div>
        <div className='flex flex-col text-white bg-black h-[120px] w-[150px] p-2 rounded-lg justify-center items-center '>
            <h1 className='font-semibold text-2xl'>Jobs</h1>
            <h1 className='text-xl font-bold' >500</h1>
        </div>
       </div>
       <div className= 'flex items-center justify-center rounded-lg bg-black h-[400px] w-[715px]' >
           <BarChart
           sx={{
   "& .MuiChartsAxis-left .MuiChartsAxis-tickLabel":{
    strokeWidth:"0.4",
    fill:"#feffff"
   },
   "& .MuiChartsAxis-tickContainer .MuiChartsAxis-tickLabel":{
       fontFamily: "Roboto",
    },
    "& .MuiChartsAxis-bottom .MuiChartsAxis-tickLabel":{
        strokeWidth:"0.5",
        fill:"#feffff"
     },
     "& .MuiChartsAxis-bottom .MuiChartsAxis-line":{
      stroke:"#feffff",
      strokeWidth:1
     },
     "& .MuiChartsAxis-left .MuiChartsAxis-line":{
      stroke:"#feffff",
      strokeWidth:1
     }
  }}
      xAxis={[
        {
          scaleType: 'band',
          data: ['group A', 'group B'],
        },
      ]}
     
      series={[
        { data: [4, 3] },
        { data: [1, 6] },
      ]}
      width={400}
      height={300}
    />

     <PieChart
      series={[
        {
          data: [
            { id: 0, value: 10, label: 'series A' },
            { id: 1, value: 15, label: 'series B' },
            { id: 2, value: 20, label: 'series C' },
          ],
        },
      ]}
      width={400}
      height={200}
    />

       </div>
      
     </div>
    )
}
export default DashBoard