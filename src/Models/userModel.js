const moongose = require('mongoose');
const schema = moongose.Schema

const userSchema = new schema({
  id: {
    type:String,
    required:true 
  },
  avatar: {
    type:String,
    default:'https://res.cloudinary.com/dba1aezsn/image/upload/v1707492360/Google_h25khv.jpg'
  },
  name: {
    type:String,
    required:true
  },
  email: {
    type: String, 
    required:true
  },
  password: {
    type: String,
    required:true
  },
  number: {
    type: String,
    required:true
  },
  fullTime:{
    type: String,
    required:true
  },
  fullDate: {
    type: String,
    required:true
  },
  status: {
    type: String,
    default: 'Offline',
    enum:['Offline','Online']
  },
  role: {
    type: String,
    default: 'patient',
    enum:['patient','admin']
  }
})


const userModel = moongose.model('users', userSchema)

module.exports = userModel