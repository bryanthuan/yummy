const mongoose = require('mongoose');
const User = mongoose.model('User');
const promisify = require('es6-promisify');

const loginForm = (req, res) => {
    res.render('auth/login', { title: 'Login'});
}

const registerForm = (req, res) => {
    res.render('auth/register', {title: 'Register'});
}

const validateRegister = (req, res, next) => {
    req.sanitizeBody('name');
    req.checkBody('name', 'You must supply a name!').notEmpty();
    req.checkBody('email','That is email is not valid!').isEmail();
    req.sanitizeBody('email').normalizeEmail({
        remove_dots: false,
        remove_extension: false,
        gmail_remove_subaddress: false
    });
    req.checkBody('password','Password cannot be Blank!').notEmpty();
    req.checkBody('password-confirm','Password cannot be Blank!').notEmpty();
    req.checkBody('password-confirm','Oops! Your Passwords do not match!').equals(req.body.password);

    const errors = req.validationErrors();

    if(errors) {
        req.flash('error', errors.map(err => err.msg));
        res.render('auth/register', {title: 'Register', body: req.body, flashes: req.flash()});
        return;
    }
    next();
};

const register = async (req, res, next) => {
    const user = new User({
        email: req.body.email,
        name: req.body.name
    });
    const register =  promisify(User.register, User);
    await register(user, req.body.password);
    next();
}

const account = (req, res) => {
    res.render('auth/account', {title: 'Account'});
}

const updateAccount = async (req, res) => {
    const updates = {
        name: req.body.name,
        email: req.body.email
    };

    const user = await User.findOneAndUpdate(
        { _id: req.user._id },
        { $set: updates },
        { new: true, runValidations: true, context: 'query'}
    );
    req.flash('success', 'Your infor has been updated successfully !');
    res.redirect('back');
    // res.json(user);
}

module.exports = { loginForm, registerForm, validateRegister, register, account, updateAccount }

