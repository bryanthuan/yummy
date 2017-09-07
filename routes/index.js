const express = require('express');
const router = express.Router();
const { 
    getStores, 
    addStore,
    createStore,
    editStore,
    updateStore,
    upload,
    resize,
    getStoreBySlug,
    getStoresByTag
} = require('../controllers/storeController');

const { 
    loginForm,
    registerForm
 } = require('../controllers/userController');

const { catchErrors } = require('../handlers/errorHandlers');

router.get('/', catchErrors(getStores));
router.get('/stores', catchErrors(getStores));

router.get('/add', addStore);

router.post('/add', 
    upload, 
    catchErrors(resize), 
    catchErrors(createStore)
);
router.get('/stores/:id/edit', catchErrors(editStore));

router.post('/add/:id', 
    upload, 
    catchErrors(resize),
    catchErrors(updateStore)
);

router.get('/store/:slug', catchErrors(getStoreBySlug))

router.get('/tags',catchErrors(getStoresByTag));
router.get('/tags/:tag',catchErrors(getStoresByTag));

router.get('/login',loginForm);
router.get('/register', registerForm);
 
// 1. Validate the registeration data
// 2. Register the user
// 3. Login him in
router.post('/register', registerForm);

module.exports = router;
