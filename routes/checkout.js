const express = require('express');
const router = express.Router();

const { checkIfAuthenticated } = require('./../middlewares');
const CartServices = require('./../services/cart_services');
const Stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);

router.get('/', checkIfAuthenticated, async function (req, res) {
  // Get all cart items from user's shopping cart
  const cartItems = await CartServices.getCart(req.session.user.id);

  // Step 1: Create line items
  let lineItems = [];
  let meta = [];
  for (let item of cartItems) {
    // Note: Each key in line item is determined by Stripe
    const lineItem = {
      name: item.related('poster').get('title'),
      amount: item.related('poster').get('cost'), // must be in cents according to Stripe
      quantity: item.get('quantity'),
      currency: 'SGD'
    }

    // Check if line item has an image
    if (item.related('poster').get('image_url')) {
      // Stripe expects an array of images
      lineItem.images = [item.related('poster').get('image_url')];
    }

    lineItems.push(lineItem);

    // Save the meta data of each line item
    meta.push({
      poster_id: item.get('poster_id'),
      quantity: item.get('quantity')
    })
  }

  // Step 2: Create Stripe payment
  let metaData = JSON.stringify(meta);
  const payment = {
    payment_method_types: ['card'],
    line_items: lineItems,
    success_url: process.env.STRIPE_SUCCESS_URL + "?sessionId={CHECKOUT_SESSION_ID}",
    cancel_url: process.env.STRIPE_CANCEL_URL,
    metadata: {
      orders: metaData
    }
  };

  // Step 3: Register the session
  let stripeSession = await Stripe.checkout.sessions.create(payment);
  res.render('checkout/checkout', {
    // Step 4: Get the id of the payment session
    sessionId: stripeSession.id,
    publishableKey: process.env.STRIPE_PUBLISHABLE_KEY
  })
})

router.get('/success', checkIfAuthenticated, function (req, res) {
  res.render('checkout/success');
})

router.get('/cancel', checkIfAuthenticated, function (req, res) {
  res.render('checkout/cancel');
})

module.exports = router;