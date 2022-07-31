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

// Set up flash (requires sessions to work --> set up after sessions)
app.use(flash());

app.use(function (req, res, next) {
  res.locals.success_messages = req.flash('success_messages');
  res.locals.error_messages = req.flash('error_messages');
  next();
});

// Share the user data with hbs files
app.use(function(req, res, next) {
  res.locals.user = req.session.user;
  next();
})

// Import routes
// alternatively:
// app.use('/', require('./routes/landing'));
const landingRoutes = require('./routes/landing');
const posterRoutes = require('./routes/posters');
const userRoutes = require('./routes/users');

app.use('/', landingRoutes);
app.use('/posters', posterRoutes)
app.use('/users', userRoutes)

app.listen(3000, function () {
  console.log('Server has started');
})