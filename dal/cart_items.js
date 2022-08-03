const { CartItem } = require('../models');

const getCart = async function (userId) {
  // Get all items in user's shopping cart
  return await CartItem.collection()
    .where({
      user_id: userId
    })
    .fetch({
      require: false,
      withRelated: ['poster', 'poster.mediaProperty']
    });
};

const getCartItem = async function (userId, posterId) {
  // Get a cart item in user's shopping cart
  return await CartItem.where({
      user_id: userId,
      poster_id: posterId
    })
    .fetch({
      require: false
    });
};

const createCartItem = async function (userId, posterId, quantity) {
  // Create new instance of CartItem model (a row in cart_items table)
  const cartItem = new CartItem({
    user_id: userId,
    poster_id: posterId,
    quantity: quantity
  });

  // Save instance
  await cartItem.save();

  // Return the newly created cart item
  return cartItem;
};

const removeFromCart = async function (userId, posterId) {
  // Retrieve the cart item to be removed
  const cartItem = await getCartItem(userId, posterId);

  // If cart item exists, destroy it
  if (cartItem) {
    await cartItem.destroy();
    return true; // Indicate success
  }
  else {
    return false; // Indicate failure
  }
}

const updateQuantity = async function (userId, posterId, newQuantity) {
  // Retrieve cart item to be updated
  const cartItem = await getCartItem(userId, posterId);

  // Update quantity if cart item exists
  if (cartItem) {
    cartItem.set('quantity', parseInt(newQuantity));
    await cartItem.save();
    return true; // Indicate success
  }
  else {
    return false; // Indicate failure
  }
}

module.exports = {
  getCart,
  getCartItem,
  createCartItem,
  removeFromCart,
  updateQuantity
};
