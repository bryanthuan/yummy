const mongoose = require('mongoose');
const Store = mongoose.model('Store');
const multer = require('multer');
const jimp = require('jimp');
const uuid = require('uuid');
const { xss } = require('../handlers/xssHandlers');


const multerOptions = {
  storage: multer.memoryStorage(),
  fileFilter(req, file, next){
    const isPhoto = file.mimetype.startsWith('image/');
    if (isPhoto) {
      next(null, true);
    } else {
      next({ message: 'That filetype isn\'t allowed'}, false);
    }
  }
};


const confirmOwner = (store, user) => {
  if (!store.author.equals(user._id)) {
    throw new Error('You cannot update store that you are not the owner');
  }
}


exports.homePage = (req, res) => {
  res.render('index', {title: 'Home Page'});
};

exports.addStore = (req, res) => {
  res.render('editStore', { title: 'Add Store' });
};

exports.upload = multer(multerOptions).single('photo');

exports.resize = async (req, res, next) => {
  // check if there is no new file to resize
  if (!req.file) return next();
  
  const extension = req.file.mimetype.split('/')[1];
  req.body.photo = `${uuid.v4()}.${extension}`;
  // now we resize
  const photo = await jimp.read(req.file.buffer);
  await photo.resize(800, jimp.AUTO);
  await photo.write(`./public/uploads/${req.body.photo}`);
  next();
}

exports.createStore = async (req, res) => {
  req.body.author = req.user._id;
  req.body.name = xss(req.body.name);
  req.body.description = xss(req.body.description);
  const store = await (new Store(req.body)).save();   
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
    confirmOwner(store, req.user);
    // res.json(store);
  // 2. confirm they are the owner of the store

  // 3. Render out the edit form so the suer can update their store.
    res.render('editStore', { title: `Edit ${store.name}`, store })
}

exports.updateStore = async (req, res) => {
  req.body.location.type = 'Point';
  req.body.name = xss(req.body.name);
  req.body.description = xss(req.body.description);
  const store = await Store.findByIdAndUpdate({_id: req.params.id},req.body, {
    new: true,
    runValidators: true
  }).exec();
  req.flash('success', `Successfully updated <strong> ${store.name} </strong>. <a href="/store/${store.slug}"> View Store -> </a>`);
  res.redirect(`/stores/${store._id}/edit`);
}

exports.getStoreBySlug = async (req, res) => {
  const store = await Store.findOne({slug: req.params.slug}).populate('author');
  if (!store) return next();
  res.render('store', { title: store.name, store });
}

exports.getStoresByTag = async (req, res) => {
  const tag = req.params.tag;
  const tagQuery = tag || { $exists: true };
  const tagsPromise = Store.getTagsList();
  const storesPromise = Store.find({ tags: tagQuery})
  const [tags, stores] = await Promise.all([tagsPromise, storesPromise]);
  res.render('tag',{ tags, tag, stores, title: 'Tags'});
}

/**
 * API Search enpoint.
 */
exports.searchStores = async (req, res) => {
  const stores = await Store.find({
    $text: {
      $search: req.query.q
      }      
  },
  {
    score: { $meta: 'textScore' }
  }
).sort({
  score: { $meta: 'textScore'}
}).limit(5);
  res.json(stores);
}

exports.mapStores = async (req, res) => {
  const coordinates = [req.query.lng, req.query.lat].map(parseFloat);
  const q = {
    location: {
      $near: {
        $geometry: {
          type: 'Point',
          coordinates
        },
        $maxDistance: 100000 //km
      }
    }
  };
  const stores = await Store.find(q)
    .select('slug name description location')
    .limit(10);
  res.json(stores);
}

exports.mapPage = (req, res) => {
  res.render('map', {title: 'Map'});
}