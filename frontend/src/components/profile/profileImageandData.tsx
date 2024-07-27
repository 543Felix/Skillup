import React,{useState,useRef,useEffect,Dispatch,SetStateAction} from 'react'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faImage,faCircleXmark } from '@fortawesome/free-regular-svg-icons';
import { faPen } from '@fortawesome/free-solid-svg-icons';
import uploadImageToCloudinary from '../../../utils/cloudinary';
import AxiosInstance from '../../../utils/axios';
import { toast } from 'react-toastify';
import { useSelector,useDispatch } from 'react-redux';
import { RootState } from '../../store/store';
import { updateImage } from '../../store/slice/developerSlice';
import { updateCompanyImage } from '../../store/slice/companySlice';
// import { clearDeveloperData } from '../../store/slice/developerSlice';
// import { clearCompanyData } from '../../store/slice/companySlice';
// import { useNavigate } from 'react-router-dom';


interface MyComponentProps {
  setLoader: Dispatch<SetStateAction<boolean>>;
  role: string; 
}



const ProfileCardWithData:React.FC<MyComponentProps>= ({setLoader,role})=>{
  const id  = useSelector((state:RootState)=>{
        return role==='dev'?state.developerRegisterData._id:role ==='company'?state.companyRegisterData._id:null
      }) 
    
    const dispatch = useDispatch()
    // const navigate = useNavigate()
    const [uploadImageCard, setUploadImageCard] = useState(false);
    const [selectedImage,setSelectedImage] = useState<string|null>(null)
    const imageInputRef = useRef<HTMLInputElement | null>(null)
    const [file,setFile] = useState<File|null|undefined>(null)
    const [dataCard,setDataCard] = useState(false)
    const [devData,setDevData] = useState({
      name:'',
      email:'',
      phoneNo:'',
      image:''
    })
    const [image,setImage] = useState('')
    const [profileData,setProfileData] = useState({
      name:'',
      email:'',
      phoneNo:'',
    })
    const [formData,setFormData] = useState({
      name:'',
      email:'',
      phoneNo:'',
    })
    useEffect(() => {
      AxiosInstance.get(`/${role}/profile?id=${id}`)
      .then((res)=>{
        if(res){
          if(res.data.data){
            const {name,email,phoneNo,image} = res.data.data
            console.log('data',{name,email,phoneNo,image})
            setDevData({name,email,phoneNo,image})
            setFormData({name,email,phoneNo})
          }  
        }
        console.log('jkdsfa')
        
      }).catch((error)=>{
        console.log('error = ',error)
        // if(error.response.status === 401){
        //   toast.error(error.response.data.message)
        //   role==='dev'?dispatch(clearDeveloperData()):dispatch()
         
        //   navigate('/')
        // }
        // else if(error.response.status === 403){
        //   dispatch(clearDeveloperData())
        //   navigate('/')
        //   toast.error(error.response.data.message)
        // }
      })
    },[image,profileData,id,role]);

    function trigerInputFile(){
        imageInputRef.current?.click()
      }
    
      function handleFileChange(e: React.ChangeEvent<HTMLInputElement>){
        const file:File|undefined = e.target.files?.[0];
        setFile(file)
            if(file){
          const imageUrl = URL.createObjectURL(file)
          setSelectedImage(imageUrl)
        }
      }
      function uploadImage(file:(File|null|undefined)){
        if(file){
          setLoader(true)
          uploadImageToCloudinary(file)
          .then((data)=>{
            if(data){
              const url = data.url as string
              AxiosInstance.post(`/${role}/uploadProfile?id=${id}`,{url}).then(()=>{
                setUploadImageCard(false)
                const updatedData = JSON.stringify({
                  _id:id,
                  image:data
                })
                if(role==='dev'){
                  localStorage.setItem('developerData',updatedData)
                  dispatch(updateImage({image : url }))
                }
                else if(role==='company'){
                  localStorage.setItem('companyData',updatedData)
                  dispatch(updateCompanyImage({image : url }))
                  
                }
                setImage(data.url)
                toast.success('image uploaded  successfully')
              })
            }
          }).catch((error)=>{
            console.log(error)
          })
          .finally(()=>{
            setLoader(false)
          })
        }
      }
     
  function updateData(e :React.ChangeEvent<HTMLInputElement>){
    const {name,value} = e.target
    setFormData((prevData)=>({
      ...prevData,
      [name] : value,
    }))

  }

    function submitData(e:React.MouseEvent<HTMLButtonElement, MouseEvent>):void{
      e.preventDefault()
      if (!formData.name || !formData.email || !formData.phoneNo) {
        toast.error('Please fill in every field');
        return;
      } else if (!formData.name.match('^[A-Z][a-zA-Z]{2,28}(?: [a-zA-Z]+)*$')) {
        toast.error('This field should start with a capital letter with at least 3 characters');
        return;
      } else if(!/^[a-z0-9]+@gmail\.com$/.test(formData.email)) {
        console.log('invalid email address')
        toast.error('Invalid email address.')
        return;
      } else if (!formData.phoneNo.match('^\\d{10}$')) {
        toast.error('Enter a valid phone number');
        return;
      } else {
        console.log('entered to the else')
        AxiosInstance.post(`/${role}/profileData?id=${id}`, { formData })
          .then((res) => {
            if (res.status === 200) {
                toast.success('Profile updated');
                setProfileData(res.data.data)
                console.log('data = ',res.data.data)
            }
          })
          .catch((error) => {
            toast.error(error.message);
          })
          .finally(()=>{
            setDataCard(false)
          })
      }
    }

      return(
          <>
         
          <div className="col-start-1 bg-slate-500 bg-opacity-[15%] rounded-[15px] grid grid-rows-2 shadow-lg shadow-black">
              <div className="row-start-1 flex justify-center items-center">
                {devData && devData.image? <img src={`${devData.image}`} className='h-20 w-20 rounded-full'  onClick={() => {
                  setUploadImageCard(true);
                }}/>:
                <div
                className="p-4 border-4 border-white rounded-full"
                onClick={() => {
                  setUploadImageCard(true);
                }}
              >
                <FontAwesomeIcon
                  className="h-16 text-white"
                  icon={faImage}
                />
              </div>
                }
                
              </div>
              <div className="row-start-2 px-4 py-2 border-t items-center grid grid-rows-3  grid-cols-3">
                <div className="row-start-1 col-start-3 ml-8 border-2 rounded-full h-6 w-6 text-white  border-white flex justify-center items-center" onClick={()=>setDataCard(true)}> 
                  <FontAwesomeIcon
                    className="flex items-center h-3  w-3"
                    icon={faPen}
                  />
                </div>
                {
                  devData&&(
                    <>
                    <input defaultValue={devData.name} type="text" className="text-lg font-bold  row-start-1 col-span-2 bg-transparent  border-none focus:outline-none focus:ring-0 text-white" readOnly/>
                  <input defaultValue={devData.email} type="text" className="text-base font-light  row-start-2 col-span-3 bg-transparent border-none focus:outline-none focus:ring-0 text-white " readOnly/>
                  <input defaultValue={devData.phoneNo} type="text" className="text-base font-light  row-start-3 col-span-2 bg-transparent border-none focus:outline-none focus:ring-0 text-white " readOnly/>
                    </>
                  )
                }
                
              </div>
            </div>
            {uploadImageCard && (
          <div className="fixed top-0 left-0 z-30 w-full h-full flex justify-center items-center bg-black bg-opacity-45">
            <div className="h-[350px] w-[450px] bg-[#1F2937] rounded-[25px] p-5 ">
              <div className="flex justify-between">
                <h1 className="text-white text-2xl font-semibold">Edit photo </h1>
                <FontAwesomeIcon
                  className="h-6 text-white"
                  icon={faCircleXmark}
                  onClick={() => setUploadImageCard(false)}
                />
              </div>
              <div className="flex items-center">
    {selectedImage ? (
      <img src={selectedImage} alt='selected' className='h-[130px] mt-10 w-[130px]' />
    ) : (
      <>
      {devData.image ? (
          <img src={`${devData.image}`} alt='selected' className='h-[130px] mt-10 w-[130px] rounded-full' />
        ) : (
          <div className="border-4 h-[130px] mt-10 w-[130px] flex justify-center items-center border-white rounded-full">
          <FontAwesomeIcon className="h-20 text-white" icon={faImage} />
          </div>

        )}
      </>
        
    )}
  </div>

              <input ref={imageInputRef} type="file" name="" id="" hidden  onChange={handleFileChange}/>
              <div className="flex justify-end">
                <button className="text-xl text-lightViolet font-semibold  mr-4 " onClick={trigerInputFile}>
                  Change Image
                </button>
                <button className="bg-violet px-5 py-2 mt-2 text-white" onClick={()=>uploadImage(file)} >
                  Save Image
                </button>
              </div>
            </div>
          </div>
        )}
        {dataCard &&(
          <div className="fixed top-0 left-0 z-30 w-full h-full flex justify-center items-center bg-black bg-opacity-45">
              <div className="h-[350px] w-[450px] bg-[#1F2937] rounded-[25px] p-5 ">
                  <div className="flex justify-between">
                <h1 className="text-white text-2xl font-semibold">Edit Data </h1>
                <FontAwesomeIcon
                  className="h-6 text-white"
                  icon={faCircleXmark}
                  onClick={() => setDataCard(false)}
                />
                  </div> 
                  <form className='p-8 grid h-[300px] space-y-2 text-white' >
                    <input
          value={formData.name}
          name="name"
          type="text"
          className='border-2 border-white bg-transparent rounded-[10px] pl-4 focus:outline-none focus:ring-0 focus:border-white'
          onChange={(e)=>updateData(e)}
          required
          pattern='^[A-Z][a-zA-Z]{2,28}(?: [a-zA-Z]+)*$'
          title="Name must be at least 3 characters long, start with a capital letter, and contain only alphabets."
        />
        <input
          value={formData.email}
          name="email"
          type="text"
          className='border-2 border-white bg-transparent rounded-[10px] pl-4 focus:outline-none focus:ring-0 focus:border-white'
          onChange={updateData}
          required
          pattern='^[a-z0-9]+@gmail\.com$'
          title='Enter a valid email address'
        />
        <input
          value={formData.phoneNo}
          name="phoneNo"
          type="text"
          className='border-2 border-white bg-transparent rounded-[10px] pl-4 focus:outline-none focus:ring-0 focus:border-white'
          onChange={updateData}
          required
          pattern='^\d{10}$'
          title='Enter a valid contac no'
        />
            <div className='flex flex-col'>
                  <button className='bg-violet self-end px-4 py-2 rounded-[25px]' onClick={submitData} >Save changes</button>
                  </div>      
                  </form>
                  
              </div>
        </div>
      )}
        </>
    )
}
export default ProfileCardWithData