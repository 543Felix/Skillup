import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPenToSquare } from "@fortawesome/free-regular-svg-icons";
import IconCloud from '../ui/icon-cloud'
import { useNavigate } from "react-router-dom";

const slugs = [
  "typescript",
  "javascript",
  "dart",
  "java",
  "react",
  "flutter",
  "android",
  "html5",
  "css3",
  "nodedotjs",
  "express",
  "nextdotjs",
  "prisma",
  "amazonaws",
  "postgresql",
  "firebase",
  "nginx",
  "vercel",
  "testinglibrary",
  "jest",
  "cypress",
  "docker",
  "git",
  "jira",
  "github",
  "gitlab",
  "visualstudiocode",
  "androidstudio",
  "sonarqube",
  "figma",
];

export function IconCloudDemo() {

  const navigate = useNavigate()
  return (
    <div className='flex w-full justify-between items-center bg-black '>
      <div className='text-white flex flex-col justify-center  items-center space-y-4 ml-16'>
        <h1 className='text-4xl font-bold'>Change your style of work, it's easy</h1>
        <div className=" max-w-lg flex flex-col space-y-4">
          <div>
          <div className="flex items-center space-x-2  ">
          <FontAwesomeIcon icon={faPenToSquare} className="h-5" />
          <h1 className="text-2xl font-semibold">No cost to join</h1>
        </div>
        <p className="font-thin text-lg ml-7 break-words">Register and browse talented profiles to make your work easy</p>
          </div>
          <div>
          <div className="flex items-center space-x-2">
          <svg xmlns="http://www.w3.org/2000/svg" fill="none" aria-hidden="true" viewBox="0 0 24 24" role="img" height="23">
  <path vector-effect="non-scaling-stroke" stroke="white" stroke-linecap="round" stroke-linejoin="round" stroke-miterlimit="10" stroke-width="1.5" d="M15 19l.3-.3c2.8-2.8 2.8-7.2 0-10C12.5 6 8 6 5.3 8.8L5 9l10 10z"></path>
  <path vector-effect="non-scaling-stroke" stroke="white" stroke-linecap="round" stroke-linejoin="round" stroke-miterlimit="10" stroke-width="1.5" d="M17 11.5l3.3-3.3c.4-.4.4-1 0-1.4l-3.1-3.1c-.4-.4-1-.4-1.4 0L12.5 7M10 14l-7 7"></path>
</svg>
<h1 className="text-2xl font-semibold">Post a job and hire top talent</h1>
          </div>
          <p className="font-thin text-lg ml-7 break-words">Finding talent doesn’t have to be a chore. Post a job and find the developer which suits your role</p>
          </div>
           <div className="flex w-full justify-center items-center">
            <button className="bg-violet px-5 py-1 rounded-lg font-bold text-xl" onClick={()=>navigate('/company/register')}>Register as Company</button>
           </div>
          
        </div>
        
      </div>
      <div className="relative flex size-full max-w-lg items-center justify-center overflow-hidden   bg-background px-20 pb-24 pt-8 ">
      
      <IconCloud iconSlugs={slugs} />
    </div>
    </div>
    
  );
}
