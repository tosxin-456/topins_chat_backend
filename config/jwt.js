require('dotenv').config()
const userModel = require('../src/Models/userModel')
const jwt = require('jsonwebtoken');



 const verifyToken  = async (req, res, next) => {
    let token 
    if (
      req.headers.authorization &&
      req.headers.authorization.startsWith('Bearer')
    ){
      try {
        token =  req.headers.authorization.split(" ")[1];
        //  console.log(token)
        const decoded = jwt.verify(token,process.env.JWT_SECRET)
          req.user = await userModel.findById(decoded.user_id)
    //  console.log(req.user)
          next();
      } catch (error) {
        console.error(error)
      res.status(401)
      throw new Error('Not authorized, token failed')
      }
    }

    if (!token) {
    return res.status(401).json( "You are not authorized");
  }
};

const verifyAdmin = (req,res,next)=>{
  if(req.user && req.user.role==='admin'){
  
    next()
  }else{
    res.status(401).json('Only authorized admins can access the route')
  }
}

const verifyPatient = (req,res,next)=>{
  if(req.user && req.user.role==='patient'){
    next()
  }else{
    res.status(401).json('Only authorized patient can access the route')
  }
}

  module.exports = {verifyToken,verifyAdmin, verifyPatient}