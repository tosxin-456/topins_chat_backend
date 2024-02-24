const express = require('express');
const route = express.Router()
const userController = require('../Controllers/userController')
const profilePic = require('../Controllers/profilePictureController')
const jwtToken = require('../../config/jwt')
const chat = require('../Controllers/chatController')
const notify = require('../Controllers/notificationsController')
const profileUpdate = require('../Controllers/profileController')
const schedule = require('../Controllers/scheduleController')
const graphs = require('../Controllers/graphsController')

// route.get('/', (req,res) => {
//   res.json('User Route')
// })


route.post('/register', userController.register)

route.post('/login', userController.login)

route.post('/profilePic',jwtToken.verifyToken, profilePic.profilePictureUser)

route.post('/chat', jwtToken.verifyToken, chat.newChatUser)

route.get ('/allchat', jwtToken.verifyToken , chat.allChatsUser)

route.post('/notify', jwtToken.verifyToken, jwtToken.verifyAdmin, notify.newNotification)

route.post('/scheduleNew', jwtToken.verifyToken, schedule.createSchedule)


route.post('/profileUpdate', jwtToken.verifyToken, profileUpdate.updateProfile)

route.get('/pie', jwtToken.verifyToken, graphs.schedulesByUserInTotal)

route.get('/bar', jwtToken.verifyToken, graphs.individualSchedulesForUser)

route.get('/line', jwtToken.verifyToken, graphs.medicationIntake)


module.exports = route