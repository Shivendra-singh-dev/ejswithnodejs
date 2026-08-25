const express = require("express");

const {
    showLogin,
    showSignup,
    signup,
    login,
    logout
} = require("../controllers/authController");

const router = express.Router();

router.get("/login", showLogin);
router.get("/signup", showSignup);

router.post("/signup", signup);
router.post("/login", login);

router.post("/logout", logout);

module.exports = router;
