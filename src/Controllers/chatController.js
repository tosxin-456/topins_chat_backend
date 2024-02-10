// Import necessary modules
const chatModel = require('../Models/chatModel'); // Assuming you have a model for chat messages
const userModel = require('../Models/userModel')

const  OpenAI = require('openai');


const openai = new OpenAI( {
  apiKey : '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'
});






const newChatUser = async (req, res) => {
  try {
    const patient = req.user._id
    const user = await userModel.findOne({ _id: patient });
    if (!user) {
      res.status(404).json('no user with this account exists')
    }
    else {
      const question = "how old is Nigeria"
      const response = await openai.chat.completions.create({
        model:'gpt-3.5-turbo',
        messages: [{ "role": "user", "content": question + ",in less than 50 words" }],
        max_tokens:50
      })
      const answer = res.json(response.choices[0].message.content)
      const newChat = new chatModel({
        sender: patient,
        question,
        response:answer
      })
      newChat.save()
    }
  } catch (error) {
    res.status(429).json('an error occured')
  }
}
   
const allChatsUser = async(req, res) => {
  try {
    const userId = req.user._id
    if (!userId) {
      res.status(404).json('you are not authorised to access this')
    }
    else {
      const allChatUser = chatModel.find({ sender: userId })
      if (!allChatUser  || allChatUser.length === 0) {
        res.status(404).json('no chat exists for this user')
      }
      else {
        res.status(200).json(allChatUser)
      }
    }
  } catch (error) {
    console.log(error)
  }
}


module.exports = {newChatUser, allChatsUser}

