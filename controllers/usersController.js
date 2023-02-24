const bcrypt = require('bcryptjs');
const { User } = require('../models');
const jwt = require('jsonwebtoken');
const config = require('../config');

exports.signupForm = (req, res) => {
  res.render('users/signup');
};

exports.signup = async (req, res) => {
  const { name, email, password } = req.body;
  const hash = await bcrypt.hash(password, 10);

  try {
    const user = await User.create({ name, email, password: hash });
    req.session.user = user;
    // Create and sign a JWT token
    const token = jwt.sign({ id: user.id }, config.jwtSecret, {
        expiresIn: '1h',
      });
  
    // Set the token as a cookie
    res.cookie('token', token, {
    httpOnly: true,
    sameSite: 'strict',
    });

    req.flash('success', 'You have signed up successfully!');
    res.redirect('/');
  } catch (error) {
    req.flash('error', 'There was an error creating your account. Please try again.');
    res.redirect('/users/signup');
  }
};

exports.loginForm = (req, res) => {
  res.render('users/login');
};

exports.login = async (req, res) => {
  const { email, password } = req.body;
  const user = await User.findOne({ where: { email } });

  if (user && await bcrypt.compare(password, user.password)) {
    req.session.user = user;
    // Create and sign a JWT token
    const token = jwt.sign({ id: user.id }, config.jwtSecret, {
        expiresIn: '1h',
      });
  
    // Set the token as a cookie
    res.cookie('token', token, {
    httpOnly: true,
    sameSite: 'strict',
    });
    req.flash('success', 'You have logged in successfully!');
    res.redirect('/');
  } else {
    req.flash('error', 'Invalid email or password.');
    res.redirect('/users/login');
  }
};

exports.logout = (req, res) => {
  req.session.destroy();
  res.clearCookie('token');
  res.redirect('/users/login');
};
