import express from 'express'
import { companyController } from '../controllers/companyControllers'
// import  isCompanyLoggedIn from '../middlewares/companyAuth'
// import isCompanyLoggedIn from '../middlewares/companyAuth'


const companyRoute = express()
companyRoute.post('/registration',companyController.registation)
companyRoute.post('/verify',companyController.verifyRegistration)
companyRoute.post('/login',companyController.Login)
companyRoute.post('/logOut',companyController.logOut)
companyRoute.post('/resendOtp',companyController.resendOtp)

// Profile
companyRoute.get('/profile',companyController.profile)
companyRoute.post('/uploadProfile',companyController.uploadProfilePic)
companyRoute.post('/profileData',companyController.updateProfileData)
companyRoute.post('/updateAbout',companyController.updateAbout)
companyRoute.post('/uploadCertificates',companyController.uploadCertificates)
companyRoute.post('/updateSpecialties',companyController.updateSpecialties)



export default companyRoute