const mongoose = require('mongoose');
const Review = mongoose.model('Review');
const { xss } = require('../handlers/xssHandlers');

exports.addReview = async (req, res) => {
  req.body.author = req.user._id;
  req.body.store = req.params.id;
  req.body.text = xss(req.body.text);
  const newReview = new Review(req.body);
  await newReview.save();
  req.flash('success', 'Revivew Saved!');
  res.redirect('back');
};
