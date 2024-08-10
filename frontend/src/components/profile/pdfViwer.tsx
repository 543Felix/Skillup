import { useLocation } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCircleXmark } from "@fortawesome/free-regular-svg-icons";
import { useNavigate } from "react-router-dom";

const MyPDFViewer = () => {
  const location = useLocation()
  const navigate = useNavigate()
  const {url} = location.state
  console.log('url =',url )
    return (
        <div className=" z-20 top-0 bottom-0 left-0 fixed h-screen w-screen">
          <FontAwesomeIcon className=" absolute top-10 right-10 text-black h-12 bg-white rounded-full " onClick={()=>navigate(-1)} icon={faCircleXmark} />
  <iframe 
    src={url}
    className="w-screen h-screen" 
>
  </iframe>      
</div>

    );
};

export default MyPDFViewer;