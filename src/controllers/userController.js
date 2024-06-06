const jwt = require('jsonwebtoken');
const User = require('../models/usermodel');
const bcrypt = require('bcryptjs');

const JWT_SECRET = process.env.JWT_SECRET;

exports.register = (req, res) => {
    const { email, password } = req.body;

    User.findByEmail(email, (err, existingUser) => {
        if (err) {
            if (err.kind === "not_found") {
                bcrypt.hash(password, 10, (err, hashedPassword) => {
                    if (err) {
                        console.error("Error hashing password:", err);
                        return res.status(500).send({ success: false, message: "Error hashing password." });
                    }

                    const newUser = {
                        email: email,
                        password: hashedPassword
                    };

                    User.create(newUser, (err, data) => {
                        if (err) {
                            console.error("Error registering user:", err);
                            return res.status(500).send({ success: false, message: "Error registering user." });
                        }
                        console.log("User registered successfully:", data);
                        res.status(201).send({ success: true, message: "User registered successfully!" });
                    });
                });
            } else {
                console.error("Error checking email:", err);
                return res.status(500).send({ success: false, message: "Error checking email." });
            }
        } else {
            console.log("Email already exists:", email);
            return res.status(400).send({ success: false, message: "Email already exists!" });
        }
    });
};

exports.login = (req, res) => {
    const { email, password } = req.body;

    User.findByEmail(email, (err, user) => {
        if (err) {
            console.error("Error finding user:", err);
            return res.status(500).send({ success: false, message: "Error finding user." });
        }

        if (!user) {
            return res.status(404).send({ success: false, message: "User not found." });
        }

        bcrypt.compare(password, user.password, (err, result) => {
            if (err) {
                console.error("Error comparing passwords:", err);
                return res.status(500).send({ success: false, message: "Error comparing passwords." });
            }

            if (!result) {
                return res.status(401).send({ success: false, message: "Invalid Password!" });
            }

            const tokenPayload = {
                id: user.id,
                email: user.email
            };

            const tokenOptions = {
                expiresIn: 86400 // 24 hours
            };

            const token = jwt.sign(tokenPayload, JWT_SECRET, tokenOptions);

            res.status(200).send({
                success: true,
                message: "Login successfully",
                id: user.id,
                email: user.email,
                token: token
            });
        });
    });
};



exports.protectedRoute = (req, res) => {
    res.status(200).send({
        message: "Access granted",
        userId: req.userId,
        email: req.email,
        password: req.password
    });
};