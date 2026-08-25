import dotenv from "dotenv";
dotenv.config();

import express from "express";
import session from "express-session";
import path from "path";
import { fileURLToPath } from "url";

const app = express();

// __dirname replacement for ES Modules
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// EJS
app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));

// Body parser
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

// Static files
app.use(express.static(path.join(__dirname, "public")));

// Session
app.use(
    session({
        secret: process.env.SESSION_SECRET || "my-secret-key",
        resave: false,
        saveUninitialized: false,
        cookie: {
            httpOnly: true,
            maxAge: 1000 * 60 * 60
        }
    })
);

// Make logged-in user available in every EJS page
app.use((req, res, next) => {
    res.locals.user = req.session.user || null;
    next();
});

// Home
app.get("/", (req, res) => {
    res.render("home");
});

// About
app.get("/about", (req, res) => {
    res.render("about");
});

// Contact
app.get("/contact", (req, res) => {
    res.render("contact");
});

// Login page
app.get("/login", (req, res) => {
    res.render("auth/login");
});

// Signup page
app.get("/signup", (req, res) => {
    res.render("auth/signup");
});

// Dashboard
app.get("/dashboard", (req, res) => {
    if (!req.session.user) {
        return res.redirect("/login");
    }

    res.render("dashboard");
});

// Logout
app.post("/logout", (req, res) => {
    req.session.destroy((err) => {
        if (err) {
            console.error(err);
            return res.status(500).send("Logout failed");
        }

        res.redirect("/");
    });
});

// 404
app.use((req, res) => {
    res.status(404).send("404 - Page Not Found");
});

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
    console.log(`Server running at http://localhost:${PORT}`);
});
