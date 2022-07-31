const checkIfAuthenticated = function (req, res, next) {
  if (req.session.user) {
    next();
  }
  else {
    // Add flash message
    req.flash('error_messages', 'You need to log in to access this page');

    res.redirect('/users/login');
  }
}

module.exports = {
  checkIfAuthenticated
}