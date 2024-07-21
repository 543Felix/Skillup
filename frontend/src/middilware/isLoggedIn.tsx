import { Navigate,Outlet } from "react-router-dom"
import { useSelector } from "react-redux"
import { RootState } from "../store/store"
import React from "react"

interface Props{
    role:'dev'|'company'
}

const LoggedIn:React.FC<Props> = ({role})=>{
    const id = useSelector((state:RootState)=>{
        return role==='dev'?state.developerRegisterData._id:role==='company'?state.companyRegisterData._id:''
    })
  
    
    return id? <Outlet/>: <Navigate to="/" />
 
} 

export default LoggedIn