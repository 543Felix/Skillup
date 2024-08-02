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
        <div className=' max:w-[900px] flex flex-col space-y-2 ' >
         <div className='flex '>
            <ProfileCardWithData setLoader={setLoader} role={role} />
            <CompanyData setLoader={setLoader} />
         </div>
        <div className=''>
        < AddSkill role={role}  />
         < Certificates setLoader={setLoader} />
        </div>
         
         {/* </div> */}
         
        </div>
        {loader&&(
         <Loader />
        )}
        </>
        
    )
}
export default CompanyProfile