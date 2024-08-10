import express from 'express'
import { ChatController } from '../controllers/chatController'

import { getOnlineUsers } from '../Socketio/socketInitial'

const chatRoute = express()

chatRoute.get('/getAllChats/:id',ChatController.getAllChats)
chatRoute.get('/individualMessages',ChatController.getIndividualMessages)
chatRoute.get('/setMessageviewed',ChatController.setMessageViewed)
chatRoute.delete('/deleteMessage/:id',ChatController.DeleteMessage)
chatRoute.get('/onlineUsers',getOnlineUsers)
chatRoute.get('/unReadChat/:id',ChatController.unReadMessagesCount)

export default chatRoute