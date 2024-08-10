import { Request,Response } from "express"
import Admin from '../models/adminSchema'
import {adminType} from '../types/interface'
import Developer from '../models/developerSchema'
import Company from '../models/companySchema'
import Job from "../models/jobsSchema"
import { ObjectId} from "mongodb"
import { adminSideListingData } from "../types/interface"
import { registerHelper } from "../helper/registationHelper"
import moment from 'moment'



interface DateRange{
  $gte?:Date;
  $lt?:Date
}
interface ChartMatchCondition{
  createdAt?:DateRange
}

interface GroupCondition{
  _id:{}|null,
  count:{}
}

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


  const getDetailsOnDashboard = async(req:Request,res:Response)=>{
    const DeveloperCount = await Developer.find().countDocuments()
    const CompaniesCount = await Company.find().countDocuments()
    const jobsCount = await Job.find().countDocuments()
    const totalSubscriptionsEach = await Developer.aggregate([
  { $unwind: '$subscriptions' },
  { $match: { 'subscriptions.planName': { $in: ['Pro', 'Premium'] } } },
  { $group: {
      _id: '$subscriptions.planName',
      count: { $sum: 1 }
    }
  }
]) 
const totalIncome = totalSubscriptionsEach.reduce((sum,item)=>{
  if(item._id==='Pro'){
    sum += 12*item.count
  }else if(item._id==='Premium'){
    sum += 100*item.count
  }
  return sum
},0)
    res.status(200).json({DeveloperCount,CompaniesCount,jobsCount,totalIncome})
  }

  const ChartData = async(req:Request,res:Response)=>{
    const { period,role } = req.query;
    let matchCondition:ChartMatchCondition = { };
    let groupByCondition:GroupCondition = { _id: null, count: { $sum: 1 } };
    let dateRange:DateRange|null = {};
  
    switch (period) {
      case 'last7days':
        dateRange = {
          $gte: moment().subtract(7, 'days').startOf('day').toDate(),
          $lt: moment().endOf('day').toDate(),
        };
        break;
      case 'last30days':
        dateRange = {
          $gte: moment().subtract(30, 'days').startOf('day').toDate(),
          $lt: moment().endOf('day').toDate(),
        };
        break;
      case 'last90days':
        dateRange = {
          $gte: moment().subtract(90, 'days').startOf('day').toDate(),
          $lt: moment().endOf('day').toDate(),
        };
        break;
      case 'allTime':
        dateRange = null; 
        break;
      default:
        return res.status(400).send('Invalid period');
    }
  
    if (dateRange&&(period === 'last30days' || period === 'last90days')) {
      matchCondition.createdAt = dateRange;
        groupByCondition._id = {
          $subtract: [
            { $subtract: ["$createdAt", new Date(0)] },
            { $mod: [{ $subtract: ["$createdAt", new Date(0)] }, 1000 * 60 * 60 * 24 * 7] }
          ]
        };
    }else if(dateRange){
      matchCondition.createdAt = dateRange;
      groupByCondition._id = { $dateToString: { format: "%Y-%m-%d", date: "$createdAt" } }
    } else {
      groupByCondition._id = { $dateToString: { format: "%Y-%m-%d", date: "$createdAt" } };
    }
  
    try {
      if(role ==='dev'){
      const  data = await Developer.aggregate([
          { $match: matchCondition },
          { $group: groupByCondition },
          { $sort: { _id: 1 } },
        ]);
        return  res.json(data);
      }else if(role ==='companies'){
       const data = await Company.aggregate([
          { $match: matchCondition },
          { $group: groupByCondition },
          { $sort: { _id: 1 } },
        ]);
       return res.json(data);
      }
      
  
    } catch (error) {
      console.error('Error fetching chart data:', error);
      res.status(500).send('Internal Server Error');
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
    unverifyCompany,
    getDetailsOnDashboard,
    ChartData
}