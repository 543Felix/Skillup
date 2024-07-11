import express from 'express'
import { ChatController } from '../controllers/chatController'

const chatRoute = express()

chatRoute.get('/getAllChats/:id',ChatController.getAllChats)
chatRoute.get('/individualMessages',ChatController.getIndividualMessages)

export default chatRoute