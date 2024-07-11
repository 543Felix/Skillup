import { Navigate,Outlet } from "react-router-dom"
import { useSelector } from "react-redux"
import { RootState } from "./store/store"
import React from "react"

interface Props{
    role:'dev'|'company'
}

const ProtectedRoute:React.FC<Props> = ({role})=>{
    const data = useSelector((state:RootState)=>{
        return role==='dev'?state.developerRegisterData._id:role==='company'?state.companyRegisterData._id:''
    })
    
    return data? <Outlet/>: <Navigate to='/' />
 
} 

export default ProtectedRoute