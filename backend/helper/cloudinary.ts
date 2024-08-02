import cloudinary from 'cloudinary'
import dotenv from'dotenv'
dotenv.config()

cloudinary.v2.config({
  cloud_name: process.env.CLOUD_NAME as string,
  api_key:  process.env.CLOUDINARY_API_KEY as string,
  api_secret: process.env.CLOUDINARY_API_SECRET as string
});


  const getPublicUrl = async (url: string) => {
  const arr = url.split('/');
  const id = arr[arr.length - 1].split('.')[0];
  return id
};

 async function deleteFile(url:string,resoureType:string) {
    try {
      const publicId = await getPublicUrl(url)
      console.log('public_id = ',publicId)
      const result = await cloudinary.v2.uploader.destroy(publicId, { resource_type: resoureType });
      console.log(result);
      return result
    } catch (error) {
      console.error(error);
    }
  }

  export default deleteFile