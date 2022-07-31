const express = require('express');
const router = express.Router();

const cloudinary =  require('cloudinary');
// Configure cloudinary
cloudinary.config({
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET
})

router.get('/sign', async function(req, res) {
  // Retrieve parameters needed to send to cloudinary
  const params_to_sign = JSON.parse(req.query.params_to_sign);

  // Retrieve cloudinary API secret from .env
  const apiSecret = process.env.CLOUDINARY_API_SECRET;

  // Get signature (CSRF)
  const signature = cloudinary.utils.api_sign_request(params_to_sign, apiSecret);
  res.send(signature);
})

module.exports = router;