const upload_preset:string = import.meta.env.VITE_UPLOAD_PRESET
const cloud_name:string = import.meta.env.VITE_CLOUD_NAME
// import cloudinary from 'clo'

const uploadImageToCloudinary = async(file)=>{
    try {
    const uploadData = new FormData()

    uploadData.append("file", file)
    uploadData.append("upload_preset", upload_preset)
    uploadData.append("cloud_name", cloud_name)

    const res = await fetch(`https://api.cloudinary.com/v1_1/${cloud_name}/image/upload`, {
        method: "post",
        body: uploadData
    })

    const data = await res.json()
    console.log('uploaded image data = ',data)
    return data.secure_url

    } catch (error) {
        console.log(error)
    }
    
}

export const uploadMultipleImagesToCloudinary = async(files)=>{
try {
    const urls:string[] =[]
    for(const file of files){
        const url = await uploadImageToCloudinary(file)
            urls.push(url)
        
    }
    return urls
} catch (error) {
   console.log(error)
}
}

// const getPublic_id = async(url)=>{
//     const arr = url.split('/')
//     const id = arr[arr.length-1].split('.')[0]
//     return id
    
// }

// export async function deleteImage(publicId) {
//     try {
//       const result = await cloudinary.uploader.destroy(publicId, { resource_type: "raw" });
//       console.log(result);
//     } catch (error) {
//       console.error(error);
//     }
//   }
  

export default uploadImageToCloudinary