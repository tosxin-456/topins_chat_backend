const uri = 'mongodb+srv://Tosin:090711t@cluster0.dex1ht8.mongodb.net/Topins_Chat';
const mongoose = require('mongoose');

const Db = () => {
  mongoose
    .connect(uri)
    .then(() => {
      console.log('MongoDB connected');
    })
    .catch((err) => {
      console.error('MongoDB connection error:', err);
    });
};

module.exports = Db;


