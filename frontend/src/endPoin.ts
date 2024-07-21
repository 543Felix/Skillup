import AxiosInstance from "../utils/axios";

const devlogOut =async()=>{
   const response = await AxiosInstance.post('/dev/logOut',{})
   return response
}


export const endPoints ={
    devlogOut
}