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
    getStoresByTag,
    searchStores,
    mapStores,
    mapPage
} = require('../controllers/storeController');

const { 
    loginForm,
    registerForm,
    validateRegister,
    register,
    account,
    updateAccount
 } = require('../controllers/userController');

const { 
    login, 
    logout, 
    isLoggedIn, 
    forgot, 
    reset, 
    confirmPasswords,
    updatePassword
} = require('../controllers/authController');

const { catchErrors } = require('../handlers/errorHandlers');

router.get('/', catchErrors(getStores));
router.get('/stores', catchErrors(getStores));

router.get('/add', isLoggedIn ,addStore);

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
router.post('/login', login);
router.get('/register', registerForm);
 
// 1. Validate the registeration data
// 2. Register the user
// 3. Login him in
router.post('/register', 
    validateRegister,
    register,
    login
);

router.get('/logout', logout);

router.get('/account', isLoggedIn ,account);
router.post('/account', catchErrors(updateAccount));

router.post('/account/forgot', catchErrors(forgot))
router.get('/account/reset/:token', catchErrors(reset));
router.post('/account/reset/:token', 
    confirmPasswords,
    catchErrors(updatePassword)
);

router.get('/map', mapPage);
/**
 * API endpoint
 */
router.get('/api/v1', catchErrors(searchStores));

router.get('/api/stores/near',catchErrors(mapStores));

module.exports = router;
