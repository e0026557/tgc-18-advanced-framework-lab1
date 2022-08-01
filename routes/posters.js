const express = require('express');
const { createPosterForm, createSearchForm, bootstrapField } = require('../forms');
const router = express.Router(); // Create a router object

// Import in the Poster model
const { Poster, MediaProperty, Tag } = require('../models');

// Import middleware
const { checkIfAuthenticated } = require('../middlewares');

// ---------------------------------------
// READ
// router.get('/', async function (req, res) {
//   // Fetch all the posters
//   let posters = await Poster.collection().fetch({
//     withRelated: ['mediaProperty', 'tags'] // Name of the relationship (function name in model)
//   });

//   res.render('posters/index', {
//     posters: posters.toJSON()
//   }) // relative to 'views' folder
// })
// ---------------------------------------

// READ (WITH SEARCH ENGINE)
router.get('/', async function (req, res) {
  // Get all media properties
  const mediaProperties = await MediaProperty.fetchAll().map(property => [property.get('id'), property.get('name')]);

  mediaProperties.unshift([0, '--- Any media property ---']); // Append an option to front of array to select all media properties

  // Get all tags
  const tags = await Tag.fetchAll().map(tag => [tag.get('id'), tag.get('name')]);

  // Create search engine
  const searchForm = createSearchForm(mediaProperties, tags);

  // Create query builder
  let query = Poster.collection();

  searchForm.handle(req, {
    success: async function (form) {
      if (form.data.title) {
        query = query.where('title', 'like', `%${form.data.title}%`);
      }

      if (form.data.min_cost) {
        query = query.where('cost', '>=', form.data.min_cost);
      }

      if (form.data.max_cost) {
        query = query.where('cost', '<=', form.data.max_cost);
      }

      if (form.data.min_width) {
        query = query.where('width', '>=', form.data.min_width);
      }

      if (form.data.max_width) {
        query = query.where('width', '<=', form.data.max_width);
      }

      if (form.data.min_height) {
        query = query.where('height', '>=', form.data.min_height);
      }

      if (form.data.max_height) {
        query = query.where('height', '<=', form.data.max_height);
      }

      if (form.data.media_property_id && form.data.media_property_id !== '0') {
        query = query.where('media_property_id', '=', form.data.media_property_id);
      }

      if (form.data.tags) {
        query.query('join', 'posters_tags', 'posters.id', 'poster_id').where('tag_id', 'in', form.data.tags.split(','));
      }

      const posters = await query.fetch({
        withRelated: ['mediaProperty', 'tags']
      });

      res.render('posters/index', {
        posters: posters.toJSON(),
        form: form.toHTML(bootstrapField)
      }) // relative to 'views' folder
    },
    empty: async function (form) {
      // Fetch all the posters
      let posters = await query.fetch({
        withRelated: ['mediaProperty', 'tags'] // Name of the relationship (function name in model)
      });

      res.render('posters/index', {
        posters: posters.toJSON(),
        form: form.toHTML(bootstrapField)
      }) // relative to 'views' folder
    },
    error: async function (form) {
      // Fetch all the posters
      let posters = await query.fetch({
        withRelated: ['mediaProperty', 'tags'] // Name of the relationship (function name in model)
      });

      res.render('posters/index', {
        posters: posters.toJSON(),
        form: form.toHTML(bootstrapField)
      }) // relative to 'views' folder
    }
  })


})

// CREATE
router.get('/create', checkIfAuthenticated, async function (req, res) {
  // Get all media properties
  const mediaProperties = await MediaProperty.fetchAll().map(property => [property.get('id'), property.get('name')]);

  // Get all tags
  const tags = await Tag.fetchAll().map(tag => [tag.get('id'), tag.get('name')]);

  const posterForm = createPosterForm(mediaProperties, tags);
  res.render('posters/create', {
    form: posterForm.toHTML(bootstrapField),
    // Add cloudinary information
    cloudinaryName: process.env.CLOUDINARY_NAME,
    cloudinaryApiKey: process.env.CLOUDINARY_API_KEY,
    cloudinaryPreset: process.env.CLOUDINARY_UPLOAD_PRESET
  })
})

router.post('/create', checkIfAuthenticated, async function (req, res) {
  // Get all media properties
  const mediaProperties = await MediaProperty.fetchAll().map(property => [property.get('id'), property.get('name')]);

  // Get all tags
  const tags = await Tag.fetchAll().map(tag => [tag.get('id'), tag.get('name')]);

  const posterForm = createPosterForm(mediaProperties, tags);
  posterForm.handle(req, {
    // Handle success
    success: async function (form) {
      const poster = new Poster(); // represents one row in the posters table
      poster.set('title', form.data.title);
      poster.set('cost', form.data.cost);
      poster.set('description', form.data.description);
      poster.set('date', form.data.date);
      poster.set('stock', form.data.stock);
      poster.set('height', form.data.height);
      poster.set('width', form.data.width);
      // Add foreign key
      poster.set('media_property_id', form.data.media_property_id);

      // Add image_url
      poster.set('image_url', form.data.image_url);
      await poster.save();

      // Save m:m relationship with tags
      if (form.data.tags) {
        await poster.tags().attach(form.data.tags.split(','));
      }

      // Add flash message
      req.flash("success_messages", `New poster ${poster.get('title')} has been created`);

      res.redirect('/posters');
    },
    // Handle errors
    error: async function (form) {
      // Render the create hbs file with the processed form with bootstrap formatted error messages
      res.render('posters/create', {
        form: form.toHTML(bootstrapField),
        // Add cloudinary information
        cloudinaryName: process.env.CLOUDINARY_NAME,
        cloudinaryApiKey: process.env.CLOUDINARY_API_KEY,
        cloudinaryPreset: process.env.CLOUDINARY_UPLOAD_PRESET
      })
    },
    empty: async function (form) {
      // Render the create hbs file with the processed form with bootstrap formatted error messages
      res.render('posters/create', {
        form: form.toHTML(bootstrapField),
        // Add cloudinary information
        cloudinaryName: process.env.CLOUDINARY_NAME,
        cloudinaryApiKey: process.env.CLOUDINARY_API_KEY,
        cloudinaryPreset: process.env.CLOUDINARY_UPLOAD_PRESET
      })
    }
  })
})

// UPDATE
router.get('/:poster_id/update', checkIfAuthenticated, async function (req, res) {
  // Get poster to be updated
  const posterId = req.params.poster_id;
  const poster = await Poster.where({
    id: posterId
  }).fetch({
    require: true,
    withRelated: ['mediaProperty', 'tags']
  })

  // Get all media properties
  const mediaProperties = await MediaProperty.fetchAll().map(property => [property.get('id'), property.get('name')]);

  // Get all tags
  const tags = await Tag.fetchAll().map(tag => [tag.get('id'), tag.get('name')]);

  // Create poster form
  const posterForm = createPosterForm(mediaProperties, tags);

  // Fill in poster form with existing values
  posterForm.fields.title.value = poster.get('title');
  posterForm.fields.cost.value = poster.get('cost');
  posterForm.fields.description.value = poster.get('description');
  posterForm.fields.date.value = poster.get('date');
  posterForm.fields.stock.value = poster.get('stock');
  posterForm.fields.height.value = poster.get('height');
  posterForm.fields.width.value = poster.get('width');

  posterForm.fields.media_property_id.value = poster.get('media_property_id')

  posterForm.fields.image_url.value = poster.get('image_url');

  let selectedTags = await poster.related('tags').pluck('id');
  posterForm.fields.tags.value = selectedTags;

  res.render('posters/update', {
    form: posterForm.toHTML(bootstrapField),
    poster: poster.toJSON(),
    // Add cloudinary information
    cloudinaryName: process.env.CLOUDINARY_NAME,
    cloudinaryApiKey: process.env.CLOUDINARY_API_KEY,
    cloudinaryPreset: process.env.CLOUDINARY_UPLOAD_PRESET
  })
})

router.post('/:poster_id/update', checkIfAuthenticated, async function (req, res) {
  // Get the poster to be updated
  const poster = await Poster.where({
    id: req.params.poster_id
  }).fetch({
    require: true,
    withRelated: ['mediaProperty', 'tags']
  });

  // Get all media properties
  const mediaProperties = await MediaProperty.fetchAll().map(property => [property.get('id'), property.get('name')]);

  // Get all tags
  const tags = await Tag.fetchAll().map(tag => [tag.get('id'), tag.get('name')]);

  // Process form
  const posterForm = createPosterForm(mediaProperties, tags);
  posterForm.handle(req, {
    // Handle success
    success: async function (form) {
      let { tags, ...posterData } = form.data;
      poster.set(posterData); // This works because the name of the column in posters table matches that of the form field name
      await poster.save();

      // Update tags
      let tagIds = tags.split(',').map(id => parseInt(id)); // To convert id to int (default is string)
      let existingTagIds = await poster.related('tags').pluck('id'); // Get ids of all tags that are currently in poster

      // Remove all tags that are not selected anymore
      let toRemove = existingTagIds.filter(id => !tagIds.includes(id));
      await poster.tags().detach(toRemove);

      // Add in all the tags selected in the form
      await poster.tags().attach(tagIds);

      // Add flash message
      req.flash('success_messages', `Poster ${poster.get('title')} successfully updated`);

      res.redirect('/posters');
    },
    // Handle error
    error: async function (form) {
      res.render('posters/update', {
        form: form.toHTML(bootstrapField),
        poster: poster.toJSON()
      })
    },
    // Handle empty
    empty: async function (form) {
      res.render('posters/update', {
        form: form.toHTML(bootstrapField),
        poster: poster.toJSON()
      })
    }
  })
})

// DELETE
router.get('/:poster_id/delete', checkIfAuthenticated, async function (req, res) {
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

router.post('/:poster_id/delete', checkIfAuthenticated, async function (req, res) {
  // Get the poster to be deleted
  const poster = await Poster.where({
    id: req.params.poster_id
  }).fetch({
    require: true
  });

  // Delete poster
  await poster.destroy();

  // Add flash message
  req.flash('success_messages', `Poster ${poster.get('title')} successfully deleted`);

  res.redirect('/posters');
})

// Export router object for use in other JS files
module.exports = router;