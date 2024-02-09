const express = require('express');
const route = express.Router()
const userController = require('../Controllers/userController')
const profilePic = require('../Controllers/profilePictureController')
const jwtToken = require('../../config/jwt')

route.get('/', (req,res) => {
  res.json('working')
})

route.post('/register', userController.register)

route.post('/login', userController.login)

route.post('/profilePic',jwtToken.verifyToken, profilePic.profilePictureUser)








module.exports = route