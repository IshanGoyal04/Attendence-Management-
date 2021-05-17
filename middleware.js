const ExpressError = require('./utilities/ExpressError')
//const Attendence = require('./models/attendence');
const User = require('./models/user');



module.exports.isLoggedIn = (req, res, next) => {
    if (!req.isAuthenticated()) { // isAuthenticated is predefined function in passport module which we can use anywhere after requiring passport in that file
        req.session.returnTo = req.originalUrl //store the url they are requesting 
        req.flash('error', 'You must be signed in first!')
        return res.redirect('/login')
    }
    next();
}
module.exports.isAdmin = async (req, res, next) => {
    // const { designation } = req.body.designation;
    const { id } = req.params;
    const user = await User.findOne({ designation: "Admin" });

    if (user.designation !== "Admin") {
        req.session.returnTo = req.originalUrl;
        req.flash('error', 'Only Admin Can do this')
        //console.log('Only Admin Can do this')
        return res.redirect('/login')
    }
    next();

}
