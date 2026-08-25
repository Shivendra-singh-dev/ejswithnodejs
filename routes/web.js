const express = require("express");

const router = express.Router();

router.get("/", (req, res) => {
    res.render("home");
});

router.get("/about", (req, res) => {
    res.render("about");
});

router.get("/contact", (req, res) => {
    res.render("contact");
});

router.get("/dashboard", (req, res) => {
    if (!req.session.user) {
        return res.redirect("/login");
    }

    res.render("dashboard");
});

module.exports = router;
