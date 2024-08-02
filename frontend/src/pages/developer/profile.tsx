import React,{ useState } from 'react'
import Loader from '../loader';
import ProfileCardWithData from '../../components/profile/profileImageandData';
import RoleAndDescription from '../../components/profile/profileRoleAndDescription';
import AddSkill from '../../components/profile/addSkills';
import Certificates from '../../components/profile/certificates';
import AddResume from '../../components/profile/addResume';
import WorkExpierience from '../../components/profile/addWorkExpierience';

interface MyComponentProps {
  role:string
}


const DeveloperProfile:React.FC<MyComponentProps> = ({role})=>{
  const [loader,setLoader] = useState(false)
    return(
      <>
      {loader&&(
        < Loader/>
      )}
        <div className="flex flex-col space-y-2 w-[900px] text-white z-0">
        <div className="flex   text-white ">
          <ProfileCardWithData setLoader={setLoader} role={role} />
          <RoleAndDescription  setLoader={setLoader} />
        </div>
         <AddSkill role={role}/>
        <Certificates setLoader={setLoader}/>
        <WorkExpierience role={role} />
       <AddResume setLoader={setLoader} />
      </div>
      {/* <div>
        <button className='text-white'>upload resume</button>
      </div>
      </div> */}
     
      
      
      </>

    )
}

export default DeveloperProfile