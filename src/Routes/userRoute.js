const express = require('express');
const route = express.Router()
const userController = require('../Controllers/userController')
const profilePic = require('../Controllers/profilePictureController')
const jwtToken = require('../../config/jwt')
const chat = require('../Controllers/chatController')
<<<<<<< HEAD
//const userRoute = require('./userRoutes');
=======
const notify = require('../Controllers/notificationsController')
const profileUpdate = require('../Controllers/profileController')

>>>>>>> 8df0f7b17cc0bdcfc997380a7134b5e8265ae8bf


// route.get('/', (req,res) => {
//   res.json('User Route')
// })


route.post('/register', userController.register)

route.post('/login', userController.login)

route.post('/profilePic',jwtToken.verifyToken, profilePic.profilePictureUser)

route.post('/chat', jwtToken.verifyToken, chat.newChatUser)

route.get ('/allchat', jwtToken.verifyToken , chat.allChatsUser)

route.post('/notify', jwtToken.verifyToken,jwtToken.verifyAdmin, notify.newNotification)

<<<<<<< HEAD
=======
route.post('/profileUpdate', jwtToken.verifyToken, profileUpdate.updateProfile)





>>>>>>> 8df0f7b17cc0bdcfc997380a7134b5e8265ae8bf
module.exports = route