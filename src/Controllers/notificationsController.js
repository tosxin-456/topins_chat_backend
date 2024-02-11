const notifyModel = require('../Models/notificationModel'); // Assuming you have a model for chat messages
const userModel = require('../Models/userModel')

const newNotification = async (req, res) => {
  try {
    const userId = req.user._id
    const user = await userModel.findById({_id: userId})
    if (!user) {
      res.status(404).json('an error occured')
    }
    else {
      const message = req.body.message
      const newNotify = new notifyModel({
        sender: userId,
        message
      })
     newNotify.save()
    }
  } catch (error) {
    console.log(error)
  }
}


module.exports = { newNotification }