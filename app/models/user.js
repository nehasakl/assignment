const mongoose = require('mongoose');
module.exports = mongoose.model("users", {
    name: {
        type: String,
        required: true,
    },
    username: {
        type: String,
        required: true,
        unique: true
    },
    email: {
        type: String,
        required: true,
        unique: true
    },
    password: {
        type: String,
        required: true,
    },
    token: {
        type: String
    },
    resetToken: {
        type: String
    },
    resetTokenExpiration: {
        type: Date
    },
});



