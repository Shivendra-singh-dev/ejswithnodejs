const bcrypt = require("bcrypt");
const db = require("../config/db");

exports.showLogin = (req, res) => {
    res.render("auth/login");
};

exports.showSignup = (req, res) => {
    res.render("auth/signup");
};

exports.signup = async (req, res) => {
    try {
        const { name, email, password } = req.body;

        if (!name || !email || !password) {
            return res.send("All fields are required");
        }

        if (password.length < 6) {
            return res.send("Password must be at least 6 characters");
        }

        const [existingUsers] = await db.execute(
            "SELECT id FROM users WHERE email = ?",
            [email]
        );

        if (existingUsers.length > 0) {
            return res.send("Email already registered");
        }

        const hashedPassword = await bcrypt.hash(password, 12);

        const [result] = await db.execute(
            "INSERT INTO users (name, email, password) VALUES (?, ?, ?)",
            [name, email, hashedPassword]
        );

        req.session.user = {
            id: result.insertId,
            name,
            email
        };

        res.redirect("/dashboard");

    } catch (error) {
        console.error(error);
        res.status(500).send("Server Error");
    }
};

exports.login = async (req, res) => {
    try {
        const { email, password } = req.body;

        const [users] = await db.execute(
            "SELECT * FROM users WHERE email = ?",
            [email]
        );

        if (users.length === 0) {
            return res.send("Invalid email or password");
        }

        const user = users[0];

        const passwordMatch = await bcrypt.compare(
            password,
            user.password
        );

        if (!passwordMatch) {
            return res.send("Invalid email or password");
        }

        req.session.user = {
            id: user.id,
            name: user.name,
            email: user.email
        };

        res.redirect("/dashboard");

    } catch (error) {
        console.error(error);
        res.status(500).send("Server Error");
    }
};

exports.logout = (req, res) => {
    req.session.destroy(() => {
        res.redirect("/");
    });
};
