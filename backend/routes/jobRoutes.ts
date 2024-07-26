import express from 'express'
import  {jobController}  from '../controllers/jobControllers'

 const jobRoute = express()
jobRoute.post('/createJob/:id',jobController.createJob)
// jobRoute.post('/updateJob',jobController.updateJob)
jobRoute.get('/dev/:id/:pageNo',jobController.JobsToDisplayDev)
jobRoute.get('/getJob/:id',jobController.getJob)
jobRoute.get('/getQuiz/:devId/:jobId',jobController.getQuiz)
jobRoute.get('/slots',jobController.getSlots)
jobRoute.get('/company/:id',jobController.companyJobs)
jobRoute.patch('/setStatus',jobController.setJobStatus)
jobRoute.patch('/saveJob/:id',jobController.saveJob)
jobRoute.patch('/unSaveJob/:id',jobController.unSaveJob)
jobRoute.get('/savedJobs/:id',jobController.SavedJobs)
jobRoute.delete('/deleteJob/:id',jobController.deleteJob)
jobRoute.post('/editJob/:id',jobController.editJob)
jobRoute.post('/createQuiz/:id',jobController.createQuiz)
jobRoute.post('/sendProposal/:jobId',jobController.sendProposal)
jobRoute.get('/appliedDevelopers/:jobId',jobController.getAppliedDevelopers)
jobRoute.patch('/changeProposalStatus/:jobId',jobController.changeProposalStatus)
jobRoute.get('/quizAttendedDevs/:jobId/:devId',jobController.showQuizAttendedDevelopers)
jobRoute.get('/appliedJobsCount/:devId',jobController.getAppliedJobsCount)

export default jobRoute