import express from 'express'
import { companyController } from '../controllers/companyControllers'
import { jobController } from '../controllers/jobControllers'
import { developerController } from '../controllers/developerControllers'

import companyAuthorization from '../middlewares/companyAuth'


const companyRoute = express()
companyRoute.post('/registration',companyController.registation)
companyRoute.post('/verify',companyController.verifyRegistration)
companyRoute.post('/login',companyController.Login)
companyRoute.post('/logOut',companyController.logOut)
companyRoute.post('/resendOtp',companyController.resendOtp)

companyRoute.get('/isBlocked/:id',companyController.isBlocked)

// Profile
companyRoute.get('/profile',companyAuthorization,companyController.profile)
companyRoute.post('/uploadProfile',companyAuthorization,companyController.uploadProfilePic)
companyRoute.post('/profileData',companyAuthorization,companyController.updateProfileData)
companyRoute.post('/updateAbout',companyAuthorization,companyController.updateAbout)
companyRoute.post('/uploadCertificates',companyAuthorization,companyController.uploadCertificates)
companyRoute.post('/updateSpecialties',companyAuthorization,companyController.updateSpecialties)

//job
companyRoute.get('/getJob/:id',companyAuthorization,jobController.getJob)
companyRoute.get('/allJobs/:id',companyAuthorization,companyAuthorization,jobController.companyJobs)
companyRoute.patch('/setStatus',companyAuthorization,jobController.setJobStatus)
companyRoute.delete('/deleteJob/:id',companyAuthorization,jobController.deleteJob)
companyRoute.post('/createJob/:id',companyAuthorization,jobController.createJob)
companyRoute.post('/editJob/:id',companyAuthorization,jobController.editJob)
companyRoute.post('/createQuiz/:id',companyAuthorization,jobController.createQuiz)
companyRoute.get('/appliedDevelopers/:jobId',companyAuthorization,jobController.getAppliedDevelopers)
companyRoute.patch('/changeProposalStatus/:jobId',companyAuthorization,jobController.changeProposalStatus)

// All Developers 
companyRoute.get('/allDevelopers',companyAuthorization,developerController.getDevelopers)
companyRoute.get('/devProfile',companyAuthorization,developerController.profile)


//Dashboard
companyRoute.get('/dashboard',companyAuthorization,companyController.dashBoardData)
companyRoute.get('/jobChart',companyAuthorization,companyController.appliedJobsChart)

export default companyRoute