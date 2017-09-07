const passport = require('passport');

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
}

const isLoggedIn = (req, res, next) => {
  if (req.isAuthenticated()) {
    return next();
  }
  else {
    req.flash('error','Ops!, you must loggin first !')
    res.redirect('/login');
  }
}

module.exports = { login, logout, isLoggedIn };