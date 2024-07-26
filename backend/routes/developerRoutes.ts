import express from 'express'
import  {developerController} from '../controllers/developerControllers'
// import devAuthorization from '../middlewares/developerAuth'
import { jobController } from '../controllers/jobControllers'


const developerRoute = express()

// developerRoute.use(isDevloperLoggedIn)


developerRoute.post('/registration',developerController.Registration)
developerRoute.post('/verify',developerController.verifyRegistration)
developerRoute.post('/login',developerController.Login)
developerRoute.post('/logOut',developerController.logOut)
developerRoute.post('/resendOtp',developerController.resendOtp)
developerRoute.post('/registerWithGoogle',developerController.registerWithGoogle)

// Profile

developerRoute.post('/uploadProfile',developerController.uploadProfilePic)
developerRoute.get('/profile',developerController.profile)
developerRoute.post('/profileData',developerController.updateProfileData)
developerRoute.post('/profileRoleandDescription',developerController.updateRoleandDescription)
developerRoute.post('/updateSkills',developerController.updateSkills)

//job 
developerRoute.get('/submittedProposals/:devId',jobController.getSubmitedProposal)
developerRoute.post('/sendProposal/:jobId',jobController.sendProposal)


// Subscription

developerRoute.post('/create-checkout-session',developerController.HandleSubscription)
// developerRoute.post('/stripeWebhook',developerController.stripePaymentHandler)




// developerRoute.get('/dev/:id',jobController.JobsToDisplayDev)
// developerRoute.get('/getJob/:id',jobController.getJob)
// developerRoute.get('/getQuiz/:devId/:jobId',jobController.getQuiz)


export default developerRoute