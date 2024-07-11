import mongoose from 'mongoose'

const chatSchema = new mongoose.Schema({
    senderId: {
    type: mongoose.Schema.Types.ObjectId,
    required: true,
    refPath: 'senderModel'
  },
  receiverId: {
    type: mongoose.Schema.Types.ObjectId,
    required: true,
    refPath: 'receiverModel'
  },
  senderModel: {
    type: String,
    required: true,
    enum: ['developers', 'companies']
  },
  receiverModel: {
    type: String,
    required: true,
    enum: ['developers', 'companies']
  },
  content: {
    type: String,
    required: true
  },
  isViewed: {
    type: Boolean,
    default: false
  }, 
},
{ timestamps: true }
)

const Chat = mongoose.model('Chat',chatSchema)
export default Chat