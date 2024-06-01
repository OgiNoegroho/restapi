const jwt = require('jsonwebtoken');
const User = require('../models/usermodel');
const bcrypt = require ('bcryptjs');
const JWT_SECRET = 'isadyaudsay283u1heaaSADSJAB';

exports.register = (req, res) => {
    const { email, password } = req.body;

    User.findByEmail(email, (err, existingUser) => {
        if (err) {
            if (err.kind === "not_found") {
                bcrypt.hash(password, 10, (err, hashedPassword) => {
                    if (err) {
                        console.error("Error hashing password:", err);
                        return res.status(500).send({ message: "Error hashing password." });
                    }

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

        if (password !== user.password) {
            return res.status(401).send({ message: "Invalid Password!" });
        }

       
        const tokenPayload = {
            id: user.id,
            email: user.email,
            password: user.password
        };

        const tokenOptions = {
            expiresIn: 86400 
        };

        const token = jwt.sign(tokenPayload, JWT_SECRET, tokenOptions);


        res.status(200).send({
            message: "Login successfully",
            id: user.id,
            email: user.email,
            token: token
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