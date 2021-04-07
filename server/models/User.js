// Require
// ------------------------------------
// import mongoose from "mongoose";
const { Schema, model } = require('mongoose');
const { genSalt, hash } = require('bcrypt');

// validator
// import validator from "validator";
const { isEmail } = require('validator');

// schema definition
const UserSchema = new Schema({
    username: {
        type: String,
        required: [true, 'Username is required!'],
        unique: true
    },
    email: {
        type: String,
        required: true,
        validate: [isEmail, 'Please enter a valid email!']
    },
    password: {
        type: String,
        required: [true, 'Password is required!'],
        minLength: [5, 'Minimum 5 characters required!']
    }
});

UserSchema.pre('save', async function (next) {
    const salt = await genSalt();

    this.password = await hash(this.password, salt);

    next();
});

// model definition
const User = model('User', UserSchema);

// Export
// ------------------------------------
// export default User;
module.exports = User;
