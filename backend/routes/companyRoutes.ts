import express from 'express'
import { companyController } from '../controllers/companyControllers'
import { jobController } from '../controllers/jobControllers'

import companyAuthorization from '../middlewares/companyAuth'


const companyRoute = express()
companyRoute.post('/registration',companyController.registation)
companyRoute.post('/verify',companyController.verifyRegistration)
companyRoute.post('/login',companyController.Login)
companyRoute.post('/logOut',companyController.logOut)
companyRoute.post('/resendOtp',companyController.resendOtp)

companyRoute.get('/isBlocked/:id',companyController.isBlocked)

// Profile
companyRoute.get('/profile',companyController.profile)
companyRoute.post('/uploadProfile',companyController.uploadProfilePic)
companyRoute.post('/profileData',companyController.updateProfileData)
companyRoute.post('/updateAbout',companyController.updateAbout)
companyRoute.post('/uploadCertificates',companyController.uploadCertificates)
companyRoute.post('/updateSpecialties',companyController.updateSpecialties)

//job
companyRoute.get('/getJob/:id',jobController.getJob)
companyRoute.get('/allJobs/:id',companyAuthorization,jobController.companyJobs)
companyRoute.patch('/setStatus',jobController.setJobStatus)
companyRoute.delete('/deleteJob/:id',jobController.deleteJob)
companyRoute.post('/createJob/:id',jobController.createJob)
companyRoute.post('/editJob/:id',jobController.editJob)
companyRoute.post('/createQuiz/:id',jobController.createQuiz)
companyRoute.get('/appliedDevelopers/:jobId',jobController.getAppliedDevelopers)
companyRoute.patch('/changeProposalStatus/:jobId',jobController.changeProposalStatus)




export default companyRoute