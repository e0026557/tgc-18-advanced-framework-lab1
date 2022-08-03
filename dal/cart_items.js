// TODO
const { CartItem } = require('../models');

const getCart = async function (userId) {
  // Get all items in user's shopping cart
  return await CartItem.collection().where({
    user_id: userId
  }).fetch({
    require: false,
    withRelated: ['poster', 'poster.mediaProperty']
  });
}

const getCartItem = async function (userId, posterId) {
  // Get a cart item in user's shopping cart
  return await CartItem.collection.where({
    user_id: userId,
    poster_id: posterId
  }).fetch({
    require: false
  });
}

// TODO: createCartItem

// TODO: removeFromCart

// TODO: updateQuantity

module.exports = { getCart, getCartItem };