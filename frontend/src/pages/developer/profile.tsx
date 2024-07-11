import React,{ useState } from 'react'
import Loader from '../loader';
import ProfileCardWithData from '../../components/profile/profileImageandData';
import RoleAndDescription from '../../components/profile/profileRoleAndDescription';
import AddSkill from '../../components/profile/addSkills';



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
      <div className=" h-[890px] w-[900px]  grid grid-rows-3 text-white z-0">
        <div className="row-start-1  grid grid-cols-4 text-white mb-10">
          <ProfileCardWithData setLoader={setLoader} role={role} />
          <RoleAndDescription  setLoader={setLoader} />
        </div>
         <AddSkill role={role}/>
        <div className="row-start-3 bg-slate-500 bg-opacity-[15%] shadow-xl shadow-black rounded-[15px] p-7 mt-2">
          <h1 className="text-2xl font-bold font-serif">Completed works</h1>
          <p className='text-base text-gray-600'>No completed works</p>
        </div>
      </div>
      
      
      </>

    )
}

export default DeveloperProfile