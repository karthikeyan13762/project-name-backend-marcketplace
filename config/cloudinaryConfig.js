const { v2: cloudinary } = require("cloudinary");

// Configuration
cloudinary.config({
  cloud_name: process.env.cloud_name,
  api_key: process.env.api_key,
  api_secret: process.env.api_secret, // Click 'View API Keys' above to copy your API secret
});

module.exports = cloudinary;
