import Developer from "../models/developerSchema";
import { ObjectId } from "mongodb"
import { Request, Response } from "express";
import {developerData,MySessionData} from "../types/interface";
import bcrypt from "bcrypt";
import {registerHelper} from '../helper/registationHelper'
import  Otp from '../models/otpSchema'
import Stripe from 'stripe'
import dotenv from 'dotenv'
dotenv.config()

const stripe = new Stripe(process.env.stripe_Secret_Key as string)

const Registration = async (req: Request, res: Response):Promise<Response<any, Record<string, any>>|undefined>=> {
  const { firstName, lastName, email, phoneNo, password } = req.body;
   const name = firstName+' '+lastName
  try {
    let data = await Developer.findOne({ name: name });
    if (data) {
     return res.status(400).json({ message: "user already exists" });
    } else {
      const hashedPassword = await bcrypt.hash(password, 10);

    await  new Developer({
        name: name,
        email: email,
        phoneNo: phoneNo,
        password: hashedPassword,
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
  new Developer({
    name:name as string,
    email:email as string,
    password:password as string
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
         return res.status(401).json({message:'invalid otp'})
        }
       
     }
   } catch (error) {
    res.status(500).json(error)
   }
  
  }
 

 
const Login =async (req:Request,res:Response):Promise<Response<any, Record<string, any>>|undefined>=>{
  const {name,password} = req.body
  try {
    const data:developerData|null = await Developer.findOne({name:name})
  if(data){
    if(data.isBlocked ===false){
       const passwordMatch = await bcrypt.compare(password,data.password)
   if(passwordMatch){
    let {name,email,_id,image} = data
    const token = registerHelper.generateToken({name,email}) 
    res.cookie('accessToken',token.accessToken,{httpOnly:true})
    res.cookie('refreshToken',token.refreshToken,{httpOnly:true})
   return res.status(200).json({message:'login successful',data:{name,email,_id,image}})
    
   }else{
   return  res.status(401).json({message:'password and userName are incorrect'})
   }
    }else{
         return  res.status(403).json({message:'user is blocked'})

    }
  
  }else{
    return res.status(404).json({message:'user not found'})
  }
  } catch (error) {
    res.status(500).json(error)
  }
  
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
  const {role,description} = req.body.data
  const objectId = new ObjectId(id as string)
  const data = await Developer.findOneAndUpdate({_id:objectId},{role:role,description:description})
if(data){
return res.status(200).json({message:'role and describtion updated',data})
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


const HandleSubscription = async(req:Request,res:Response)=>{
  try {
     const {subscriptionType,devId} = req.body
   
  // const line_items =
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
  success_url: 'http://localhost:5173/dev/payment-success',
  cancel_url: 'http://localhost:5173/dev/payment-error',
}); 

 if(session.id){

Developer.findOneAndUpdate(
    { _id: new ObjectId(devId as string) },
    {
        $push: { subscriptions: {subscriptionType:subscriptionType.mode} },
        $set: { appliedJobsCount: 0 }
    },
    { new: true } // Option to return the updated document
)
  .then(()=>{
  res.json({id:session.id})
  })
 }
  

  } catch (error) {
    
  }
 

}

const isBlocked = async(req:Request,res:Response)=>{
  const {id} = req.params
  const developer = await  Developer.findOne({_id:new ObjectId(id as string)})
  res.status(200).json({isBlocked:developer?.isBlocked})
}
// const webHookForPayment = async(req:Request,res:Response)=>{
  
// }



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
  resendOtp,
  registerWithGoogle,
  HandleSubscription,
  isBlocked
} 
