const jwt = require('jsonwebtoken');
const User = require('../models/usermodel');
const bcrypt = require ('bcryptjs');
const JWT_SECRET = 'isadyaudsay283u1heaaSADSJAB';

exports.register = (req, res) => {
    const { email, password } = req.body;

    // Check if the email already exists in the database
    User.findByEmail(email, (err, existingUser) => {
        if (err) {
            if (err.kind === "not_found") {
                // Hash the password before storing it
                bcrypt.hash(password, 10, (err, hashedPassword) => {
                    if (err) {
                        console.error("Error hashing password:", err);
                        return res.status(500).send({ message: "Error hashing password." });
                    }

                    // If the email does not exist, proceed with registration
                    const newUser = {
                        email: email,
                        password: hashedPassword
                    };

                    User.create(newUser, (err, data) => {
                        if (err) {
                            console.error("Error registering user:", err);
                            return res.status(500).send({ message: "Error registering user." });
                        }
                        console.log("User registered successfully:", data);
                        res.status(201).send({ message: "User registered successfully!" });
                    });
                });
            } else {
                console.error("Error checking email:", err);
                return res.status(500).send({ message: "Error checking email." });
            }
        } else {
            console.log("Email already exists:", email);
            return res.status(400).send({ message: "Email already exists!" });
        }
    });
};

exports.login = (req, res) => {
    const { email, password } = req.body;

    User.findByEmail(email, (err, user) => {
        if (err) {
            console.error("Error finding user:", err);
            return res.status(500).send({ message: "Error finding user." });
        }

        if (!user) {
            return res.status(404).send({ message: "User not found." });
        }

        if (password !== user.password) { // Ganti bcrypt dengan perbandingan biasa
            return res.status(401).send({ message: "Invalid Password!" });
        }

        // Create token with user's email and password
        const tokenPayload = {
            id: user.id,
            email: user.email,
            password: user.password
        };

        const tokenOptions = {
            expiresIn: 86400 // 24 hours
        };

        const token = jwt.sign(tokenPayload, JWT_SECRET, tokenOptions);

        // Send token and user info as response
        res.status(200).send({
            message: "Login successfully", // Tambahkan pesan sukses login
            id: user.id,
            email: user.email,
            token: token
        });
    });
};

// Protected route handler
exports.protectedRoute = (req, res) => {
    res.status(200).send({ // Tambahkan handler rute terlindungi
        message: "Access granted",
        userId: req.userId,
        email: req.email,
        password: req.password
    });
};