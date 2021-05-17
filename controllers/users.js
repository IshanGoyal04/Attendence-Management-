const User = require('../models/user');


//module.exports.renderRegister = async (req, res) => {
//    res.render('users/register')
//}
//module.exports.register = async (req, res, next) => {
//    try {
//        const { email, username, password, eid, designation, contactNumber, address, city } = req.body;
//        const user = await new User({ email, username, contactNumber, address, city, eid, designation });
//        const registeredUser = await User.register(user, password);
//        req.login(registeredUser, err => {
//            if (err) return next(err);
//            req.flash('success', 'Successfully Registered');
//            res.redirect('/login')
//        })
//
//    } catch (e) {
//        req.flash('error', e.message)
//        res.redirect('/register')
//    }
//}


module.exports.renderLogin = (req, res) => {
    res.render('users/login')
}
module.exports.login = async (req, res) => {
    try {
        const username = req.body.username;
        const user = await User.findOne({ username: username })

        req.flash('success', 'SuccessFully LoggedIn');
        const redirectUrl = `/employees/${user._id}`;
        delete req.session.returnTo;
        res.redirect(redirectUrl)
    } catch (e) {
        req.flash('error', e.message)
        res.redirect('/login')
    }
}


module.exports.logout = (req, res) => {
    req.logout();
    req.flash('success', 'GoodBye!')
    res.redirect('/login')
}