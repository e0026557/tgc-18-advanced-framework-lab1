// Require datalayer for cart items
const cartDataLayer = require('../dal/cart_items');
const { post } = require('../routes/posters');

const getCart = async function (userId) {
  // Get all cart items of user
  return await cartDataLayer.getCart(userId);
}

const addToCart = async function (userId, posterId, quantity) {
  // Retrieve cart item
  const cartItem = await cartDataLayer.getCartItem(userId, posterId);

  // Update quantity if cart item exists in user's shopping cart
  if (cartItem) {
    const currentQuantity = cartItem.get('quantity');
    return await cartDataLayer.updateQuantity(userId, posterId, currentQuantity + 1);
  }
  else {
    // Create new cart item if cart item does not exist in user's shopping cart
    const newCartItem = await cartDataLayer.createCartItem(userId, posterId, quantity);
    return newCartItem;
  }
}

const removeFromCart = async function (userId, posterId) {
  return await cartDataLayer.removeFromCart(userId, posterId);
}

const setQuantity = async function (userId, posterId, quantity) {
  return await cartDataLayer.updateQuantity(userId, posterId, quantity);
}

module.exports = {
  getCart,
  addToCart,
  removeFromCart,
  setQuantity
}