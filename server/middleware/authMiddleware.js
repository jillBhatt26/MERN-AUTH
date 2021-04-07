// Requires
// ------------------------------------

const jwt = require('jsonwebtoken');

// Middleware Definitions
// ------------------------------------
const authMiddleware = (req, res, next) => {
    // get the jwt token from request cookies
    const token = req.cookies.jwt;

    let error = null;
    let user = {};

    // verify the token
    jwt.verify(token, process.env.JWT_SECRET, (err, decodedToken) => {
        if (err) error = err.message;
        else {
            user.user_id = decodedToken.id;

            req.user = user;

            next();
        }
    });

    if (error) res.json({ error });
};

// Exports
// ------------------------------------
module.exports = authMiddleware;
