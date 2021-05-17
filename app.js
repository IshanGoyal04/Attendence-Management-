if (process.env.NODE_ENV !== "production") {
    require('dotenv').config();
}

const express = require('express');

const path = require('path');
const mongoose = require("mongoose");
const bodyParser = require('body-parser')
const ejsMate = require('ejs-mate'); // basically one of many engines used to parse
const session = require('express-session') // we are requiring session for flash messages and authentication 
const flash = require('connect-flash') // requiring flash with the help of flash-connect to display flash messgaes
const methodOverride = require("method-override");
const passport = require('passport');
const LocalStrategy = require('passport-local');
//const mongoSanitize = require('express-mongo-sanitize')
//const helmet = require('helmet');
//const MongoDBStore = require('connect-mongo')(session);

const ExpressError = require('./utilities/ExpressError')
const catchAsync = require('./utilities/catchAsync');

const User = require('./models/user')

const userRoutes = require('./routes/users');
const employeeRoutes = require('./routes/employees')
const adminRoutes = require('./routes/admins')

mongoose.connect('mongodb://localhost:27017/Attendence', {
    useNewUrlParser: true,
    useCreateIndex: true,
    useUnifiedTopology: true,
    useFindAndModify: false
})


// **************** Can copy paste basic logic syntax*****//
const db = mongoose.connection;
db.on("error", console.error.bind(console, "connection error:"));
db.once("open", () => {
    console.log("Database Connected");
});
//****************Till here *//




const app = express()

app.engine('ejs', ejsMate) // here we are telling engine to use ejsMate instead of default one
//********** We have used below to lines to link our views directory with this file  */
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'))
//**********views directory contain .ejs files */

app.use(express.urlencoded({ extended: true }))

app.use(methodOverride('_method'))
app.use(express.static(path.join(__dirname, 'public'))) //we are telling our express to use public directory

//const secret = process.env.SECRET || 'thishouldbeabettersecret';



//*******for setting up session******* */
const sessionConfig = {
    name: 'session',
    secret: 'thishouldbeabettersecret',
    resave: false,
    saveUninitialized: true,
    cookie: { //we have to write here (cookie) only
        httpOnly: true, //If the HttpOnly flag (optional) is included in the HTTP response header, 
        //the cookie cannot be accessed through client side script (again if the browser supports this flag)
        //secure:true, //it is used for running in https  ,we will use it when we will deploy the project
        expires: Date.now() + 1000 * 60 * 60 * 24 * 7, // we have applied the limit after which date our cookie will be deleted so Date.now() show 
        //todays date in millisecond and (1000 * 60 * 60 * 24 * 7) shows the total millisecond after the week of our cookie specified and will be deleted after that
        maxAge: 1000 * 60 * 60 * 24 * 7
    }
}
app.use(session(sessionConfig))
//***********Till Here************/

app.use(flash())


app.use(passport.initialize());
app.use(passport.session()); // we write this to use passport and passport.session must be written after session
passport.use(new LocalStrategy(User.authenticate()))// here we are saying hello passport we want to use LocalStrategy which is downloaded and required to use on User to authenticate the user

//serializeUser and deserializeUser is done to store and remove the user from a particular session
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());


app.use((req, res, next) => {
    res.locals.currentUser = req.user;
    res.locals.success = req.flash('success');
    res.locals.error = req.flash('error');
    res.locals.date = Date.now();
    next();
})

app.use(userRoutes);
app.use('/employees', employeeRoutes);
app.use('/admins', adminRoutes);

app.get('/', (req, res) => {
    res.render('users/login');
})

app.get('/register', (req, res) => {
    res.render('users/register')
})





app.all('*', (req, res, next) => {
    next(new ExpressError('Page not Found!!!', 404))
})

app.use((err, req, res, next) => {
    const { status = 500 } = err;
    if (!err.message) {
        err.message = "OH NO!! something went wrong"
    }
    res.status(status).render('error', { err }) //.render('error') will look up for error.ejs in view directory
    // res.send("OH BOY , something went wrong");
})

const port = process.env.PORT || 3000;
app.listen(port, () => {
    console.log(`ON Port ${port}`)
})