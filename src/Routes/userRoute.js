const express = require('express');
const route = express.Router()
const userController = require('../Controllers/userController')
const profilePic = require('../Controllers/profilePictureController')
const jwtToken = require('../../config/jwt')
const chat = require('../Controllers/chatController')
const profileUpdate = require('../Controllers/profileController')


route.post('/register', userController.register)

route.post('/login', userController.login)

route.get('/profile', profileUpdate.getProfile)

route.post('/profilePic',jwtToken.verifyToken, profilePic.profilePictureUser)

route.post('/chat', jwtToken.verifyToken, chat.newChatUser)

route.get ('/allchat', jwtToken.verifyToken , chat.allChatsUser)


route.post('/profileUpdate', jwtToken.verifyToken, profileUpdate.updateProfile)

module.exports = route