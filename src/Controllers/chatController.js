require('dotenv').config()
// Import necessary modules
const chatModel = require('../Models/chatModel'); // Assuming you have a model for chat messages
const userModel = require('../Models/userModel')
const { GoogleGenerativeAI } = require("@google/generative-ai");

const genAI = new GoogleGenerativeAI(process.env.API_KEY);



const newChatUser = async (req, res) => {
  try {
    const patient = req.user._id;
    const user = await userModel.findOne({ _id: patient });

    if (!user) {
      return res
        .status(404)
        .json({ message: "No user with this account exists" });
    }

    // Ensure that `question` is defined and pulled from the request
    const prompt = req.body.question;
    if (!prompt) {
      return res.status(400).json({ message: "Question is required" });
    }

    // Call the generative model API
    const model = genAI.getGenerativeModel({ model: "gemini-pro" });
    const result = await model.generateContent(prompt);
    const response = await result.response;
    const text = await response.text();

    // Save the chat to the database
    const newChat = new chatModel({
      sender: patient,
      question: prompt, // Make sure you're saving the question
      response: text
    });

    await newChat.save();

    // Return a successful response
    return res.status(200).json({ response: text });
  } catch (error) {
    console.error("Error in newChatUser:", error);

    // Handle rate-limiting or too many requests
    if (error.response && error.response.status === 429) {
      return res
        .status(429)
        .json({ message: "Too many requests, please try again later." });
    }

    // Catch any other errors
    return res.status(500).json({ message: "An error occurred" });
  }
};

   

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

