import Developer from "../models/developerSchema";
import { ObjectId } from "mongodb"
import { Request, Response } from "express";
import {developerData,MySessionData} from "../types/interface";
import bcrypt from "bcrypt";
import {registerHelper} from '../helper/registationHelper'
import  Otp from '../models/otpSchema'
import Stripe from 'stripe'
// import Meeting from '../models/meetingShema'
import cron from 'node-cron'
import dotenv from 'dotenv'
dotenv.config()
import deleteFile from '../helper/cloudinary'
import Company from "../models/companySchema";

const stripe = new Stripe(process.env.stripe_Secret_Key as string)

const Registration = async (req: Request, res: Response):Promise<Response<any, Record<string, any>>|undefined>=> {
  const { firstName, lastName, email, phoneNo, password } = req.body;
   const name = firstName+' '+lastName
  try {
    let data = await Developer.findOne({ name: name });
    if (data) {
      if(data.isVerified===false){
        (req.session as MySessionData).developersessionData = {
          name: name,
          email: email
        };
        let otp: number = registerHelper.generateOtp();
        console.log('otp = ',otp)
      await new Otp({
          otp: otp,
          name: name
        }).save();
         registerHelper.sendOTP(email, otp).then(()=>{
          res.status(200).json({ message: "check your mail for otp"});
         })
      }else{
        return res.status(400).json({ message: "user already exists" });
      }
    } else {

      const hashedPassword = await bcrypt.hash(password, 10);
      const startDate = new Date()
      let endDate = new Date(startDate)
      endDate.setDate(endDate.getDate()+28)
    await  new Developer({
        name: name,
        email: email,
        phoneNo: phoneNo,
        password: hashedPassword,
        subscriptions:[
          {
            planName: 'Free',
           startDate:startDate,
           endDate:endDate,
           isExpired:false
          }
        ]
      }).save();

      (req.session as MySessionData).developersessionData = {
        name: name,
        email: email
      };
      let otp: number = registerHelper.generateOtp();
      console.log('otp = ',otp)
    await new Otp({
        otp: otp,
        name: name
      }).save();
       registerHelper.sendOTP(email, otp).then(()=>{
        res.status(200).json({ message: "check your mail for otp"});
       })
      
    }
  } catch (error) {  
    res.status(500).json(error)
  }
 
};

const registerWithGoogle =async(req: Request, res: Response)=>{
  try {
    const {name,email,password} = req.body
  const Data = await Developer.findOne({name:name})
  if(!Data){
    const startDate = new Date()
      let endDate = new Date(startDate)
      endDate.setDate(endDate.getDate()+28)
  new Developer({
    name:name as string,
    email:email as string,
    password:password as string,
    subscriptions:[
          {
            planName: 'Free',
           startDate:startDate,
           duration:endDate,
           isExpired:false
          }
        ]
  }).save()
  .then(()=>{
    Developer.findOne({name:name}).then((devData)=>{
      if(devData){
        const {name,email,_id,image} = devData
        const token = registerHelper.generateToken({name,email}) 
             res.cookie('accessToken',token.accessToken,{httpOnly:true})
             res.cookie('refreshToken',token.refreshToken,{httpOnly:true})
           return res.status(200).json({message:'Registeration successfull',data:{_id,image}})
      }
      
    })
  })
  }else{
    res.status(400).json({message:'user Already exists'})
  }
  } catch (error) {
    res.status(500).json(error)
  }
  
}
const verifyRegistration= async(req:Request,res:Response):Promise<Response<any, Record<string, any>>|undefined>=>{
   const data = (req.session as MySessionData).developersessionData
   try {
    if(data){
      let name:string|undefined = data.name
      let email:string|undefined = data.email
        let hasOtp = await Otp.findOne({name:name})
        if(hasOtp?.otp === Number(req.body.otp)){
         let devData =  await Developer.findOneAndUpdate({name:name,email:email},{isVerified:true})
         if(devData){
          let {_id,image,name} = devData
          delete (req.session as MySessionData).developersessionData;
           const token = registerHelper.generateToken(data) 
           res.cookie('accessToken',token.accessToken,{httpOnly:true})
           res.cookie('refreshToken',token.refreshToken,{httpOnly:true})
         return res.status(200).json({message:'Rgisteration successfull',data:{_id,image,name}})
         }else{
          res.status(404).json({message:'user verification failed'})
         }
         
        }else{
         return res.status(400).json({message:'invalid otp'})
        }
       
     }
   } catch (error) {
    res.status(500).json(error)
   }
  
  }
 

 
const Login =async (req:Request,res:Response):Promise<Response<any, Record<string, any>>|undefined>=>{
  const {name,password} = req.body
  try {
    const data:developerData[] = await Developer.find({name:name})
  if(data.length>0){
   const passwordMatch = await bcrypt.compare(password,data[0].password)
   if(passwordMatch){
    let {name,email,_id,image} = data[0]
    const token = registerHelper.generateToken({name,email}) 
    res.cookie('accessToken',token.accessToken,{httpOnly:true})
    res.cookie('refreshToken',token.refreshToken,{httpOnly:true})
   return res.status(200).json({message:'login successful',data:{name,email,_id,image}})
    
   }else{
   return  res.status(401).json({message:'password and userName are incorrect'})
   }
  }else{
    return res.status(404).json({message:'user not found'})
  }
  } catch (error) {
    res.status(500).json(error)
  }
  
}

const resendOtp = async(req:Request,res:Response)=>{
  try {
    const data = (req.session as MySessionData).developersessionData
    const cookieData = req.cookies.registrationData 
    if(data){
      let otp: number = registerHelper.generateOtp();
      console.log('otp = ',otp)
     await new Otp({
        otp: otp,
        name: data.name
      }).save();
      registerHelper.sendOTP(data.email, otp).then(()=>{
        res.status(200).json({ message: "check your mail for otp"});
      })
    }
  
  } catch (error) {
    res.status(500).json(error)
  }
  
}

const isBlocked = async(req:Request,res:Response)=>{
  const {id} = req.params
  const developer = await  Developer.findOne({_id:new ObjectId(id as string)})
  res.status(200).json({isBlocked:developer?.isBlocked})
}

const logOut =(req:Request,res:Response)=>{
  try { 
    res.clearCookie('accessToken')
    res.clearCookie('refreshToken')
  res.status(200).json({message:'logOut sucessful'})
  } catch (error) {
    res.status(500).json(error)
  }
  
}


// Profile 

const uploadProfilePic  = async(req:Request,res:Response)=>{
    const {id} = req.query
    const url = req.body.url
    const objectId = new ObjectId(String(id))
   await Developer.updateOne({_id:objectId},{image:url})
   Developer.findOne({_id:objectId}).then((data)=>{
      res.status(200).json({message:'image updated',data})
    }).catch((error)=>{
      res.status(500).json(error)
    })
  }

const profile = async(req:Request,res:Response)=>{
  try {
    const {id} = req.query
    const objectId = new ObjectId(String(id))
  let data = await Developer.findOne({_id:objectId})
  if(data){   
    res.status(200).json({data})
  }else{
    res.status(404).json({message:'No valid data'})
  }
  } catch (error) {
    res.status(500).json(error)
  }
  
}

const updateProfileData = async(req:Request,res:Response)=>{
  try {
    const {id} = req.query
    const {name,email,phoneNo} = req.body.formData
    const objectId = new ObjectId(String(id))
    let data = await Developer.findOne({_id:objectId})
    if(data){
      Developer.findOneAndUpdate({_id:objectId},{name:name,email:email,phoneNo:phoneNo}).then(()=>{
        Developer.findOne({ _id: objectId }).select({ name: 1, email: 1, phoneNo: 1, _id: 0 }).then((data) => {
          res.status(200).json({ message: 'profile updated', data });
        });
      })
    }
  } catch (error) {
    res.status(500).json(error)
  }
}

const updateRoleandDescription = async(req:Request,res:Response)=>{
  try {
    const {id} = req.query
  const {role,description,qualification} = req.body.data
  const objectId = new ObjectId(id as string)
  const data = await Developer.findOneAndUpdate({_id:objectId},{role:role,description:description,qualification:qualification})
if(data){
return res.status(200).json({message:'role and describtion updated'})
}else{
return res.status(404).json({message:'updataion failed'})
}
  } catch (error) {
    res.status(500).json(error)
  }
  
}

const updateSkills = async(req:Request,res:Response)=>{
  try {
    
const skills = req.body.data
const {id} = req.query
const objectId = new ObjectId(id as string)
const data = await Developer.findOneAndUpdate({_id:objectId},{skills:skills})
if(data){
  res.status(200).json({message:'skills updated',data:data.skills})
}else{
  res.status(404).json({message:'skills updation failed'})
}
  } catch (error) {
    res.status(500).json(error)
  }

}
const getWorkExperience = async(req:Request,res:Response)=>{
  const {id} = req.params
  Developer.aggregate([
    {$match:{_id:new ObjectId(id as string)}},
    {
    $addFields: {
      workExperience: {
        $map: {
          input: {
            $sortArray: {
              input: "$workExperience",
              sortBy: {
                startDate: -1  
              }
            }
          },
          as: "we",
          in: "$$we"
        }
      }
    }
  },{
    $project:{_id:0,workExperience:1}
  }
  ])
  .then((data)=>{
     res.status(200).json({workExperience:data[0].workExperience})
  })
}
const addWorkExpirence = async(req:Request,res:Response)=>{
  const {id,workData} = req.body
  const {companyName,role,startDate,endDate} = workData
 Developer.findOneAndUpdate(
  { _id: new ObjectId(id as string) },
  {
    $push: { workExperience: { companyName, role, startDate,endDate } }
  },
  {
    new: true
  }
).then((data)=>{
    res.status(200).json({data})
  }).catch(()=>{
    res.status(404).json({message:'user not found'})
  })
}

const deleteWorkExperience = async(req:Request,res:Response)=>{
  const {id,workId} = req.params
  Developer.findOneAndUpdate({_id:new ObjectId(id as string)},
    {
      $pull:{workExperience:{_id:new ObjectId(workId as string)}}
    }
  ).then(()=>{
    res.status(200).json({messsage:'work experience deleted successfully'})
  })
  .catch(()=>{
    res.status(500).json({messsage:'An error occured while updating'})
  })
}
const updateWorkExperience = async(req:Request,res:Response)=>{
const {id,workData} = req.body
let data = await Developer.updateOne(
  { _id: new ObjectId(id as string), "workExperience._id": new ObjectId(workData._id as string) },
  { $set: { "workExperience.$": workData } }
);
if(data){
  res.status(200).json({message:'successfully updated your  workExperience'})
}

}

const uploadCertificates = async(req:Request,res:Response)=>{
  const {id,url,certificateName} = req.body
  console.log('data = ',{id,url,certificateName})
  Developer.findOneAndUpdate({_id: new ObjectId(id as string)},
{$addToSet:{certificates:{url,certificateName}}})
.then((data)=>{
  console.log('updated Data = ',data)
  res.status(200).json({message:'certificate Succesfully updated'})
})
.catch(()=>{
  res.status(500).json({message:'An unexpected error occured while updating data'})
})

}

 const deleteCertificate = async(req:Request,res:Response)=>{
  const {id,url,resourcetype} = req.body
     console.log('data = ',{id,url,resourcetype})
    const data = await deleteFile(url,resourcetype)
    console.log('data = ',data)
    if(data.result==='ok'){
         Developer.findOneAndUpdate({_id: new ObjectId(id as string)},
        {
          $pull:{certificates:{url:url}}
        }).then((data)=>{
          console.log('successfully updated  =  ',data)
          res.status(200).json({message:'certificate sucessfully deleted'})
        }).catch((error)=>{
          console.log('An error occured while editing data = ',error)
        })
    }
 }

 const uploadResume = async(req:Request,res:Response)=>{
    const {id,url} = req.body
    console.log('data on upload Resume = ',{id,url})
    Developer.findOneAndUpdate({_id:new ObjectId(id as string)},{$set:{resume:url}})
    .then(()=>{
      res.status(200).json({message:'resume uploaded successfully'})   
    }).catch(()=>{
      res.status(500).json({message:'An unexpected error occured while updating resume'})
    })
 }

 const getResume = async(req:Request,res:Response)=>{
  const {id} =  req.params
 let data = await Developer.findOne({_id: new ObjectId(id as string)})
 if(data){
  const {resume} = data
  res.status(200).json({resume})
 }
 }

 const getDevelopers =  async(req:Request,res:Response)=>{
  Developer.aggregate([
    {
      $match: {
        role: { $exists: true, $ne: "" },               
        description: { $exists: true, $ne: "" },        
        skills: { $exists: true, $not: { $size: 0 } }   
      }
    },{$project:{name:1,role:1,image:1}}
  ])
  .then((data)=>{
    res.status(200).json(data)
  })
 }


//  Subscription 

const HandleSubscription = async(req:Request,res:Response)=>{
  try {
    console.log('come to subscription backend')
     const {subscriptionType,devId} = req.body
   
const session = await stripe.checkout.sessions.create({
  payment_method_types: ['card'],
  line_items: [
    {
      price_data: {
        currency: 'usd',
        product_data: {
          name: subscriptionType.mode, // or another appropriate property
        },
        unit_amount: Math.round(subscriptionType.price * 100),
      },
      quantity: 1,
    },
  ],
  mode: 'payment',
  success_url: `${process.env.FrontEndUrl}dev/payment-success`,
  cancel_url: `${process.env.FrontEndUrl}dev/payment-error`,
}); 
console.log('session_id  = ',session.id)

 if(session.id){
  const duration = subscriptionType.mode==='Pro'?28:364
  const startDate = new Date()
  let endDate = new Date(startDate)
  endDate.setDate(endDate.getDate()+duration)
   const subscription = {
    planName : subscriptionType.mode,
    endDate : endDate,
    startDate :startDate,
    isExpired:false
  }
  await Developer.findOneAndUpdate(
  { _id: new ObjectId(devId as string) },
  {
    $set: { 'subscriptions.$[elem].isExpired': true }
  },
  {
    arrayFilters: [{ 'elem.isExpired': false }]
  }
);

 Developer.findOneAndUpdate(
  { _id: new ObjectId(devId as string) },
  {
    $push: { subscriptions: subscription },
    $set: { appliedJobsCount: 0 }
  }
)
  .then(()=>{
  res.json({id:session.id})
  })
 }

  } catch (error) {
    
  }
 

}





const checkSubscription = async()=>{
  const todaysDate = new Date()
  console.log('function is inwoked')
 await Developer.updateMany(
    { 
        'subscriptions.endDate': { $lt: todaysDate },
        'subscriptions.isExpired': true
    },
    {
        $set: {
            'subscriptions.$[elem].isExpired': false
        }
    },
    {
        arrayFilters: [{ 'elem.endDate': { $lt: todaysDate } }],
        multi: true
    }
);
}

cron.schedule('0 0 * * * ',()=>{
  checkSubscription()
})




export const developerController =  {
  Registration,
  verifyRegistration,
  Login,
  logOut,
  uploadProfilePic,
  profile,
  updateProfileData,
  updateRoleandDescription,
  updateSkills,
  addWorkExpirence,
  getWorkExperience,
  deleteWorkExperience,
  updateWorkExperience,
  uploadCertificates,
  deleteCertificate,
  uploadResume,
  getResume,
  resendOtp,
  registerWithGoogle,
  HandleSubscription,
  isBlocked,
  getDevelopers
} 
