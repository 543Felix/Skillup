import { ObjectId } from "mongodb"
import Job from "../models/jobsSchema"
import { Request,Response } from "express"
import Slot from '../models/slotsSchema'
import Developer from "../models/developerSchema"
import Proposal from "../models/proposalSchema"



interface Slot{
   date: Date,
   time: string
}


const setAppliedJobCount = async(id :string)=>{
   let data = await Developer.findOneAndUpdate({_id: new ObjectId(id )},{ $inc: { appliedJobsCount: 1 } },)
   return data
}

const createJob = async (req:Request,res:Response)=>{
   try {
      const {jobTitle,length,workingHoursperWeek,salary,description,responsibilities,skills,createdAt} = req.body
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
      const savedjobs = await Developer.findOne({ _id: objectId },{savedJobs:1,_id:0});
      if(savedjobs!==(undefined||null)){
         Job.aggregate([
            {
              $match: { status: 'open' }
            },
            {
              $lookup: {
                from: 'companies',
                localField: 'companyId',
                foreignField: '_id',
                as: 'companyDetails'
              }
            }  
          ])
          .then((data)=>{
            const savedJobs  = savedjobs?.savedJobs
            res.status(200).json({data,savedJobs})
           
         })
      }
     
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
      { $unwind: "$jobs" }, // unwind the jobs array after lookup
      { 
        $match: { 
          "jobs.status": "open" 
        } 
      },
      { $project: { job: "$jobs",_id: 0 } }
    ]).then((response )=>{
      if(response.length===0){
         return res.status(404).json('There are no saved jobs')
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
const editJob =(req:Request,res:Response)=>{
   try {
      const {id} = req.params
      const jobId = new ObjectId(id as string)
      const {jobTitle,length,workingHoursperWeek,description,responsibilities,skills,salary}  = req.body
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
         skills:Skills
      }).then((data)=>{
         res.status(200).json({message:'job updation successfull'})
      })
   } catch (error) {
      res.status(500).json({message:'An error occured on updating job'})
   }
  
}

const sendProposal = (req:Request,res:Response)=>{
   try {
      const {developerId,coverLetter,score} = req.body
      const {jobId} = req.params
      const DeveloperId = new ObjectId(developerId as string)
      const JobId = new ObjectId(jobId as string)
      //  setAppliedJobCount(developerId)
       Proposal.findOne({jobId:JobId,developerId:DeveloperId})
      .then((data)=>{
         if(!data){
            new Proposal({
               jobId,
               developerId,
               coverLetter,
               score
            }).save().then(async (data)=>{
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
const getQuiz = (req:Request,res:Response)=>{
   try {
      const {jobId,devId} = req.params
   const objectId =  new ObjectId(String(jobId))
   setAppliedJobCount(devId)
   Job.findOneAndUpdate({_id:objectId},{$addToSet:{quizAttendedDevs:devId}},{new:true})
   .then((response)=>{
       const Quiz = response?.Quiz
      return res.status(200).json({Quiz})
   })
   } catch (error) {
      res.status(500).json({message:'An error occured while fetching data'})
   }
   
}

const getSlots = (req:Request,res:Response)=>{
   try {
      const {id} = req.query
   const objectId =  new ObjectId(String(id))
   Slot.aggregate([{$match:{job_id:objectId}}]).then((data)=>{
      res.status(200).json({data})
   }).catch(()=>{
      res.status(404).json({message:'invalidCredentials'})
   })
   } catch (error) {
      res.status(500).json({message:'Internal server error'})
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
                    jobId:0,
                    developerId:0,
                    __v:0
                }
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
  {$match:{developerId:objectId}},
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
      {$project:{_id:0,jobId:0,developerId:0,__v:0}}
]).then((data)=>{
res.status(200).json({data})
})
}
const showQuizAttendedDevelopers = (req:Request,res:Response)=>{
   const {jobId,devId} = req.params
   const JobID = new ObjectId(jobId as string)
   const DevID = new ObjectId(devId as string)
    Job.findOne({
            _id: JobID,
            quizAttendedDevs: { $elemMatch: { $eq: DevID } }
        }).then((data)=>{
         if(data?.quizAttendedDevs.includes(DevID)){
           res.status(401).json({message:'you have already attended the quiz'})
         }else{
            res.status(200).json({message:''})
         }
         
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
         subscriptionType:1
      }
   }]).then((data)=>{
      if(data[0].subscriptionType === 'Free'&&data[0].appliedJobsCount<5){
         return res.status(200).json({message:'You are elligible to apply '})
      }
      else if (data[0].subscriptionType === 'Pro'&&data[0].appliedJobsCount<15){
       return  res.status(200).json({message:'You are elligible to apply '})
      }else if (data[0].subscriptionType === 'Premium'){
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
   getSlots,
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
   showQuizAttendedDevelopers,
   getAppliedJobsCount
} 
