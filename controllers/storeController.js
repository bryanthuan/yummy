const mongoose = require('mongoose');
const _ = require('lodash');

const { Store } = require('../models/Store');

exports.homePage = (req, res) => {
  // console.log(req.name);
  res.render('index', {title: 'Home Page'});
};

exports.addStore = (req, res) => {
  res.render('editStore', { title: 'Add Store' });
};

exports.createStore = async (req, res) => {
  // res.json(req.body);
  const body = _.pick(req.body, ['name', 'description','tags']);
  const store = await (new Store(body)).save();   
  req.flash('success',`Successfully created ${store.name}. Care to leave a review ?`);
  res.redirect(`/store/${store.slug}`);
};
