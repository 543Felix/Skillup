import express from 'express'
import { notificationController } from '../controllers/notificationController'


const notificationRoute = express()

notificationRoute.get('/:id/:role',notificationController.getNotifications)
notificationRoute.delete('/deleteNotification/:id/:notificationId',notificationController.deleteNotification)

export default notificationRoute