require("dotenv").config();
const userModel = require("../Models/userModel");
const cryptoHash = require("node:crypto");
const jwt = require("jsonwebtoken");
const profileModel = require("../Models/profileModel");

function hashValue(value) {
  const hash = cryptoHash.createHash("sha256");
  hash.update(value);
  return hash.digest("base64");
}

const register = async (req, res) => {
  try {
    const user = await userModel.findOne({ email: req.body.email });
    if (user) {
      res.status(409).json({ message: "user account already exists." });
    } else {
      const password = req.body.password;
      const passwordMatched = hashValue(password);
      const number = req.body.number;
      const name = req.body.name;
      const email = req.body.email;
      const gender = req.body.gender;
      const role = req.body.role;
      const age = req.body.age;
      const newuser = new userModel({
        name,
        number,
        email,
        gender,
        age,
        role,
        password: passwordMatched
      });
      await newuser.save();
      const newProfile = new profileModel({
        id: newuser.id,
        __id: newuser._id,
        name,
        number,
        email,
        gender,
        age
      });
      await newProfile.save();
      res.json("You have been sign up successfull");
    }
  } catch (error) {
    res.status(500).json("Could not save user.");
    console.log(error);
  }
};

const login = async (req, res) => {
  try {
    const id = req.body.id;
    const password = req.body.password;

    const user = await userModel.findOne({ email: id });

    if (user) {
      const passwordMatched = hashValue(password);
      if (passwordMatched === user.password) {
        const payload = { user_id: user._id, name: user.name, role: user.role };
        const secretKey = process.env.JWT_SECRET;
        const token = jwt.sign(payload, secretKey);
        res.status(200).json(token);
        await userModel.updateOne(
          { _id: user._id },
          { Status: "Online", isVerified: true }
        );
      } else {
        res.status(401).json("Invalid credentials.");
      }
    } else {
      res.status(404).json("user not found.");
    }
  } catch (error) {
    console.log(error);
    res.status(500).json("Could not log in user.");
  }
};

module.exports = { register, login };
