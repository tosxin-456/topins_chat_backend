const mongoose = require('mongoose');
const Schema = mongoose.Schema()


const chatSchema = new Schema({
  sender: {
    type: Schema.Types.ObjectId,
    required: true
  },
  receiver: {
    type: Schema.Types.ObjectId,
    required: true
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



const chatModel = mongoose.model('chat', chatSchema)
module.exports = chatModel