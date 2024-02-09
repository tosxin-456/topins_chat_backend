require('dotenv').config()
const cors = require('cors');
const express = require('express');
const app = express();
const body_parser = require('body-parser');
const Db = require('../config/db')
app.use(cors());
const port = process.env.PORT || 27276
Db()
app.use(body_parser.urlencoded({ extended: true }))
app.use(body_parser.json())


app.listen( port, () => {
  console.log(`port running @ ${port}`)
})
//Routes
const userRoute = require('./Routes/userRoute');


app.use('/user',userRoute)
