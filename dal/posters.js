// Require the Poster model
const { Poster, MediaProperty, Tag } = require('../models');

const getAll = async function () {
  const posters = await Poster.collection().fetch({
    withRelated: ['mediaProperty', 'tags']
  });

  return posters;
}

const getMediaProperties = async function () {
  const mediaProperties = await MediaProperty.fetchAll().map(property => [property.get('id'), property.get('name')]);

  return mediaProperties;
}

const getTags = async function () {
  const tags = await Tag.fetchAll().map(tag => [tag.get('id'), tag.get('name')]);

  return tags;
}

const findPoster = async function (posterId) {
  try {
    const poster = Poster.where({
      id: parseInt(posterId)
    }).fetch({
      require: true,
      withRelated: ['mediaProperty', 'tags']
    });

    return poster;
  }
  catch (err) {
    console.log(err);
    return null; // Indicate failure 
  }
}

const addPoster = async function (data) {
  // Create new instance of Poster model (represents a row in posters table)
  const poster = new Poster();

  // Separate poster data and tags
  let { tags, ...posterData } = data;

  // Populate new poster with data
  poster.set(posterData);

  // Save instance of Poster model
  await poster.save();

  // Add m:m relationship with tags (if applicable)
  if (tags) {
    await poster.tags().attach(tags.split(','));
  }

  return poster;
}

const updatePoster = async function (posterId, data) {
  // Find poster by id
  const poster = await findPoster(posterId);

  // If poster is not found
  if (!poster) {
    return false; // Indicate failure
  }

  // Separate poster data and tags
  let { tags, ...posterData } = data;

  // Populate poster with new data
  poster.set(posterData);

  // Save instance of Poster model
  await poster.save();

  // Update m:m relationship with tags
  let tagIds = tags.split(',').map(id => parseInt(id)); // Split all selected tags into an array and map it to int (default is string)
  let existingTagIds = await poster.related('tags').pluck('id'); // Get the id of all tags that are currently associated with the poster

  // Remove existing tags that are no longer selected
  let toRemove = existingTagIds.filter(id => !tagIds.includes(id)); // Get the id of all existing tags that are no longer selected
  await poster.tags().detach(toRemove);

  // Add all tags selected (duplicates are handled by bookshelf)
  await poster.tags().attach(tagIds);

  return true; // Indicate success
}

const deletePoster = async function (posterId) {
  // Find poster by id
  const poster = await findPoster(posterId);

  // If poster is not found
  if (!poster) {
    return false; // Indicate failure
  }

  // Delete poster
  await poster.destroy();

  return true; // Indicate success
}


module.exports = {
  getAll,
  getMediaProperties,
  getTags,
  findPoster,
  addPoster,
  updatePoster,
  deletePoster
};