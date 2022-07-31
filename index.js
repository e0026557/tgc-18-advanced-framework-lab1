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
const csrf = require('csurf');
require('dotenv').config();

// Initialise Express app
const app = express();

// Set up view engine
app.set('view engine', 'hbs');

// Set up static folder
app.set(express.static('public'));

// Set up wax-on
wax.on(hbs.handlebars);
wax.setLayoutPath('./views/layouts');

// Set up form processing (needed for csrf to work)
app.use(express.urlencoded({
  extended: false
}));

// Set up sessions
app.use(session({
  store: new FileStore(),
  secret: 'keyboard cat',
  resave: false, // whether to recreate session even if there is no change to it
  saveUninitialized: true // whether to create session if a new browser connects
}))

// Set up flash (requires sessions to work --> set up after sessions)
app.use(flash());

app.use(function (req, res, next) {
  res.locals.success_messages = req.flash('success_messages');
  res.locals.error_messages = req.flash('error_messages');
  next();
});

// Share the user data with hbs files
app.use(function (req, res, next) {
  res.locals.user = req.session.user;
  next();
})

// Set up CSRF
app.use(csrf());

// Handle CSRF error
app.use(function (err, req, res, next) {
  if (err && err.code === 'EBADCSRFTOKEN') {
    // Add flash message
    req.flash('error_messages', 'The form has expired. Please try again');

    res.redirect('back');
  }
  else {
    next();
  }
})

// Share CSRF with hbs files
app.use(function (req, res, next) {
  res.locals.csrfToken = req.csrfToken();
  next();
})

// Import routes
// alternatively:
// app.use('/', require('./routes/landing'));
const landingRoutes = require('./routes/landing');
const posterRoutes = require('./routes/posters');
const userRoutes = require('./routes/users');
const cloudinaryRoutes = require('./routes/cloudinary');

app.use('/', landingRoutes);
app.use('/posters', posterRoutes);
app.use('/users', userRoutes);
app.use('/cloudinary', cloudinaryRoutes);

app.listen(3000, function () {
  console.log('Server has started');
})