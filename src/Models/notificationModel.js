const mongoose = require('mongoose');
const Schema = mongoose.Schema


const notificationSchema = new Schema({
  sender: {
    type: mongoose.Schema.Types.ObjectId,
  },
  message: {
    type: String,
    required: true
  },
  time: {
    type: Date,
    timestamps: true
  }
});



const notificationModel = mongoose.model('notifications', notificationSchema)
module.exports = notificationModel