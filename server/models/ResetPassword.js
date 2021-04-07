// Require
// ------------------------------------
// import mongoose from "mongoose";
const { Schema, model } = require('mongoose');

const ResetPasswordSchema = new Schema({
    user_id: {
        type: Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    resetPasswordToken: String,
    resetPasswordTokenExpire: Date
});

const ResetPassword = model('ResetPassword', ResetPasswordSchema);

module.exports = ResetPassword;
