const jwt = require('jsonwebtoken');

const createToken = id => {
    const maxAge = 3 * 24 * 60 * 60; // 3 days in terms of seconds

    return jwt.sign({ id }, process.env.JWT_SECRET, { expiresIn: maxAge });
};

module.exports = createToken;
