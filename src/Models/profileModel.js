const mongoose = require('mongoose');
const Schema = mongoose.Schema


const profileSchema = new Schema({
  id: {
    type: mongoose.Schema.Types.ObjectId,
    required: true
  },
  name: {
    type: String,
    required: true
  },
  email: {
    type: String,
    default:'',
    required: true
  },
  avatar: {
    type: Date,
    timestamps: true
  },
  number: {
    type: mongoose.Schema.Types.ObjectId,
    required: true
  },
  age: {
    type: String,
    required: true
  },
  gender: {
    type: String,
    default:'',
    required: true
  },
  height: {
    type: Date,
    timestamps: true
  },  
  medicalConditions: {
    type: mongoose.Schema.Types.ObjectId,
    required: true
  },
  alergies: {
    type: String,
    required: true
  },
  theme: {
    type: String,
    default:'',
    required: true
  },
  avatar: {
    type: Date,
    timestamps: true
  }
});



const profileModel = mongoose.model('Profiles', profileSchema)
module.exports = profileModel