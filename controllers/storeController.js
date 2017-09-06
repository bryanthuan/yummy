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
  const store = new Store(body);
  await store.save();
  console.log('Saved.');
};
