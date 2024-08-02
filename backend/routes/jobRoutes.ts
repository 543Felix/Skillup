import express from 'express'
import  {jobController}  from '../controllers/jobControllers'

 const jobRoute = express()

jobRoute.get('/slots',jobController.getSlots)


export default jobRoute