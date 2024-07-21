import express from 'express'
import  {jobController}  from '../controllers/jobControllers'

// import devAuthorization from '../middlewares/developerAuth'


 const jobRoute = express()
jobRoute.get('/slots',jobController.getSlots)

export default jobRoute