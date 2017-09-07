

const loginForm = (req, res) => {
    res.render('auth/login', { title: 'Login'});
}

const registerForm = (req, res) => {
    res.render('auth/register', {title: 'Register'});
}

const validateRegister = (req, res, next ) => {
    req.sanitizeBody('name');
    req.checkBody('name', 'You must supply a name!').notEmpty();
    req.checkBody('email','That is email is not valid!').isEmail();
    req.sanitizeBody('email').normalizeEmail({
        remove_dots: false,
        remove_extension: false,
        gmail_remove_subaddress: false
    }); 
}

module.exports = { loginForm, registerForm, validateRegister }

