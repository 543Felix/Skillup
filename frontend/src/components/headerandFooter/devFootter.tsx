import React from 'react'

const Footer:React.FC = ()=>{
    return(
        <footer className=" bottom-0 left-0 w-full bg-black text-white text-center py-4 text-xl">
        &copy; {new Date().getFullYear()} upSkill
     </footer>
    )
}
 
export default Footer