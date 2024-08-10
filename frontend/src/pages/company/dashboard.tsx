import {useCallback, useState,useEffect} from 'react'
import AxiosInstance from '../../../utils/axios';
import { Line } from "react-chartjs-2";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  LineController,
} from "chart.js";
import { useSelector } from 'react-redux';
import { RootState } from '../../store/store';
import { PieChart  } from '@mui/x-charts/PieChart'



ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  LineController
);

interface dashboardData{
  totaljobsApplied:number;
  selectedCount:number;
  jobsCount:number;
}

const CompanyDashboard = ()=>{


  const [range,setRange]    = useState<"last7days" | "last30days" | "last90days" |'allTime'>('last30days')
  const [dashboardData,setDashboardData] = useState<dashboardData|null>(null)
  const [appliedDevCount,setAppliedDevCount] = useState<number[]>([])
  const id:string = useSelector((state:RootState)=>{
   return state.companyRegisterData._id
  })
  const fetchAppliedJobsChart = useCallback(()=>{
    AxiosInstance.get(`/company/jobChart/?companyId=${id}&range=${range}`)
    .then((response)=>{
    if(response.data){
      const counts = response.data.map((item:{_id:string;count:number})=>item.count)
      setAppliedDevCount(counts)
    }
    })
  },[id,range])
  const generatePlaceholderLabels = (dataLength: number) => {
    return Array.from({ length: dataLength }, (_, i) => i + 1);
  };
  useEffect(()=>{
    if(id.length>0){
      AxiosInstance.get(`/company/dashboard/?id=${id}`)
      .then((response)=>{
        if(response.data){
          setDashboardData(response.data)
        }
      })
      fetchAppliedJobsChart()
    }
   
  },[id,fetchAppliedJobsChart])

  const appliedJobs = {
    labels: generatePlaceholderLabels(appliedDevCount.length),
    datasets: [
      {
        label: "Applied jobs",
        data: appliedDevCount,
        borderColor: "cyan",
        fill: false,
        tension: 0.5,
      },
    ],
  };

  const options = {
    plugins: {
      legend: {
        display: false, 
      },
    },
    scales: {
      x: {
        display: false, 
        grid: {
          display: false,
        },
      },
      y: {
        min: 0,
        max: Math.max(...appliedDevCount)+2, 
        ticks: {
          stepSize: 1,
        },
        grid: {
          display: false,
        },
      },
    },
  };

  return(
    <div className='w-screen flex justify-center items-center'>
       <div className="overflow-y-hidden flex flex-col justify-center items-center space-y-10">
       <div className="flex justify-center space-x-10">
        <div className="bg-black text-white p-10 flex flex-col items-center justify-center rounded-[15px]">
            <h1 className="text-3xl font-semibold">Total jobs posted</h1>
            <span className="text-2xl font-bold">{dashboardData?.jobsCount?dashboardData?.jobsCount:0}</span>
        </div>
        <div className="bg-black text-white p-10 flex flex-col items-center justify-center rounded-[15px]">
            <h1 className="text-3xl font-semibold" >Total applied</h1>
            <span className="text-2xl font-bold" >{dashboardData?.totaljobsApplied?dashboardData?.totaljobsApplied:0}</span>
        </div>
        <div className="bg-black text-white p-10 flex flex-col items-center justify-center rounded-[15px]">
            <h1 className="text-3xl font-semibold" >Total selected</h1>
            <span className="text-2xl font-bold" >{dashboardData?.selectedCount?dashboardData?.selectedCount:0}</span>
        </div>
       </div>
        <div  className='w-full flex  justify-between items-center  text-white'>
        <div className="w-1/2">
          <select
            className="bg-black w-full text-white p-2 rounded-lg"
            value={range}
            onChange={e =>
              setRange(
                e.target.value as "last7days" | "last30days" | "last90days" |'allTime'
              )
            }
          >
            <option value="last7days">Last 7 Days</option>
            <option value="last30days">Last 30 Days</option>
            <option value="last90days">Last 90 Days</option>
            <option value="allTime">All Time</option>
          </select>
          <div className="rounded-lg bg-black max-h-full max-w-full">
            <div className="h-[280px] max-w-[550px]">
              <Line data={appliedJobs} options={options} />
            </div>
          </div>
        </div>
        <div>
        
        <PieChart
      series={[
        {
          data: [
            { id: 0, value: dashboardData?.selectedCount as number??0, label: 'Selected' },
            { id: 1, value: Number(dashboardData?.totaljobsApplied as number - (dashboardData?.selectedCount as number)) ??0, label: 'Non-selected' },
          ],
        },
      ]}
      width={500}
      height={260}
     
    />
        </div>
        </div>
      
    </div>
    </div>
    
  )
}

export default CompanyDashboard