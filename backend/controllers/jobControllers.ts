import { ObjectId } from "mongodb"
import Job from "../models/jobsSchema"
import { query, Request,Response } from "express"
import Developer from "../models/developerSchema"
import Proposal from "../models/proposalSchema"






const setAppliedJobCount = async(id :string)=>{
   let data = await Developer.findOneAndUpdate({_id: new ObjectId(id )},{ $inc: { appliedJobsCount: 1 } },)
   return data
}

const createJob = async (req:Request,res:Response)=>{
   try {
      const {jobTitle,length,workingHoursperWeek,salary,description,responsibilities,skills,createdAt,experienceLevel,qualification} = req.body
      const {id} = req.params
   const companyId =  new ObjectId(String(id))
   const data = await Job.findOne({companyId:companyId,jobTitle:jobTitle})
    const  convertedSkills = skills.split(',').filter((item:string)=>item.trim().length!==0)
   
   if(data){
      res.status(404).json({message:'Job with this name already exists'})
   }else{
      new Job({
         companyId,
         jobTitle,
         length,
         workingHoursperWeek,
         salary,
         description,
         experienceLevel,
         qualification,
         responsibilities,
         createdAt,  
         skills:convertedSkills
      }).save().then((data)=>{
         res.status(200).json({message:'job successfully created',jobId:data._id})
      })
   }

   } catch (error) { 
      res.status(500).json({message:'An unexpected error ocuured while creating job'})
   }
    
 
}
const JobsToDisplayDev = async(req:Request,res:Response)=>{
   try {
      const {id} =req.params
      const objectId = new ObjectId(id as string)
   const qualification = req.query.qualification as string[];
   const experienceLevel = req.query.experienceLevel as string[] 
   const search =  req.query.search as string
   const sort = req.query.sort as string
const match:any = {status:'open'};
const Sort:any = {jobTitle:1}

if (qualification && qualification.length > 0) {
  match.qualification = { $in: qualification };
}

if (experienceLevel && experienceLevel.length > 0) {
  match.experienceLevel = { $in: experienceLevel };
}

if (search && search.trim().length > 0) {
  match.$or = [
    { jobTitle: { $regex: search, $options: "i" } },
    { skills: { $elemMatch: { $regex: search, $options: "i" } } }
  ];
}
if(sort){
   Sort.jobTitle = Number(sort)
}

      const devData = await Developer.findOne({ _id: objectId },{savedJobs:1,appliedJobs:1,_id:0});
      if (devData?.appliedJobs && devData.appliedJobs.length > 0) {
         match._id = { $nin: devData.appliedJobs };
       }
       
      if(devData!==(undefined||null)){
         Job.aggregate([
             {
            $match: match
            },
            {
              $lookup: {
                from: 'companies',
                localField: 'companyId',
                foreignField: '_id',
                as: 'companyDetails'
              }
            },{
               $sort : Sort??1
            },{
               $sort:{createdAt:-1}
            }
          ],{ collation: { locale: "en", strength: 2 } })
          .then((data)=>{
            const savedJobs  = devData?.savedJobs
            res.status(200).json({data,savedJobs})
           
         })
      }
     
   } catch (error) {
      res.status(500).json({message:'Error occured while fetching data'}) 
   }
   
}

const getAllJobs =async(req:Request,res:Response)=>{
   try {
      const qualification = req.query.qualification as string[];
      const experienceLevel = req.query.experienceLevel as string[] 
      const search =  req.query.search as string
      const sort = req.query.sort as string
   const match:any = {status:'open'};
   const Sort:any = {jobTitle:1}
   
   if (qualification && qualification.length > 0) {
     match.qualification = { $in: qualification };
   }
   
   if (experienceLevel && experienceLevel.length > 0) {
     match.experienceLevel = { $in: experienceLevel };
   }
   
   if (search && search.trim().length > 0) {
     match.$or = [
       { jobTitle: { $regex: search, $options: "i" } },
       { skills: { $elemMatch: { $regex: search, $options: "i" } } }
     ];
   }
   if(sort){
      Sort.jobTitle = Number(sort)
   }
   Job.aggregate([
      {
     $match: match
     },
     {
       $lookup: {
         from: 'companies',
         localField: 'companyId',
         foreignField: '_id',
         as: 'companyDetails'
       }
     },{
        $sort : Sort??1
     },{
        $sort:{createdAt:-1}
     }
   ],{ collation: { locale: "en", strength: 2 } })
   .then((data)=>{
      res.status(200).json({data})
   })
   } catch (error) {
      res.status(500).json({message:'Error occured while fetching data'})
   }
 

}

const saveJob = (req:Request,res:Response)=>{
   try {
      const {id} = req.params
      const {jobId} = req.body
      const devId =  new ObjectId(String(id))
     Developer.findOneAndUpdate({_id:devId},{$addToSet:{savedJobs:jobId}})
     .then((data)=>{
      let savedJobs = data?.savedJobs
      res.status(200).json({message:'data updated successfully',savedJobs})
     }) 
   } catch (error) {
      res.status(500).json({message:'Error occured on datyabase update'})
   }
   
}
const unSaveJob =(req:Request,res:Response)=>{
   try {
      const {id} = req.params
      const objectId = new ObjectId(id as string)
      const {jobId} = req.body
      Developer.findOneAndUpdate({_id:objectId},{$pull:{savedJobs:jobId}})
      .then(()=>{
      res.status(200).json({message:'job removed from saved Jobs'})
      }) 
   } catch (error) {
      res.status(500).json({message:'Error occured on datyabase update'})
   }
 
}
const SavedJobs = (req:Request,res:Response)=>{
   try {
      const {id} = req.params
   const objectId = new ObjectId(id as string)
   const qualification = req.query.qualification as string[];
   const experienceLevel = req.query.experienceLevel as string[] 
   const search =  req.query.search as string
   const sort = req.query.sort as string

const match:any = {};
const Sort:any ={"jobs.jobTitle":1}
if (qualification && qualification.length > 0) {
  match["jobs.qualification"] = { $in: qualification };
}

if (experienceLevel && experienceLevel.length > 0) {
  match["jobs.experienceLevel"] = { $in: experienceLevel };
}

if (search && search.trim().length > 0) {
  match.$or = [
    { "jobs.jobTitle": { $regex: search, $options: "i" } },
    { "jobs.skills": { $elemMatch: { $regex: search, $options: "i" } } }
  ];
}
if(sort){
   Sort["jobs.jobTitle"] = Number(sort)
}
   Developer.aggregate([
      { $match: { 
          _id: objectId,
          savedJobs: { $exists: true, $type: 'array', $ne: [] }
      } },
      {
        $lookup: {
          from: "jobs",
          let: { savedJobs: "$savedJobs" },
          pipeline: [
            {
              $match: {
                $expr: { $in: ["$_id", "$$savedJobs"] }
              }
            },
            {
              $lookup: {
                from: "companies",
                localField: "companyId",
                foreignField: "_id",
                as: "companyDetails"
              }
            }
          ],
          as: "jobs"
        }
      },
      { $unwind: "$jobs" }, 
      { 
        $match: { 
          "jobs.status": "open" ,
          ...match
        } 
      },{
        $sort: Sort
      },
      { $project: { job: "$jobs",_id: 0 } }
    ],{ collation: { locale: "en", strength: 2 } }).then((response )=>{
      if(response.length===0){
         return res.status(200).json({data:response})
      }
      const data = response.map((item)=>item.job)
      res.status(200).json({data})
    }).catch((error)=>{
      res.status(500).json({message:error.message})
    })
   } catch (error) {
      res.status(500).json({message:'Error occurred while aggregating data from database'})
   }
   
}
const deleteJob = (req:Request,res:Response)=>{
   try {
      const {id} = req.params
      const objectId = new ObjectId(id as string)
      Job.deleteOne({_id:objectId}).then(()=>{
         res.status(200).json({message:'job Deleted sucessfully'})
      })
   } catch (error) {
      res.status(500).json({message:'Errro occured while deleting from database'})
   }
  
}
const companyJobs = (req:Request,res:Response)=>{
   try {
      const {id} = req.params
   const objectId =  new ObjectId(String(id))
   Job.aggregate([{$match:{companyId:objectId}}]).then((response)=>{
     return res.status(200).json({response})
   })
   } catch (error) {
      return res.status(500).send({message:'An Error occured while fetching Data'})
   }
   
}
const getJob = (req:Request,res:Response)=>{
   try {
      const {id} = req.params
   const objectId =  new ObjectId(String(id))
   Job.findOne({_id:objectId}).then((data)=>{
       res.status(200).json({data})
   })
   } catch (error) {
      res.status(500).json({message:'An error occured on finding particular job'})
   }
   

}
const getIndividualJob = (req:Request,res:Response)=>{
   const {id} = req.params
   Job.aggregate([
      {
         $match:{_id: new ObjectId(id as string)}
      }, {
         $lookup: {
           from: 'companies',
           localField: 'companyId',
           foreignField: '_id',
           as: 'companyDetails'
         }
       }
   ]).then((data)=>{
      res.status(200).json({data})
   })
}
const editJob =(req:Request,res:Response)=>{
   try {
      const {id} = req.params
      const jobId = new ObjectId(id as string)
      const {jobTitle,length,workingHoursperWeek,description,responsibilities,skills,salary,experienceLevel,qualification}  = req.body
      let Skills
      if(typeof skills === 'string'){
       Skills = skills.split(',').filter((item:string)=>item.trim().length!==0)
      }else{
         Skills = skills
      }
      Job.findOneAndUpdate({_id:jobId},{
         jobTitle,
         length,
         workingHoursperWeek,
         description,
         responsibilities,
         salary,
         experienceLevel,
         qualification,
         skills:Skills
      }).then((data)=>{
         res.status(200).json({message:'job updation successfull'})
      })
   } catch (error) {
      res.status(500).json({message:'An error occured on updating job'})
   }
  
}

const sendProposal = async(req:Request,res:Response)=>{
   try {
      const {developerId,coverLetter,score,resume} = req.body
      const {jobId} = req.params
      const DeveloperId = new ObjectId(developerId as string)
      const JobId = new ObjectId(jobId as string)
       Proposal.findOne({jobId:JobId,developerId:DeveloperId})
      .then(async(data)=>{
         if(!data){  
                   await setAppliedJobCount(developerId)
            new Proposal({
               jobId,
               developerId,
               coverLetter,
               resume,
               score
            }).save().then(async (data)=>{
               await Developer.updateOne({_id:DeveloperId},{$addToSet:{appliedJobs:JobId}})
               let Data = await Job.aggregate([
                  {
                     $match:{
                  _id:data.jobId
                     }
               },{
              $lookup: {
                from: 'companies',
                localField: 'companyId',
                foreignField: '_id',
                as: 'companyDetails'
              }
            },
            {
    $unwind: "$companyDetails"
  },
            {
               $project:{
                  _id:0,
                  companyName:"$companyDetails.companyName",
                  companyId:"$companyDetails._id",
                  jobTitle:1
               }
            }])
                 res.status(200).json({message:'sucessfully submited your Proposal',Data})
            })
         }else{
            res.status(404).json({message:'you have already applied for the job'})
         }
      })
     
   } catch (error) {
      res.status(500).json({message:'An error occured while submitting your proposal'})
   }
}
  
const createQuiz = async (req:Request,res:Response)=>{
   try {
      const {id} = req.params
   const objectId = new ObjectId(id as string)
   const {questions,passingScore}  = req.body
   Job.findOneAndUpdate({_id:objectId},{Quiz:{questions,passingScore}})
   .then(()=>{
      res.status(200).json({message:'Question for quiz added successfully '})
   })
   } catch (error) {
      res.status(500).json({message :'invalid error occurs'})
   }
   
}
const getQuiz = async(req:Request,res:Response)=>{
   try {
      const {jobId,devId} = req.params
   const objectId =  new ObjectId(String(jobId))
   await Developer.updateOne({_id: new ObjectId(devId as string)},{$addToSet:{appliedJobs:objectId}})
   Job.findOne({_id:objectId})
   .then((response)=>{
       const Quiz = response?.Quiz
      return res.status(200).json({Quiz})
   })
   } catch (error) {
      res.status(500).json({message:'An error occured while fetching data'})
   }
   
}



const setJobStatus =(req:Request,res:Response)=>{
   try {
      const {id} = req.query
   const objectId =  new ObjectId(String(id))
   const {status}  = req.body
   Job.findOneAndUpdate({_id:objectId},{status}).then(()=>{
       res.status(200).json({message:`status updated to ${status} job vaccancy successfully`})
   }).catch(()=>{
      res.status(404).json({message:'invalid credentials'})
   })
   } catch (error) {
      return res.status(500).json({message:'internal server error'})
   }
   
}

const getAppliedDevelopers = (req:Request,res:Response)=>{
   const jobId = req.params.jobId
   const objectId = new ObjectId(jobId)
   Proposal.aggregate([{$match:{jobId:objectId}},
      {
         $lookup: {
                    from: 'developers',
                    localField: 'developerId',
                    foreignField: '_id',
                    as: 'developer'
                }
      },
       {
                $unwind: '$developer'
            },
            {
                $project: {
                    _id: 0,
                    developerId:1,
                    resume:1,
                    createdAt:1,
                    status:1,
                    coverLetter:1,
                    name:'$developer.name',
                    email:'$developer.email',
                    image:'$developer.image'

                }
            },
            {
               $sort: { createdAt: -1 } // Sort by createdAt in descending order
           }
   ]).then((data)=>{
      res.status(200).json({data})
   }).catch(()=>{
      res.status(404).json({message:'No one applied for the job'})
   })
}



const changeProposalStatus =(req:Request,res:Response)=>{
   const {jobId} = req.params
   const {status,devId} =req.body
   const jobObjectId = new ObjectId(jobId)
   const devObjectId  = new ObjectId(devId as string)
   Proposal.findOneAndUpdate({jobId:jobObjectId,developerId:devObjectId},{status})
   .then(()=>{
      res.status(200).json({message:'job updated successfully'})
   })
   .catch(()=>{
      res.status(500).json({message:'Failed to update job status'})
   })
}
const getSubmitedProposal = (req:Request,res:Response)=>{
const {devId} = req.params
const objectId = new ObjectId(devId)
Proposal.aggregate([
   {
     $match: { developerId: objectId }
   },
   {
     $lookup: {
       from: 'jobs', // Collection name for jobs
       localField: 'jobId',
       foreignField: '_id',
       as: 'job'
     }
   },
   {
     $unwind: '$job'
   },
   {
     $lookup: {
       from: 'companies', // Collection name for companies
       localField: 'job.companyId',
       foreignField: '_id',
       as: 'company'
     }
   },
   {
     $unwind: '$company'
   },
   {
      $sort: { 'createdAt': -1 } 
   },
   {
     $project: {
       _id: 1,
       jobId: 1,
       jobName:'$job.jobTitle',
       createdAt:1,
       resume:1,
       coverLetter:1,
       status:1,
       companyName:'$company.companyName',
     }
   }
 ]).then((data)=>{
res.status(200).json({data})
})
}


const getAppliedJobsCount = (req:Request,res:Response)=>{
   const {devId} = req.params
   Developer.aggregate([{
      $match:{_id: new ObjectId(devId as string)}
   },{
      $project:{
         _id:0,
         appliedJobsCount:1,
         subscriptions:1
      }
   }]).then((data)=>{
      if(data[0].subscriptions[data[0].subscriptions.length-1].planName === 'Free'&&data[0].appliedJobsCount<5){
         return res.status(200).json({message:'You are elligible to apply '})
      }
      else if (data[0].subscriptions[data[0].subscriptions.length-1].planName === 'Pro'&&data[0].appliedJobsCount<15){
       return  res.status(200).json({message:'You are elligible to apply '})
      }else if (data[0].subscriptions[data[0].subscriptions.length-1].planName === 'Premium'){
        return res.status(200).json({message:'You are elligible to apply '})
      }else{
       return  res.status(401).json({message:'your subscription plan expired'})
      }
   })
   
}





export const jobController={
   JobsToDisplayDev,
   createJob,
   getQuiz,
   companyJobs,
   setJobStatus,
   getJob,
   saveJob,
   unSaveJob,
   SavedJobs,
   deleteJob,
   editJob,
   createQuiz,
   sendProposal,
   getAppliedDevelopers,
   changeProposalStatus,
   getSubmitedProposal,
   getIndividualJob,
   getAppliedJobsCount,
   getAllJobs
} 
