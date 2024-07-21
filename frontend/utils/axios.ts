import axios from 'axios'



const backendBaseUrl:string = import.meta.env.VITE_BACKEND_BASE_URL 
console.log('backendBaseUrl = ',backendBaseUrl)

const AxiosInstance = axios.create({
    baseURL : backendBaseUrl,
    withCredentials: true,
    headers: {
      'Content-Type': "application/json",
      'timeout' : 1000,
    }, 
})





export default AxiosInstance