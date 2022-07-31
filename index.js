// Require dependencies
const express = require('express');
const hbs = require('hbs');
const wax = require('wax-on');
const helpers = require('handlebars-helpers')({
  handlebars: hbs.handlebars
})
const session = require('express-session');
const flash = require('connect-flash');
const FileStore = require('session-file-store')(session);

// Initialise Express app
const app = express();

// Set up view engine
app.set('view engine', 'hbs');

// Set up static folder
app.set(express.static('public'));

// Set up wax-on
wax.on(hbs.handlebars);
wax.setLayoutPath('./views/layouts');

// Set up sessions
app.use(session({
  store: new FileStore(),
  secret: 'keyboard cat',
  resave: false, // whether to recreate session even if there is no change to it
  saveUninitialized: true // whether to create session if a new browser connects
}))

// Import routes
// alternatively:
// app.use('/', require('./routes/landing'));
const landingRoutes = require('./routes/landing');
const posterRoutes = require('./routes/posters')
app.use('/', landingRoutes);
app.use('/posters', posterRoutes)

app.listen(3000, function(){
  console.log('Server has started');
})