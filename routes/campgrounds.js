const express = require("express");
const router = express.Router();
const Campground = require("../models/campground");
const middlewareObj = require("../middleware");

router.get("/", (req, res) => {
    Campground.find({}, (err, allcamps) => {
        if (err) {
            console.log("Error found: ", err);
        } else {
            res.render("campgrounds/index", { campgrounds: allcamps });
        }
    });
});

router.post("/", middlewareObj.isLoggedIn, (req, res) => {
    const name = req.body.name;
    const image = req.body.image;
    const description = req.body.description;
    const author = {
        id: req.user._id,
        username: req.user.username
    };
    let newCamp = { name: name, image: image, description: description, author: author };
    Campground.create(newCamp, (err, camp) => {
        if (err) {
            console.log(err);
        } else {
            console.log("Campground added to DB", camp);
            res.redirect("/campgrounds");
        }
    });
});

router.get("/new", middlewareObj.isLoggedIn, (req, res) => {
    res.render("campgrounds/new");
});

router.get("/:id", (req, res) => {
    Campground.findById(req.params.id).populate("comments").exec((err, foundcamp) => {
        if (err) {
            console.log("Error found", err);
        } else {
            res.render("campgrounds/show", { campground: foundcamp });
        }
    });
});

router.get("/:id/edit", middlewareObj.checkCampgroundOwnership, (req, res) => {
    Campground.findById(req.params.id, (err, foundCamp) => {
        if (err) {
            res.redirect("/campgrounds");
        } else {
            res.render("campgrounds/edit", { campground: foundCamp });
        }
    });
});

router.put("/:id", middlewareObj.checkCampgroundOwnership, (req, res) => {
    // find the campground and update
    Campground.findByIdAndUpdate(req.params.id, req.body.campground, (err, updatedCamp) => {
        if (err) {
            console.log(err);
            res.redirect("/campgrounds");
        } else {
            res.redirect(`/campgrounds/${req.params.id}`);
        }
    });
});

router.delete("/:id", middlewareObj.checkCampgroundOwnership, (req, res) => {
    Campground.findByIdAndDelete(req.params.id, (err, deletedCamp) => {
        if (err) {
            console.log(err);
            res.redirect("/campgrounds");
        } else {
            res.redirect("/campgrounds");
        }
    });
});

module.exports = router;