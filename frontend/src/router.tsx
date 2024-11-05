import React from "react"
import { BrowserRouter as Router,Routes,Route } from "react-router-dom"
import Login from "./pages/login"
import RegisterAs from "./pages/registeras"
import Register from "./pages/developer/registrartion"
import VerifyOtp from "./pages/verifyOtp"
import CompanyRegistration from "./pages/company/registration"
import { Homepage } from "./pages/homePage"
import AdminHome from "./admin/adminHome"
import ProtectedRoute from "./protectedRoute"

import PageNotFound from "./pages/404"

import DeveloperRoute from "./Routes/developerRoute"
import CompanyRoute from "./Routes/companyRoute"

import AllJobs from "./pages/jobs"


const App:React.FC = ()=>{
  return(
    <Router>
    <Routes>
      <Route path="/" element={<Homepage/>} />
       <Route  path="/registerAs"  element={<RegisterAs/>}/>

       
        <Route path="/job" element={<AllJobs/>} />
      {/* developer */}
      <Route  path="/dev/login"  element={<Login data={'dev'}/>}/>
       <Route path="/dev/register" element={<Register />}/>
       <Route path="/dev/register/verifyOtp" element={<VerifyOtp data={'dev'}/>}/>
       <Route path="/dev/*"  element={<ProtectedRoute role={'dev'}/>}>
         <Route path="*" element={<DeveloperRoute/>} />
      </Route>
      

       
       {/* company */}
       <Route path='/company/register' element={<CompanyRegistration/>}/>
       <Route path='/company/register/verifyOtp' element={<VerifyOtp data={'company'}/>}/>
       <Route  path="/company/login"  element={<Login data={'company'}/>}/>
       <Route path="/company/*" element={<ProtectedRoute role={'company'}/>}>
        <Route path="*" element={<CompanyRoute/>} />
       </Route>

      

       {/* Admin */}
       <Route path="/admin/" element={<AdminHome data={'dashboard'} />}/>
       <Route path="/admin/login"  element={<Login data={'Admin'}/>} />
       <Route path="/admin/developers" element={<AdminHome data={'dev'}/>}/>
       <Route path="/admin/companies" element={<AdminHome data={'company'}/>}/>
       <Route path="/admin/dashboard" element={<AdminHome data={'dashboard'}/>}/>
       <Route path="*" element={<PageNotFound/>} />
       <Route path="*" element={<PageNotFound/>}/>
    </Routes>
    </Router>
  )
}
export default App