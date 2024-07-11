import mongoose from 'mongoose';

// Define a sub-schema for individual notification content
const notificationContentSchema = new mongoose.Schema({
  content: {
    type: String,
    required: true
  },
  senderId: {
    type: mongoose.Schema.Types.ObjectId,
    required: true,
  },
  isViewed: {
    type: Boolean,
    default: false
  }
}, {
  timestamps: true
});

// Main notification schema
const notificationSchema = new mongoose.Schema({
  receiverId: {
    type: mongoose.Schema.Types.ObjectId,
    required: true
  },
  notifications: [notificationContentSchema] // Array of notifications
});

const Notification = mongoose.model('Notification', notificationSchema);
export default Notification;
