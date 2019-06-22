const express = require("express"),
    mongoose = require("mongoose"),
    bodyParser = require("body-parser"),
    passport = require("passport"),
    localStrategy = require("passport-local"),
    methodOverride = require("method-override"),
    flash = require("connect-flash"),
    Campground = require("./models/campground"),
    Comment = require("./models/comment"),
    User = require("./models/user");
const app = express();
const seedDb = require("./seeds");

var campgroundRoutes = require("./routes/campgrounds");
var commentRoutes = require("./routes/comments");
var authRoutes = require("./routes/auth");

// mongoose.connect('mongodb://localhost/yelp_camp', { useNewUrlParser: true, useFindAndModify: true })
//     .then(() => console.log("MongoDB Connected...."))
//     .catch(err => console.log(err));

mongoose.connect('mongodb+srv://me:itsmemongo@apptesting-nctav.mongodb.net/yelpcamp?retryWrites=true&w=majority', { useNewUrlParser: true, useFindAndModify: false })
    .then(() => console.log("MongoDB Connected...."))
    .catch(err => console.log(err));

app.use(bodyParser.urlencoded({ extended: true }));
app.set("view engine", "ejs");
app.use(express.static(`${__dirname}/public`));
app.use(methodOverride("_method"));
// seedDb();
app.use(flash());

// Passport Configuration
app.use(require("express-session")({
    secret: "I am ironman",
    resave: false,
    saveUninitialized: false
}));

app.use(passport.initialize());
app.use(passport.session());
passport.use(new localStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

app.use((req, res, next) => {
    res.locals.currentUser = req.user;
    res.locals.error = req.flash("error");
    res.locals.success = req.flash("success");
    next();
});

app.use("/campgrounds", campgroundRoutes);
app.use("/campgrounds/:id/comments", commentRoutes);
app.use("/" ,authRoutes);

function isLoggedIn(req, res, next) {
    if (req.isAuthenticated()) {
        return next();
    }
    res.redirect("/login");
}

const PORT = process.env.PORT || 3000;
app.listen(PORT, console.log(`Server started on port ${PORT}`));