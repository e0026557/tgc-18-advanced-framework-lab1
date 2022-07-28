const express = require('express');
const { createPosterForm, bootstrapField } = require('../forms');
const router = express.Router(); // Create a router object

// Import in the Poster model
const { Poster } = require('../models');

router.get('/', async function (req, res) {
  // Fetch all the posters
  let posters = await Poster.collection().fetch();
  res.render('posters/index', {
    posters: posters.toJSON()
  }) // relative to 'views' folder
})

router.get('/create', function(req, res) {
  const posterForm = createPosterForm();
  res.render('posters/create', {
    form: posterForm.toHTML(bootstrapField)
  })
})

// Export router object for use in other JS files
module.exports = router;