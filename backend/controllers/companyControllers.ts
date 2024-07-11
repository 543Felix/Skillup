import {Request,Response} from 'express'
import Company from '../models/companySchema'
import bcrypt from 'bcrypt'
import { companyData,MySessionData,OTP } from '../types/interface'
import { registerHelper } from '../helper/registationHelper'
import Otp from '../models/otpSchema'
import { AnyError, ObjectId } from 'mongodb'
import Chat from '../models/chatSchema'

const registation=async(req:Request,res:Response):Promise<Response<any, Record<string, any>>|undefined>=>{
   const { companyName,companyType,noOfEmployes, email, phoneNo, password }:companyData = req.body
   try {
    const data = await Company.find({companyName:companyName})
   if(!data||data.length === 0){
    const hashedPassword = await bcrypt.hash(password, 10);
    await new Company( { companyName,companyType,noOfEmployes, email, phoneNo, password:hashedPassword }).save();
      (req.session as MySessionData).companySessionData={
        companyName: companyName,
        email: email,
      };
    let otp:number = registerHelper.generateOtp()
    console.log('Companyotp = ',otp)
    const expirationTime = new Date(Date.now() + 60000)
    new Otp({
      otp:otp,
      name:companyName,
      expiration:expirationTime
    }).save()
    await registerHelper.sendOTP(email,otp)
    return res.status(200).json({ message: "check your mail for otp",});
   }else{
    return res.status(400).json({ message: "user already exists" });
   }
   } catch (error) {
     res.json(error)
   } 
   
}

const verifyRegistration = async(req:Request,res:Response):Promise<Response<any, Record<string, any>>|undefined>=>{
    const data = (req.session as MySessionData).companySessionData
    let otp:number = req.body.otp
    try {
      if(data){
        let name:string|null = data.companyName
        let email:string|null = data.email
          let hasOtp:OTP[] = await Otp.find({name:name})
          if(hasOtp[hasOtp.length-1].otp === Number(otp)){
             Company.findOneAndUpdate({companyName:name,email:email},{isVerified:true}).then(async (response)=>{
              delete (req.session as MySessionData).companySessionData
              const token = registerHelper.generateToken(data) 
              res.cookie('companyAcessToken',token.accessToken,{httpOnly:true})
              res.cookie('comapnyRefreshToken',token.refreshToken,{httpOnly:true})
             return res.status(200).json({message:'Rgisteration successfull',data:{_id:response?._id,image:response?.image,name:response?.companyName}})
              })
          }else{
           return res.status(401).json({message:'invalid otp'})
          }
       
      }
    } catch (error) {
      res.status(500).json(error)
    }
    
}

const Login = async(req:Request,res:Response):Promise<Response<any, Record<string, any>>|undefined>=>{
  const {name,password} = req.body
  try {
    let data:companyData | null = await Company.findOne({companyName:name})
  if(data){
    const {_id,image} = data
    const isBlocked:companyData | null = await Company.findOne({companyName:name,isBlocked:true})
    if(isBlocked){
        res.status(401).json({message:'user is blocked from the website'})
    }else{
      let passwordMatch = await bcrypt.compare(password,data.password)
  if(passwordMatch){
    let {companyName,email} = data
    const token = registerHelper.generateToken({companyName,email}) 
            res.cookie('companyAccessToken',token.accessToken,{httpOnly:true})
            res.cookie('companyRefreshToken',token.refreshToken,{httpOnly:true}) 
            return res.status(200).json({message:'login successful',data:{_id,image,name:companyName}})
  }else{
   return  res.status(400).json({message:'incorrect name and password'})
  }
    }
  
  }else{
   return res.status(404).json({message:'user not found'})
  }
  } catch (error){
    res.status(500).json(error)
  }
  
}

const logOut =async(req:Request,res:Response)=>{
  try {
    res.clearCookie('companyAccessToken')
    res.clearCookie('companyRefreshToken')
  res.status(200).json({message:'logout sucessful'})
  } catch (error) {
    res.status(500).json(error)
  }
  
}

const profile = async(req:Request,res:Response)=>{
  try {
    const {id} = req.query
 const objectId = new ObjectId(id as string)
 Company.findOne({_id:objectId})
 .then((data)=>{
  if(data){
    const {_id,email,phoneNo,companyType,noOfEmployes,image,website,overview,specialties,certificates,isVerified} =data
    const name = data?.companyName 
    res.status(200).json({data:{_id,name,email,phoneNo,companyType,noOfEmployes,image,website,overview,specialties,certificates,isVerified}})
  }else{
    res.status(404).json({mesage:'no data in database'})
  }
   
 })
  } catch (error) {
    res.status(500).json(error)
  }
 
}

const uploadProfilePic  = async(req:Request,res:Response)=>{
  try {
    const {id} = req.query
  const url = req.body.url
  const objectId = new ObjectId(String(id))
 await Company.updateOne({_id:objectId},{image:url})
 Company.findOne({_id:objectId}).then((data)=>{
    res.status(200).json({message:'image updated',data})
  })
  } catch (error) {
    res.status(500).json(error)
  }
  
}

const updateProfileData = async(req:Request,res:Response)=>{
  try {
    const {id} = req.query
    const {name,email,phoneNo} = req.body.formData
    const objectId = new ObjectId(String(id))
    const data = await Company.findOne({_id:objectId})
    if(data){
      Company.findOneAndUpdate({_id:objectId},{companyName:name,email:email,phoneNo:phoneNo}).then(()=>{
        Company.findOne({ _id: objectId }).select({ name: 1, email: 1, phoneNo: 1, _id: 0 }).then((data) => {
          res.status(200).json({ message: 'profile updated', data });
        });
      })
    }else{
      res.status(404).json({message:'data not found'})
    }
  } catch (error) {
    res.status(500).json({error})
  }
  
}

const updateAbout = async(req:Request,res:Response)=>{
try {
  const {id} = req.query
  const objectId = new ObjectId(id as string)
  const {companyType,noOfEmployes,website,overview} = req.body.formData
  const data = await Company.findOne({_id:objectId})
  if(data){
   Company.findOneAndUpdate({_id:objectId},{companyType,noOfEmployes,website,overview})
   .then((data)=>{
    res.status(200).json({data})
   })
  }else{
    res.status(404).json({message:'data not found '})
  }
} catch (error) {
  res.status(500).json({error})
}
}
const updateSpecialties = async(req:Request,res:Response)=>{
  try {
    const {id} = req.query
  const objectId = new ObjectId(id as string)
  const specialties = req.body.data
let data = await Company.findOneAndUpdate({_id:objectId},{specialties:specialties})
if(data){
  res.status(200).json({data:data.specialties})
}
  } catch (error) {
    res.status(500).json({error})
  }
}

const uploadCertificates = async(req:Request,res:Response)=>{
  try {
    const {id} = req.query
  const objectId = new ObjectId(id as string)
  const {data} = req.body
  const Data = await Company.findOne({_id:objectId})
  if(Data){
    Company.findOneAndUpdate({_id:objectId},{certificates:data})
    .then((data)=>{
      res.status(200).json({data})
    })
  }
  } catch (error) {
    res.status(500).json({error})
  }
}

const resendOtp = async(req:Request,res:Response)=>{
  try {
    const data = (req.session as MySessionData).companySessionData
    if(data){
      let otp: number = registerHelper.generateOtp();
      console.log('otp = ',otp)
      new Otp({
        otp: otp,
        name: data.companyName
      }).save();
      registerHelper.sendOTP(data.email, otp).then(()=>{
        res.status(200).json({ message: "check your mail for otp"});
      })
    }
  
  } catch (error) {
    res.status(500).json(error)
  }
  
}


//chats 
const getChats = (req:Request,res:Response)=>{
const {Id} = req.params
const objectId = new ObjectId(Id)
Chat.aggregate([{$match:{senderId:objectId}}])
} 
export const companyController={
    registation,
    verifyRegistration,
    Login,
    logOut,
    profile,
    uploadProfilePic,
    updateProfileData,
    updateAbout,
    uploadCertificates,
    updateSpecialties,
    resendOtp
}