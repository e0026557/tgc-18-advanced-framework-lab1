let stripeSessionObj = {
  id: 'cs_test_b1TKOw1JVr3hNPDGhgVzIBb9QUtimRMDTmagwp6CaJKqr78WX6dda0ZkHL',
  object: 'checkout.session',
  after_expiration: null,
  allow_promotion_codes: null,
  amount_subtotal: 15000,
  amount_total: 15500,
  automatic_tax: { enabled: false, status: null },
  billing_address_collection: 'required',
  cancel_url: 'https://3000-e0026557-tgc18advancedf-lbmgztyn685.ws-us59.gitpod.io/checkout/cancel',
  client_reference_id: null,
  consent: null,
  consent_collection: null,
  currency: 'sgd',
  customer: 'cus_MCj6ft5Xy5n1AX',
  customer_creation: 'always',
  customer_details: {
    address: {
      city: null,
      country: 'SG',
      line1: '39 Lorong Melayu',
      line2: null,
      postal_code: '416923',
      state: null
    },
    email: 'admin@gmail.com',
    name: 'admin',
    phone: null,
    tax_exempt: 'none',
    tax_ids: []
  },
  customer_email: null,
  expires_at: 1660004218,
  livemode: false,
  locale: null,
  metadata: {
    orders: '[{"poster_id":12,"quantity":2},{"poster_id":7,"quantity":1}]'
  },
  mode: 'payment',
  payment_intent: 'pi_3LUJeQKvC3BRLMzb2pqoEGta',
  payment_link: null,
  payment_method_options: {},
  payment_method_types: [ 'card', 'grabpay', 'paynow' ],
  payment_status: 'paid',
  phone_number_collection: { enabled: false },
  recovered_from: null,
  setup_intent: null,
  shipping: {
    address: {
      city: '',
      country: 'SG',
      line1: '39 Lorong Melayu',
      line2: null,
      postal_code: '416923',
      state: ''
    },
    name: 'admin'
  },
  shipping_address_collection: { allowed_countries: [ 'SG' ] },
  shipping_options: [
    {
      shipping_amount: 500,
      shipping_rate: 'shr_1LUJeQKvC3BRLMzbneTgA4KF'
    },
    {
      shipping_amount: 1000,
      shipping_rate: 'shr_1LUJeQKvC3BRLMzbcwdMo2RI'
    }
  ],
  shipping_rate: 'shr_1LUJeQKvC3BRLMzbneTgA4KF',
  status: 'complete',
  submit_type: null,
  subscription: null,
  success_url: 'https://3000-e0026557-tgc18advancedf-lbmgztyn685.ws-us59.gitpod.io/checkout/success?sessionId={CHECKOUT_SESSION_ID}',
  total_details: { amount_discount: 0, amount_shipping: 500, amount_tax: 0 },
  url: null
}