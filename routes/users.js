const express = require('express');
const router = express.Router();
const crypto = require('crypto');

// Import User model
const { User } = require('../models');

// Import forms
const { createRegistrationForm, createLoginForm, bootstrapField } = require('../forms');

// Functions
const getHashedPassword = function(password) {
  const sha256 = crypto.createHash('sha256');
  const hash = sha256.update(password).digest('base64');
  return hash;
}

// Register user
router.get('/register', async function (req, res) {
  // Display registration form
  const registerForm = createRegistrationForm();

  res.render('users/register', {
    form: registerForm.toHTML(bootstrapField)
  })
})

router.post('/register', async function (req, res) {
  const registerForm = createRegistrationForm();
  registerForm.handle(req, {
    success: async function (form) {
      const user = new User();
      user.set('username', form.data.username);
      user.set('password', getHashedPassword(form.data.password));
      user.set('email', form.data.email);

      // Save
      await user.save();

      // Add flash message
      req.flash('success_messages', 'Signed up successfully');

      res.redirect('/users/login');
    },
    error: async function (form) {
      res.render('users/register', {
        form: form.toHTML(bootstrapField)
      })
    },
    empty: async function (form) {
      res.render('users/register', {
        form: form.toHTML(bootstrapField)
      })
    }
  })
})

// Login
router.get('/login', async function(req, res) {
  const loginForm = createLoginForm();

  res.render('users/login', {
    form: loginForm.toHTML(bootstrapField)
  });
})

router.post('/login', async function(req, res) {
  const loginForm = createLoginForm();

  loginForm.handle(req, {
    success: async function(form) {
      // Find user by email and password
      const user = await User.where({
        email: form.data.email,
      }).fetch({
        require: false
      });

      if (!user) {
        // Add flash message
        req.flash('error_messages', 'Invalid email/password');

        res.redirect('/users/login');
      }
      else {
        // Check if password matches
        if (user.get('password') === getHashedPassword(form.data.password)) {
          // Add to session data
          req.session.user = {
            id: user.get('id'),
            username: user.get('username'),
            email: user.get('email')
          }

          // Add flash message
          req.flash('success_messages', `Welcome back, ${user.get('username')}`);

          res.redirect('/users/profile');
        }
        else {
          // Add flash message
          req.flash('error_messages', 'Invalid email/password');

          res.redirect('/users/login');
        }
      }

    },
    error: function(form) {
      // Add flash message
      req.flash('error_messages', 'Invalid email/password');

      res.render('users/login', {
        form: form.toHTML(bootstrapField)
      })
    },
    empty: function(form) {
      // Add flash message
      req.flash('error_messages', 'Please enter email/password');

      res.render('users/login', {
        form: form.toHTML(bootstrapField)
      })
    }
  })
})

// User profile
router.get('/profile', async function(req, res) {
  const user = req.session.user;

  if (!user) {
    // Add flash message
    req.flash('error_messages', 'You do not have permission to view this page');

    res.redirect('/users/login');
  }
  else {
    res.render('users/profile', {
      user: user
    })
  }
})

// Logout
router.get('logout', function(req, res) {
  req.session.user = null;

  // Add flash message
  req.flash('success_messages', 'Successfully logged out');

  res.redirect('/users/login');
})

module.exports = router;