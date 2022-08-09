const checkIfAuthenticated = function (req, res, next) {
  if (req.session.user) {
    next();
  }
  else {
    // Store user's intended path before login
    // req.originalUrl is the endpoint
    req.session.redirectTo = req.originalUrl || '/';

    // Add flash message
    req.flash('error_messages', 'You need to log in to access this page');

    res.redirect('/users/login');
  }
}

module.exports = {
  checkIfAuthenticated
}