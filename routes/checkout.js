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
    payment_method_types: ['card', 'grabpay', 'paynow'],
    billing_address_collection: 'required',
    shipping_address_collection: {
      allowed_countries: ['SG'],
    },
    line_items: lineItems,
    success_url: process.env.STRIPE_SUCCESS_URL + "?sessionId={CHECKOUT_SESSION_ID}",
    cancel_url: process.env.STRIPE_CANCEL_URL,
    metadata: {
      orders: metaData
    },
    shipping_options: [{
      shipping_rate_data: {
        display_name: 'Normal Delivery',
        type: 'fixed_amount',
        fixed_amount: {
          amount: 500,
          currency: 'SGD'
        },
        delivery_estimate: {
          minimum: {
            unit: 'business_day',
            value: '5'
          },
          maximum: {
            unit: 'business_day',
            value: '7'
          }
        }
      }
    },
    {
      shipping_rate_data: {
        display_name: 'Express Delivery',
        type: 'fixed_amount',
        fixed_amount: {
          amount: 1000,
          currency: 'SGD'
        },
        delivery_estimate: {
          minimum: {
            unit: 'business_day',
            value: '1'
          },
          maximum: {
            unit: 'business_day',
            value: '2'
          }
        }
      }
    }]
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

router.post('/process_payment', express.raw({ type: 'application/json' }), async function (req, res) {
  let payload = req.body; // payment information is inside req.body
  let endpointSecret = process.env.STRIPE_ENDPOINT_SECRET;
  let sigHeader = req.headers["stripe-signature"]; // when stripe sends us the information, there will be a signature and the key will be 'stripe-signature'
  let event = null;

  // try to extract out the information and ensures that it is legit (actually comes from Stripe)
  try {
    event = Stripe.webhooks.constructEvent(payload, sigHeader, endpointSecret);

    if (event.type == 'checkout.session.completed') {
      // payment session information
      let stripeSession = event.data.object;
      console.log(stripeSession);
      // metadata information
      const metadata = JSON.parse(event.data.object.metadata.orders);
      console.log(metadata);
      const shippingRate = await Stripe.shippingRates.retrieve(stripeSession.shipping_rate); // retrieve selected shipping rate option
      console.log(shippingRate)
      res.send({
        success: true
      });
    }
  }
  catch (err) {
    console.log(err);
    res.status(500);
    res.send({
      error: err.message
    })
  }
})

module.exports = router;