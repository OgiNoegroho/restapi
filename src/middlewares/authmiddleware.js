const jwt = require('jsonwebtoken');
const JWT_SECRET = 'isadyaudsay283u1heaaSADSJAB';

const authmiddleware = (req, res, next) => {
    const token = req.headers.authorization && req.headers.authorization.split(' ')[1];

    if (!token) {
        return res.status(403).send({ message: "No token provided!" });
    }

    jwt.verify(token, JWT_SECRET, (err, decoded) => {
        if (err) {
            return res.status(401).send({ message: "Unauthorized!" });
        }
        req.userId = decoded.id;
        req.email = decoded.email;
        req.password = decoded.password;
        next();
    });
};

module.exports = authmiddleware;