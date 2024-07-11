import React,{useState} from 'react'
// import CompanyHeader from '../header'
import ProfileCardWithData from '../../components/profile/profileImageandData'
import CompanyData from '../../components/profile/companyProfileData'
// import Specialities from './helperComponents/specialties'
import Certificates from '../../components/profile/certificates'
import Loader from '../loader'
import AddSkill from '../../components/profile/addSkills'

interface MyComponentProps {
  role:'dev' | 'company'
}

const CompanyProfile:React.FC<MyComponentProps> = ({role})=>{
  const [loader,setLoader] = useState(false)
    return(
        <>
        <div className='h-[900px] w-[900px] grid grid-rows-3 z-0 ' >
         <div className=' grid grid-cols-4'>
            <ProfileCardWithData setLoader={setLoader} role={role} />
            <CompanyData setLoader={setLoader} />
         </div> 
         < AddSkill role={role}  />
         < Certificates setLoader={setLoader} />
        </div>
        {loader&&(
         <Loader />
        )}
        </>
        
    )
}
export default CompanyProfile