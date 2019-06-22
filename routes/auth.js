const express = require("express");
const router = express.Router();
const passport = require("passport");
const User = require("../models/user");
const middlewareObj = require("../middleware");

//Auth Routes
router.get("/", (req, res) => {
    res.render("landing");
});

router.get("/register", (req, res) => {
    res.render("register");
});

router.post("/register", (req, res) => {
    let newUser = new User({ username: req.body.username });
    User.register(newUser, req.body.password, (err, user) => {
        if (err) {
            console.log(err);
            req.flash("error", err.message);
            // req.flash("error", "A user with that name is already registered!");
            res.redirect("/register");
        } else {
            passport.authenticate("local", {
                successFlash: `Welcome to YelpCamp, ${req.body.username}!`
            })(req, res, () => {
                res.redirect("/campgrounds");
            })
        }
    })
});

router.get("/login", (req, res) => {
    res.render('login');
});

router.post("/login", passport.authenticate("local", {
    successRedirect: "/campgrounds",
    successFlash: "Welcome back!",
    failureRedirect: "/login",
    failureFlash: "Wrong Username or Password :("
}), (req, res) => {

});

router.get("/logout", (req, res) => {
    req.logout();
    req.flash("success", "Logged you out!");
    res.redirect("/campgrounds");
});

// function isLoggedIn(req, res, next) {
//     if (req.isAuthenticated()) {
//         return next();
//     }
//     res.redirect("/login");
// }

module.exports = router;