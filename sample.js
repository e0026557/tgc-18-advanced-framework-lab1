let obj = {
  id: 'cs_test_b1xpTewYbLZDFOIMmX4X8hd7VAH2ek7H8r6H5XIcCaWObUgZYH4rQSXE3y',
    object: 'checkout.session',
      after_expiration: null,
        allow_promotion_codes: null,
          amount_subtotal: 15000,
            amount_total: 15000,
              automatic_tax: { enabled: false, status: null },
  billing_address_collection: null,
    cancel_url: 'https://3000-e0026557-tgc18advancedf-lbmgztyn685.ws-us59.gitpod.io/checkout/cancel',
      client_reference_id: null,
        consent: null,
          consent_collection: null,
            currency: 'sgd',
              customer: 'cus_MCYU9oDr9wdo0A',
                customer_creation: 'always',
                  customer_details: {
    address: {
      city: null,
        country: 'SG',
          line1: 'Choa Chu Kang Avenue 4',
            line2: 'block 3321',
              postal_code: '681671',
                state: null
    },
    email: 'admin@gmail.com',
      name: 'admin',
        phone: null,
          tax_exempt: 'none',
            tax_ids: []
  },
  customer_email: null,
    expires_at: 1659964332,
      livemode: false,
        locale: null,
          metadata: {
    orders: '[{"poster_id":12,"quantity":2},{"poster_id":7,"quantity":1}]'
  },
  mode: 'payment',
    payment_intent: 'pi_3LU9H6KvC3BRLMzb1t2ACfDT',
      payment_link: null,
        payment_method_options: { },
  payment_method_types: ['card'],
    payment_status: 'paid',
      phone_number_collection: { enabled: false },
  recovered_from: null,
    setup_intent: null,
      shipping: {
    address: {
      city: '',
        country: 'SG',
          line1: 'Choa Chu Kang Avenue 4',
            line2: 'block 3321',
              postal_code: '681671',
                state: ''
    },
    name: 'admin'
  },
  shipping_address_collection: { allowed_countries: ['SG'] },
  shipping_options: [],
    shipping_rate: null,
      status: 'complete',
        submit_type: null,
          subscription: null,
            success_url: 'https://3000-e0026557-tgc18advancedf-lbmgztyn685.ws-us59.gitpod.io/checkout/success?sessionId={CHECKOUT_SESSION_ID}',
              total_details: { amount_discount: 0, amount_shipping: 0, amount_tax: 0 },
  url: null
}