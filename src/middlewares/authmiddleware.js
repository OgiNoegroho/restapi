const jwt = require('jsonwebtoken');
require('dotenv').config();

const JWT_SECRET = process.env.JWT_SECRET;

const authmiddleware = (req, res, next) => {
    const token = req.headers.authorization && req.headers.authorization.split(' ')[1];

    if (!token) {
        return res.status(403).send({ message: "No token provided!" });
    }

    jwt.verify(token, JWT_SECRET, (err, decoded) => {
        if (err) {
            console.error("Error verifying token:", err);
            return res.status(401).send({ message: "Unauthorized!" });
        }
        req.userId = decoded.id;
        req.email = decoded.email;
        next();
    });
};

module.exports = authmiddleware;
