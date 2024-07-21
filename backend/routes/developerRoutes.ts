import express from 'express'
import  {developerController} from '../controllers/developerControllers'
import devAuthorization from '../middlewares/developerAuth'
import { jobController } from '../controllers/jobControllers'


const developerRoute = express()

// developerRoute.use(isDevloperLoggedIn)


developerRoute.post('/registration',developerController.Registration)
developerRoute.post('/verify',developerController.verifyRegistration)
developerRoute.post('/login',developerController.Login)
developerRoute.post('/logOut',developerController.logOut)
developerRoute.post('/resendOtp',developerController.resendOtp)
developerRoute.post('/registerWithGoogle',developerController.registerWithGoogle)


developerRoute.get('/isBlocked/:id',developerController.isBlocked)
// Profile

developerRoute.post('/uploadProfile',devAuthorization,developerController.uploadProfilePic)
developerRoute.get('/profile',devAuthorization,developerController.profile)
developerRoute.post('/profileData',devAuthorization,developerController.updateProfileData)
developerRoute.post('/profileRoleandDescription',devAuthorization,developerController.updateRoleandDescription)
developerRoute.post('/updateSkills',devAuthorization,developerController.updateSkills)

//job 



// Subscription

developerRoute.post('/create-checkout-session',devAuthorization,developerController.HandleSubscription)
// developerRoute.post('/stripeWebhook',developerController.stripePaymentHandler)



 // job

developerRoute.get('/submittedProposals/:devId',jobController.getSubmitedProposal)
developerRoute.get('/allJobs/:id',devAuthorization,jobController.JobsToDisplayDev)
developerRoute.patch('/saveJob/:id',devAuthorization,jobController.saveJob)
developerRoute.patch('/unSaveJob/:id',devAuthorization,jobController.unSaveJob)
developerRoute.get('/savedJobs/:id',devAuthorization,jobController.SavedJobs)
developerRoute.get('/quizAttendedDevs/:jobId/:devId',jobController.showQuizAttendedDevelopers)
developerRoute.get('/appliedJobsCount/:devId',devAuthorization,jobController.getAppliedJobsCount)
developerRoute.get('/getQuiz/:devId/:jobId',devAuthorization,jobController.getQuiz)
developerRoute.post('/sendProposal/:jobId',devAuthorization,jobController.sendProposal)


export default developerRoute