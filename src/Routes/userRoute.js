const express = require('express');
const route = express.Router()
const userController = require('../Controllers/userController')
const profilePic = require('../Controllers/profilePictureController')
const jwtToken = require('../../config/jwt')
const chat = require('../Controllers/chatController')
const notify = require('../Controllers/notificationsController')


route.get('/', (req,res) => {
  res.json('working')
})

route.post('/register', userController.register)

route.post('/login', userController.login)

route.post('/profilePic',jwtToken.verifyToken, profilePic.profilePictureUser)

route.post('/chat', jwtToken.verifyToken, chat.newChatUser)

route.get ('/allchat', jwtToken.verifyToken , chat.allChatsUser)

route.post('/notify', jwtToken.verifyToken,jwtToken.verifyAdmin, notify.newNotification)






module.exports = route