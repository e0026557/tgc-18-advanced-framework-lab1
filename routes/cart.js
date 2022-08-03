const express = require('express');
const router = express.Router();

// Require cart services
const cartServices = require('../services/cart_services');

router.get('/', async function (req, res) {
  // Get all cart items in user's shopping cart
  const userId = req.session.user.id;
  const cartItems = await cartServices.getCart(userId);

  res.render('cart/index', {
    cartItems: cartItems.toJSON()
  });
})

router.get('/:poster_id/add', async function (req, res) {
  const userId = req.session.user.id;
  const posterId = req.params.poster_id;

  // Add poster to cart
  await cartServices.addToCart(userId, posterId, 1);

  req.flash('success_messages', 'Poster successfully added to cart');
  res.redirect('/posters');
})

router.get('/:poster_id/remove', async function (req, res) {
  const userId = req.session.user.id;
  const posterId = req.params.poster_id;

  // Remove poster from cart
  await cartServices.removeFromCart(userId, posterId);

  req.flash('success_messages', 'Poster has been removed from shopping cart');
  res.redirect('/posters');
})

router.post('/:poster_id/update', async function (req, res) {
  const userId = req.session.user.id;
  const posterId = req.params.poster_id;
  const newQuantity = req.body.newQuantity;

  // Update quantity of cart item
  await cartServices.setQuantity(userId, posterId, newQuantity);

  req.flash('success_messages', 'Quantity updated successfully');
  res.redirect('/cart/');
})

module.exports = router;