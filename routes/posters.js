const express = require('express');
const { createPosterForm, bootstrapField } = require('../forms');
const router = express.Router(); // Create a router object

// Import in the Poster model
const { Poster } = require('../models');

// READ
router.get('/', async function (req, res) {
  // Fetch all the posters
  let posters = await Poster.collection().fetch();
  res.render('posters/index', {
    posters: posters.toJSON()
  }) // relative to 'views' folder
})

// CREATE
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

// UPDATE
router.get('/:poster_id/update', async function(req, res) {
  // Get poster to be updated
  const posterId = req.params.poster_id;
  const poster = await Poster.where({
    id: posterId
  }).fetch({
    require: true
  })

  // Create poster form
  const posterForm = createPosterForm();

  // Fill in poster form with existing values
  posterForm.fields.title.value = poster.get('title');
  posterForm.fields.cost.value = poster.get('cost');
  posterForm.fields.description.value = poster.get('description');
  posterForm.fields.date.value = poster.get('date');
  posterForm.fields.stock.value = poster.get('stock');
  posterForm.fields.height.value = poster.get('height');
  posterForm.fields.width.value = poster.get('width');

  res.render('posters/update', {
    form: posterForm.toHTML(bootstrapField),
    poster: poster.toJSON()
  })
})

router.post('/:poster_id/update', async function(req, res) {
  // Get the poster to be updated
  const poster = await Poster.where({
    id: req.params.poster_id
  }).fetch({
    require: true
  });

  // Process form
  const posterForm = createPosterForm();
  posterForm.handle(req, {
    // Handle success
    success: async function(form) {
      poster.set(form.data); // This works because the name of the column in posters table matches that of the form field name
      await poster.save();

      res.redirect('/posters');
    },
    // Handle error
    error: async function(form) {
      res.render('posters/update', {
        form: form.toHTML(bootstrapField),
        poster: poster.toJSON()
      })
    }
  })
})

// DELETE
router.get('/:poster_id/delete', async function(req, res) {
  // Get poster to be deleted
  const poster = await Poster.where({
    id: req.params.poster_id
  }).fetch({
    require: true
  });

  res.render('posters/delete', {
    poster: poster.toJSON()
  })
})

router.post('/:poster_id/delete', async function(req, res) {
  // Get the poster to be deleted
  const poster = await Poster.where({
    id: req.params.poster_id
  }).fetch({
    require: true
  });

  // Delete poster
  await poster.destroy();

  res.redirect('/posters');
})

// Export router object for use in other JS files
module.exports = router;