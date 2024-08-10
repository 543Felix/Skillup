import React, { useState,useEffect,useCallback } from "react";
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
import AxiosInstance from "../../../utils/axios";


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

interface DashboardData{
  DeveloperCount:number;
  CompaniesCount:number;
  jobsCount:number;
  totalIncome:number;
}

const DashBoard: React.FC = () => {
   const [dashBoardData,setDashBoardData] = useState<DashboardData|null>()
   const [selectedRangeDevelopers, setSelectedRangeDevelopers] = useState< "last7days" | "last30days" | "last90days" |'allTime'>("last30days");
   const [selectedRangeCompanies, setSelectedRangeCompanies] = useState< "last7days" | "last30days" | "last90days" |'allTime'>("last30days");
   const [devCount,setDevCount] = useState<number[]>([])
   const [companyCount,setCompanyCount] = useState<number[]>([])

   const fetchDeveloperChart = useCallback(()=>{
    AxiosInstance.get(`/admin/chartData/?period=${selectedRangeDevelopers}&role=dev`)
    .then((response)=>{
      console.log(response)
      const counts = response.data.map((item:{_id:string;count:number})=>item.count)
      setDevCount(counts)
    })
   },[selectedRangeDevelopers])
 
    const fetchCompanyData = useCallback(()=>{
      AxiosInstance.get(`/admin/chartData/?period=${selectedRangeCompanies}&role=companies`)
      .then((response)=>{
        console.log(response.data)
        const counts = response.data.map((item:{_id:string;count:number})=>item.count)
        setCompanyCount(counts)
      })
    },[selectedRangeCompanies])

  useEffect(()=>{
AxiosInstance.get('/admin/dashBoard')
.then((response)=>{
const {DeveloperCount,CompaniesCount,jobsCount,totalIncome} = response.data
setDashBoardData({DeveloperCount,CompaniesCount,jobsCount,totalIncome})
})
fetchDeveloperChart()
fetchCompanyData()
  },[fetchDeveloperChart,fetchCompanyData])
 
  const generatePlaceholderLabels = (dataLength: number) => {
    return Array.from({ length: dataLength }, (_, i) => i + 1);
  };
 
  const chartDataDevelopers = {
    labels: generatePlaceholderLabels(devCount.length),
    datasets: [
      {
        label: "Developers",
        data: devCount,
        borderColor: "violet",
        fill: false,
        tension: 0.5,
      },
    ],
  };

  const chartDataCompanies = {
    labels: generatePlaceholderLabels(companyCount.length),
    datasets: [
      {
        label: "Companies",
        data: companyCount,
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
        max: Math.max(...devCount, ...companyCount) +3, 
        ticks: {
          stepSize: 1,
        },
        grid: {
          display: false,
        },
      },
    },
  };
  
  return (


    <div className="flex flex-col space-y-5 h-screen w-full py-16 px-10">
      <div className="flex space-x-8">
        <div className="flex flex-col space-y-3 text-white bg-black h-[180px] w-[250px] p-2 rounded-lg justify-center items-center">
          <h1 className="font-semibold text-4xl">Developers</h1>
          <h1 className="text-3xl font-bold">{dashBoardData?.DeveloperCount}</h1>
        </div>
        <div className="flex flex-col text-white bg-black h-[180px] w-[250px] p-2 rounded-lg justify-center items-center">
          <h1 className="font-semibold text-4xl">Companies</h1>
          <h1 className="text-3xl font-bold">{dashBoardData?.CompaniesCount}</h1>
        </div>
        <div className="flex flex-col text-white bg-black h-[180px] w-[250px] p-2 rounded-lg justify-center items-center">
          <h1 className="font-semibold text-4xl">Total income</h1>
          <h1 className="text-3xl font-bold">{dashBoardData?.totalIncome}</h1>
        </div>
        <div className="flex flex-col text-white bg-black h-[180px] w-[250px] p-2 rounded-lg justify-center items-center">
          <h1 className="font-semibold text-4xl">Jobs</h1>
          <h1 className="text-3xl font-bold">{dashBoardData?.jobsCount}</h1>
        </div>
      </div>


      <div className="flex w-full space-x-5">
        <div className="w-1/2">
          <select
            className="bg-black w-full text-white p-2 rounded-lg"
            value={selectedRangeDevelopers}
            onChange={e =>
              setSelectedRangeDevelopers(
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
              <Line data={chartDataDevelopers} options={options} />
            </div>
          </div>
        </div>
        <div className="w-1/2">
          <select
            className="bg-black w-full text-white p-2 rounded-lg"
            value={selectedRangeCompanies}
            onChange={e =>
              setSelectedRangeCompanies(
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
            <div className="h-[280px] max-w-1/2">
              <Line data={chartDataCompanies} options={options} />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DashBoard;




