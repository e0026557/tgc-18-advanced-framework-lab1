// Require dependencies
const express = require('express');
const hbs = require('hbs');
const wax = require('wax-on');
const helpers = require('handlebars-helpers')({
  handlebars: hbs.handlebars
})

// Initialise Express app
const app = express();

// Set up view engine
app.set('view engine', 'hbs');

// Set up static folder
app.set(express.static('public'));

// Set up wax-on
wax.on(hbs.handlebars);
wax.setLayoutPath('./views/layouts');

// Import routes
// alternatively:
// app.use('/', require('./routes/landing'));
const landingRoutes = require('./routes/landing');
app.use('/', landingRoutes);

app.listen(3000, function(){
  console.log('Server has started');
})