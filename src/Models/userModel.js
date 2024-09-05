const moongose = require("mongoose");
const schema = moongose.Schema;

const userSchema = new schema({
  name: {
    type: String,
    required: true
  },
  email: {
    type: String,
    required: true
  },
  age: {
    type: String,
    default: " ",
    required: true
  },
  gender: {
    type: String,
    enum: ["M", "F", "Rather Not Say"],
    required: true
  },
  password: {
    type: String,
    default: " ",
    required: true
  },
  number: {
    type: String,
    default: " ",
    required: true
  },
  status: {
    type: String,
    default: "Offline",
    enum: ["Offline", "Online"]
  },
  role: {
    type: String,
    default: "user",
    enum: ["user", "admin"]
  },
  isVerified: {
    type: Boolean,
    default: false
  },
  createdAt: {
    type: Date,
    default: Date.now
  },
  updatededAt: {
    type: Date,
    default: Date.now
  }
});

const userModel = moongose.model("users", userSchema);

module.exports = userModel;
