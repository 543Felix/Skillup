import express from 'express'
import {meetingController} from '../controllers/meetingController'

const meetingRoute = express()


meetingRoute.get('/meetingHistory/:id',meetingController.getMeetingHistory)

export default meetingRoute