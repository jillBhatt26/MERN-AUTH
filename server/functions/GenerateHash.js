const crypto = require('crypto');

const GenerateHash = () => {
    const resetToken = crypto.randomBytes(20).toString('hex');

    const resetPasswordToken = crypto
        .createHash('sha256')
        .update(resetToken)
        .digest('hex');

    return { resetToken, resetPasswordToken };
};

module.exports = GenerateHash;
