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
      const question =  req.body.question
      const response = await openai.chat.completions.create({
        model:'gpt-3.5-turbo',
        messages: [{ "role": "user", "content": question + ",in less than 50 words" }],
        max_tokens:50
      })
      const answer = response.choices[0].message.content
      res.status(200).json(answer)
      const newChat = new chatModel({
        sender: patient,
        question,
        response:answer
      })
      newChat.save()
    }
  } catch (error) {
    res.status(429).json('an error occured')
    console.log(error)
  }
}
   

const allChatsUser = async(req, res) => {
  try {
    const userId = req.user._id
    if (!userId) {
      res.status(404).json('you are not authorised to access this')
    }
    else {
      const allChatUser = await chatModel.find({ sender: userId })
      if (!allChatUser) {
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

