const express = require('express');
const router = express.Router(); // Create a router object

router.get('/', function (req, res) {
  res.render('landing/index') // relative to 'views' folder
})

router.get('/about-us', function (req, res) {
  res.render('landing/about-us')
})

router.get('/contact-us', function (req, res) {
  res.render('landing/contact-us')
})

// Export router object for use in other JS files
module.exports = router;