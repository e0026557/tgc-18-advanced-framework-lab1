const bookshelf = require('../bookshelf');

const Poster = bookshelf.model('Poster', {
  tableName: 'posters',
  mediaProperty: function() {
    return this.belongsTo('MediaProperty')
  }
})

const MediaProperty = bookshelf.model('MediaProperty', {
  tableName: 'media_properties',
  posters: function() {
    return this.hasMany('Poster');
  }
})

module.exports = {Poster, MediaProperty}