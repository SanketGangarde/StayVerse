// ✅ Import Cloudinary with v2 API
const cloudinary = require('cloudinary').v2;

// ✅ Import the CloudinaryStorage engine for multer
const { CloudinaryStorage } = require('multer-storage-cloudinary');


cloudinary.config({//help to talk to cloudinary
    cloud_name : process.env.CLOUD_NAME,
    api_key : process.env.CLOUD_API_KEY,
    api_secret : process.env.CLOUD_API_SECRET,
 
})



// 2. Setup CloudinaryStorage to store images in cloud
const storage = new CloudinaryStorage({
  cloudinary: cloudinary,
  params: {
    folder: 'BaseOps_dev', // Folder name in your Cloudinary dashboard
    allowedFormats: ['jpg', 'jpeg', 'png'], // Optional
    transformation: [{ width: 800, height: 600, crop: 'limit' }] // Optional resizing
  }
});

module.exports = {
    cloudinary,
    storage
}