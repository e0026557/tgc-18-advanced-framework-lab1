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

router.post('/create', async function(req, res) {
  const posterForm = createPosterForm();
  posterForm.handle(req, {
    // Handle success
    success: async function(form) {
      const poster = new Poster(); // represents one row in the posters table
      poster.set('title', form.data.title);
      poster.set('cost', form.data.cost);
      poster.set('description', form.data.description);
      poster.set('date', form.data.date);
      poster.set('stock', form.data.stock);
      poster.set('height', form.data.height);
      poster.set('width', form.data.width);
      await poster.save();
      res.redirect('/posters');
    },
    // Handle errors
    error: async function(form) {
      // Render the create hbs file with the processed form with bootstrap formatted error messages
      res.render('posters/create', {
        form: form.toHTML(bootstrapField)
      })
    }
  })
})

// Export router object for use in other JS files
module.exports = router;