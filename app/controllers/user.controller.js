"use strict";
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const mongoose = require("mongoose");
const User = require('../models/user');
const sendgridTransport = require("nodemailer-sendgrid-transport");
const transporter = nodemailer.createTransport(
    sendgridTransport({
        auth: {
            api_key: process.env.SENDGRID_KEY
        }
    })
);
exports.register = async (req, res) => {
    try {
        const {
            username,
            email,
            password,
            name
        } = req.body;
        const isMatch = await User.findOne({ username: username });
        if (!isMatch) {
            const salt = await bcrypt.genSalt(10);
            const hash = await bcrypt.hash(password, salt);
            const user = await new User({
                email,
                username,
                name,
                password: hash
            });
            await user.save();
            return res.status(200).send(user);
        } else {

            return res.status(400).send({
                msg: 'User already Exist',
                status: false
            });
        }
    } catch (error) {
        console.log(error);
        return res.status(500).send({
            msg: 'Internal server error.',
            status: false
        });
    }
}

exports.login = async (req, res) => {
    try {
        const {
            username,
            password
        } = req.body;
        const user = await User.findOne({ username: username });
        if (!user) {
            return res.status(400).send({
                msg: 'User not found',
                status: false
            });
        }
        else {
            const isMatch = await bcrypt.compare(password, user.password);
            if (!isMatch) {
                return res.status(400).send({
                    msg: 'Incorrect password!',
                    status: false
                });
            }
        }
        const token1 = jwt.sign({
            _id: user._id,
        }, 'mysecretkey', {
            expiresIn: '365d',
        });
        user.token = token1;
        await user.save();
        return res.status(200).send(user);
    } catch (error) {
        console.log(error);
        return res.status(500).send({
            msg: 'Internal server error.',
            status: false
        });
    }
}


exports.updateUser = async (req, res, next) => {
    try {
        const user = await User.findOne({
            _id: req.userId
        });
        if (!user) {
            res.status(404).send({
                status: false,
                message: 'User Not found',
            });
        }
        const data = req.body
        const options = {
            new: true
        }
        const userData = await User.findByIdAndUpdate({
            _id: req.userId
        }, data, options);
        return res.status(200).send({
            status: 200,
            userData,
            message: 'user Info updated successfully!'
        })

    } catch (error) {
        console.log(error);
        return res.send({
            msg: 'Internal server error.',
            status: false
        });
    }
}

exports.deleteUser = async (req, res) => {
    try {
        const user = await User.findByIdAndDelete({
            _id: req.userId
        });
        if (!user) {
            return res.status(404).send({
                status: false,
                msg: 'No user Exist'
            })
        }
        return res.status(200).send({
            status: true,
            msg: 'User Delete Successfully'
        })
    } catch (error) {
        console.log(error);
        return res.status(500).send({
            msg: 'Internal server error.',
            status: false
        });
    }
}
exports.forgotPassword = async (req, res) => {
    try {
        const user = await User.findOne({ email: req.body.email });
        if (!user) {
            res.status(400).send({
                status: false,
                message: "Incorrect Mail"
            })
        }
        let token = Math.floor(1000 + Math.random() * 9000);
        const mail = await transporter.sendMail({
            to: req.body.email,
            from: '<abc@gmail.com>',
            subject: 'Forgot Password Code',
            text: 'You are receiving this because you (or someone else) have requested the reset of the password for your account.\n\n',
            html: 'To continue with you forgot you password! The Verification code is :\n\n'
                + token +
                'If you did not request this, please ignore this email and your password will remain unchanged.\n',
        });
        user.resetToken = token;
        user.resetTokenExpiration = Date.now() + 3600000;
        await user.save();
        return res.status(200).send({
            status: true,
            message: "Please check your email, We will send you reset code!"
        })
    } catch (error) {
        console.log(error);
        return res.send({
            msg: 'Internal server error.',
            status: false
        });
    }
}
