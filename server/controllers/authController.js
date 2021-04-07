// Requires
// ------------------------------------

// dependencies
const { genSalt, hash, compare } = require('bcrypt');
const crypto = require('crypto');
const jwt = require('jsonwebtoken');

// models
const User = require('../models/User');
const ResetPassword = require('../models/ResetPassword');

// functions
const createToken = require('../functions/createToken');
const sendEmail = require('../functions/SendEmail');
const GenerateHash = require('../functions/GenerateHash');

// Controllers Definitions
// ------------------------------------

const SignUpController = async (req, res) => {
    // fetch the user details from request body
    let { username, email, password } = req.body;

    let error = {};

    // // generate salt
    // const salt = await genSalt();

    // // hash the password with the salt
    // password = await hash(password, salt);

    try {
        // save the user in the mongodb using the create method of model
        const user = await User.create({ username, email, password });

        // create token from the user id from the user created
        const token = await createToken(user._id);

        // send a cookie with the value of token in it
        res.cookie('jwt', token, {
            httpOnly: true,
            maxAge: 3 * 24 * 60 * 60 * 100
        });

        res.status(200).json({
            id: user._id,
            username: user.username
        });
    } catch (err) {
        if (err.code === 11000) {
            error.username = `Username: ${username}, is already in use.`;
        } else {
            error.msg = err.message;
        }
    }

    if (Object.keys(error).length > 0) {
        res.status(500).json({ error });
    }
};

const LoginController = async (req, res) => {
    // fetch the login input from user using the request body
    const { username, password } = req.body;

    let user = null;
    let error = {};

    try {
        // find the user with the specified username
        user = await User.findOne({ username });
    } catch (err) {
        error.msg = err.message;
    }

    // authenticate the user by validating the password
    if (user) {
        const auth = await compare(password, user.password);

        if (auth) {
            // user is authenticated successfully

            // create a new token
            const token = createToken(user._id);

            // set the cookie having the token
            res.cookie('jwt', token, {
                httpOnly: true,
                maxAge: 3 * 24 * 60 * 60 * 100
            });

            // send the id as the response
            res.status(200).json({
                id: user._id,
                username: user.username
            });
        } else {
            error.password = 'Incorrect Password!';
        }
    } else {
        error.username = 'User not found with the input credentials';
    }

    // error exists
    if (Object.keys(error).length > 0) {
        res.status(400).json({ error });
    }
};

const LogOutController = (req, res) => {
    res.cookie('jwt', '', { maxAge: 1 });
    res.status(200).json({ msg: 'User logged out!!' });
};

const GetUserController = async (req, res) => {
    const id = req.params.id;

    let error = null;

    try {
        const user = await User.findOne({ _id: id });

        res.json({ username: user.username });
    } catch (err) {
        error = err.message;

        res.status(500).json({ error });
    }
};

const ProfileController = async (req, res) => {
    const token = req.cookies.jwt;

    if (token) {
        // fetch the user from request
        const { user } = req;

        if (user) {
            const { user_id } = user;

            if (user_id) {
                try {
                    const user = await User.findOne({ _id: user_id });

                    res.json({ username: user.username, user_id: user._id });
                } catch (err) {
                    return res.json({ errMsg: err.message });
                }
            }
        }
    }
};

const RequestPasswordResetController = async (req, res) => {
    // User clicks the forgot password link.
    // fetch the email sent using request body
    const { email } = req.body;

    if (email) {
        // fetch the resetToken and the generated resetPasswordToken from the GenerateHash Function

        // NOTE: The resetToken will be used to regenerate the resetPasswordToken later, which will be used to fetch the user details using the resetPasswordToken
        const { resetToken, resetPasswordToken } = GenerateHash();

        // fetch the user using the email id specified
        let user = null;

        try {
            user = await User.findOne({ email });
        } catch (err) {
            res.json({ errMsg: err.message });
        }

        if (user) {
            // store the hash in the database and set the token expire time
            // NOTE: Setting time to 10 minutes from the time of sending the request.
            const resetPasswordTokenExpire = Date.now() + 10 * (60 * 1000);

            let resetPass = null;

            try {
                resetPass = await ResetPassword.create({
                    user_id: user._id,
                    resetPasswordToken,
                    resetPasswordTokenExpire
                });
            } catch (err) {
                res.json({ errMsg: err.message });
            }

            if (resetPass) {
                // generate a link having the token as
                const resetPasswordLink = `http://localhost:3000/resetPassword/${resetToken}`;

                // send an email with a link having a random hash as query string
                // create an email body
                const emailBody = `<h1>You've requested a password reset</h1>
                <p>Click the link to reset your password</p>
                <a href=${resetPasswordLink}>${resetPasswordLink}</a>`;

                try {
                    await sendEmail({
                        to: email,
                        subject: 'Password reset',
                        text: emailBody
                    });

                    res.status(200).json({
                        success: true,
                        msg: 'Email sent!'
                    });
                } catch (err) {
                    console.log(err);
                    resetToken = null;
                    resetPasswordToken = null;
                    return res.json({
                        errMsg: 'Error sending email.',
                        err,
                        success: false
                    });
                }
            }
        } else {
            res.json({
                errMsg: 'No user found with specified email!',
                success: false
            });
        }
    } else {
        res.json({
            errMsg: 'Please specify an email address.',
            success: false
        });
    }
};

const VerifyPasswordReset = async (req, res) => {
    // fetch the token from request params
    const token = req.params.resetToken;

    if (token) {
        // regenerate the hash using the token provided in the params
        const resetPasswordToken = crypto
            .createHash('sha256')
            .update(token)
            .digest('hex');

        let validTime = new Date();

        validTime.setMinutes(validTime.getMinutes() + 10);

        // fetch the request password properties from db using the regenerated token
        let resetPasswordDetails = null;

        try {
            resetPasswordDetails = await ResetPassword.findOne({
                resetPasswordToken
            });
        } catch (err) {
            return res.json({ errMsg: err.message, success: false });
        }

        // check if the token is valid and has not expired.
        if (resetPasswordDetails) {
            const resetTime = resetPasswordDetails.resetPasswordTokenExpire;

            const total_time = validTime - resetTime;

            // 1 min = 60 sec
            // 1 sec = 1000 ms
            // 1 min = 60000ms
            // 10 min = 600000ms

            if (total_time < 600000) {
                // 10 minutes
                res.json({
                    success: true,
                    user_id: resetPasswordDetails.user_id
                });
            } else {
                // delete the record if the renewal time has expired
                try {
                    await ResetPassword.deleteOne({ resetPasswordToken });
                } catch (err) {
                    return res.json({ errMsg: err.message, success: false });
                }

                // send error response
                res.json({ errMsg: 'Token expired!', success: false });
            }
        } else {
            return res.json({
                errMsg: 'Error fetching the reset details.',
                success: false
            });
        }
    } else {
        res.json({
            errMsg: 'No valid token sent with the request.',
            success: false
        });
    }
};

const UpdatePasswordController = async (req, res) => {
    // fetch the user id from the body and the new password
    let { user_id, new_password } = req.body;

    if (user_id && new_password) {
        // check if the reset password token exists with the provided user_id

        let resetPasswordDetails = null;

        try {
            resetPasswordDetails = await ResetPassword.findOne({ user_id });
        } catch (err) {
            return res.json({ errMsg: err.message, success: false });
        }

        if (resetPasswordDetails) {
            // allow to reset the password

            // NOTE: We need to hash the password as document middleware won't work on query middleware.

            // generate salt
            const salt = await genSalt();

            // hash the password with the salt
            new_password = await hash(new_password, salt);

            try {
                await User.findByIdAndUpdate(user_id, {
                    password: new_password
                });

                // once the password is reset successfully, remove the token details from database
                await ResetPassword.findOneAndDelete({ user_id });
            } catch (err) {
                return res.json({ errMsg: err.message });
            }

            res.json({ success: true, msg: 'Password successfully reset!' });
        } else {
            return res.json({ errMsg: 'Token has expired.', success: false });
        }
    } else {
        return res.json({
            errMsg: 'Insufficient fields provided',
            success: false
        });
    }
};

module.exports = {
    SignUpController,
    LoginController,
    LogOutController,
    GetUserController,
    ProfileController,
    RequestPasswordResetController,
    UpdatePasswordController,
    VerifyPasswordReset
};
