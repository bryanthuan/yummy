const mongoose = require('mongoose');
const _ = require('lodash');

const { Store } = require('../models/Store');

exports.homePage = (req, res) => {
  res.render('index', {title: 'Home Page'});
};

exports.addStore = (req, res) => {
  res.render('editStore', { title: 'Add Store' });
};

exports.createStore = async (req, res) => {
  const body = _.pick(req.body, ['name', 'description','tags']);
  const store = await (new Store(body)).save();   
  req.flash('success',`Successfully created ${store.name}. Care to leave a review ?`);
  res.redirect(`/store/${store.slug}`);
};

exports.getStores = async (req, res) => {
  const stores = await Store.find();
  res.render('stores', { title: 'Stores', stores });
}

exports.editStore = async (req, res) => {
  // 1. Find the tstore given the id
    const store = await Store.findOne({_id: req.params.id});
    // res.json(store);
  // 2. confirm they are the owner of the store

  // 3. Render out the edit form so the suer can update their store.
    res.render('editStore', { title: `Edit ${store.name}`, store })
}

exports.updateStore = async (req, res) => {
  // const body = _.pick(req.body, ['name', 'description','tags']);
  const store = await Store.findByIdAndUpdate({_id: req.params.id},req.body, {
    new: true,
    runValidators: true
  }).exec();
  req.flash('success', `Successfully updated <strong> ${store.name} </strong>. <a href="/store/${store.slug}"> View Store -> </a>`);
  res.redirect(`/stores/${store._id}/edit`);
}
