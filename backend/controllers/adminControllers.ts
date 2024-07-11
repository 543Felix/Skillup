import { Request,Response } from "express"
import Admin from '../models/adminSchema'
import {adminType} from '../types/interface'
import Developer from '../models/developerSchema'
import Company from '../models/companySchema'
import { ObjectId} from "mongodb"
import { adminSideListingData } from "../types/interface"
import { registerHelper } from "../helper/registationHelper"

const login = async (req:Request,res:Response)=>{
    let {name,password} = req.body
      let data:adminType[]|null = await Admin.findOne({name:name,password:password}) 
      if(data){
        const token = registerHelper.generateToken({name}) 
        res.cookie('adminAccessToken',token.accessToken,{httpOnly:true})
        res.cookie('adminRefreshToken',token.refreshToken,{httpOnly:true})
        return  res.status(200).json({message:'logged in suuceessful'})
      }else{
        res.send({message:'incorrect email and password'})
      }
}

const showDevelopers = async(req:Request,res:Response):Promise<void>=>{
  Developer.find({}).select({ password: 0 }).then((developers:({}|undefined|[]|[adminSideListingData]))=>{
    res.status(200).json({developers})
  }).catch((error)=>{
    console.error(error.message)
  })
}

const showCompanies  = async(req:Request,res:Response):Promise<void>=>{
  Company.find({}).select({ password: 0 }).then((companies)=>{
    res.status(200).json({companies})
  }).catch((error)=>{
    console.error(error.message)
  })
}

const blockDeveloper =async(req:Request,res:Response)=>{
   const id = new ObjectId(req.query.id as string)
   if(id){
   Developer.findOneAndUpdate({_id:id},{isBlocked:true},{new:true}).then((data)=>{
  Developer.find({}).select({password:0}).then((developer)=>{
    res.status(200).json({developer})
  })
     
   }).catch((error)=>{
    console.error(error.message);
    
   })
    
   }
}
const unblockDeveloper =(req:Request,res:Response)=>{
    const id = new ObjectId(req.query.id as string)
    if(id){
      Developer.findOneAndUpdate({_id:id},{isBlocked:false},{new:true}).then((data)=>{
        Developer.find({}).select({password:0}).then((developer)=>{
          res.status(200).json({developer})
       })
        }).catch((error)=>{
        console.error(error.message);
        
       })
    }
 } 
const blockCompany =(req:Request,res:Response)=>{
    const id = new ObjectId(req.query.id as string) 
    if(id){  
    Company.findOneAndUpdate({_id:id},{isBlocked:true},{new:true}).then((data)=>{
      Company.find({}).select({password:0}).then((companies)=>{
        res.status(200).json({companies})
      })
     
       }).catch((error)=>{
        console.error(error.message);
        
       })
               
    }
}

const unblockCompany =(req:Request,res:Response)=>{
    const id = new ObjectId(req.query.id as string)
    if(id){
        Company.findOneAndUpdate({_id:id},{isBlocked:false},{new:true}).then((data)=>{
          Company.find({}).select({password:0}).then((companies)=>{
            res.status(200).json({companies})
          })
         }).catch((error)=>{
          console.error(error.message);
         })
    }
}

const verifyCompany =(req:Request,res:Response)=>{
  const id = req.query.id
  const objectId = new ObjectId(id as string)
  Company.findOneAndUpdate({_id:objectId},{isVerified:true}).then((data)=>{
    res.status(200).json({data:data})
  }).catch((error)=>{
    res.status(500).json({message:error.message})
  })
}

const unverifyCompany =(req:Request,res:Response)=>{
  const id = req.query.id
  const objectId = new ObjectId(id as string)
  Company.findOneAndUpdate({_id:objectId},{isVerified:false}).then((data)=>{
    res.status(200).json({data:data})
  }).catch((error)=>{
    res.status(500).json({message:error.message})
  })
}

const logOut =(req:Request,res:Response)=>{
  try {
    res.clearCookie('adminAccessToken')
    res.clearCookie('adminRefreshToken')
    res.status(200).json({message:'successfully loogedout'})
  } catch (error) {
    res.status(500).json({error})
  }
   
  }

export const adminController ={
    login,
    showDevelopers,
    showCompanies,
    blockDeveloper,
    unblockDeveloper,
    blockCompany,
    unblockCompany,
    logOut,
    verifyCompany,
    unverifyCompany
}