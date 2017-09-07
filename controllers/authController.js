const passport = require('passport');
const mongoose = require('mongoose');
const User = mongoose.model('User');
const crypto = require('crypto');
const promisify = require('es6-promisify');

const login =  passport.authenticate('local', {
    failureRedirect: '/login',
    failureFlash: 'Failed Login!',
    successRedirect: '/',
    successFlash: 'You are now logged in!'
});  

const logout = (req, res) => {
  req.logout();
  req.flash('success', 'You are now logged out!');
  res.redirect('/');
};

const isLoggedIn = (req, res, next) => {
  if (req.isAuthenticated()) {
    return next();
  }
  else {
    req.flash('error','Ops!, you must loggin first !')
    res.redirect('/login');
  }
};

const forgot = async (req, res) => {
  // See if a user with that email exists
  const user  = await User.findOne({email: req.body.email});
  if (!user) {
    req.flash('error', 'A password reset has been mailed to you');
    return res.redirect('/login');
  }
  // Set reset tokens and expiry on their account
  user.resetPasswordToken = crypto.randomBytes(20).toString('hex');
  user.resetPasswordExpires = Date.now() + 3600000;
  await user.save();
  // Send them an email with the token
  const resetUrl = `http://${req.headers.host}/account/reset/${user.resetPasswordToken}`;

  req.flash('success', `You have been emailed a password reset link. ${resetUrl}`);
  // Redirect to login page
  res.redirect('/login');
};

const reset = async (req, res) => {
  const user = await User.findOne({
    resetPasswordToken: req.params.token,
    resetPasswordExpires: { $gt: Date.now() }
  });

  if (!user) {
    req.flash('error', 'Passowrd reset is invalid or has expired');
    return res.redirect('/login');
  }
  res.render('auth/reset', {title: 'Reset your password'});
};

const confirmPasswords = (req, res, next) => {
  if(req.body.password === req.body['password-confirm']) {
    return next();
  }
  req.flash('error','Password do not match!');
  res.redirect('back');
};

const updatePassword = async (req, res) => {
  const user = await User.findOne({
    resetPasswordToken: req.params.token,
    resetPasswordExpires: { $gt: Date.now() }
  });

  if (!user) {
    req.flash('error', 'Passowrd reset is invalid or has expired');
    return res.redirect('/login');
  }
  const setPassword = promisify(user.setPassword, user);
  await setPassword(req.body.password);
  user.resetPasswordToken = undefined;
  user.resetPasswordExpires = undefined;
  const updateUser = await user.save();
  await req.login(updateUser);
  req.flash('success','Nice! Your password has been updated, you are now logged in.');
  res.redirect('/');
};

module.exports = { 
    login, 
    logout, 
    isLoggedIn, 
    forgot, 
    reset, 
    confirmPasswords, 
    updatePassword 
};