const patientModel = require('../Models/userModel')
const multer = require('multer')
const cloudinary = require('cloudinary').v2
const {CloudinaryStorage} = require('multer-storage-cloudinary')

cloudinary.config({
  cloud_name:'dba1aezsn',
  api_key:'295898651828171',
  api_secret:'QNrofias3hxbrH-Cyh-Vt7svui8'
})

const storage = new CloudinaryStorage({
  cloudinary: cloudinary,
  params: {
    folder: "Profile Pictures",
    filename: (req, file) => {
      const uniqueName = Date.now() + '-' + file.originalname;
     return  uniqueName;
    }
  }
});


const upload = multer({storage:storage})

const profilePictureUser = async (req, res) => {
  try {
    upload.single('image')(req, res, async (err) => {
      if (err) {
        console.log(err);
        return res.status(500).json('An error occurred, try again');
      }
      if (!req.file) {
        return res.status(400).json('No file uploaded');
      }
      const cloudUrl = req.file.path;
      const id = req.user._id
      const user = await patientModel.findOne({ _id: id }).catch((err) => {
        throw new Error('An error occurred', err);
      });
      const currentAvatar = user.avatar;
      
      const publicId = cloudinary.url(currentAvatar, { public_id: true }).split('/').pop().split('.')[0];

      cloudinary.uploader.destroy(publicId, async (error, result) => {
        if (error) {
          console.log('Error deleting image:', error);
        } else {
          const userProfileImg = await patientModel.findByIdAndUpdate(id, { avatar: cloudUrl });
          return res.status(200).json('Profile picture updated successfully');
        }
      });
    });
  } catch (error) {
    console.log(error);
    return res.status(400).json('An error occurred');
  }
};

module.exports = {profilePictureUser}