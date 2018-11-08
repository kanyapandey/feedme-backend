const express = require('express');
const router = express.Router();
const User = require('../models/users');
const Register = require('../models/register');
const jwt = require('jsonwebtoken');
const config = require('../../../config/database');
var bcrypt = require('bcryptjs');
const mongoose = require('mongoose');
const nodemailer = require('nodemailer');
const moment = require('moment');

router.post('/register-email', (req,res,next) => {
    const email = req.body.email;
    Register.getUserByEmail(email, (err,valid) =>{
        if(valid){
            return res.json({ success: false, msg: 'User exist' });
        } else {
            let newUser = new Register({
                email: req.body.email
            });
        
            Register.addUserDetails(newUser, (err, response) => {
                if (err) {
                    console.log(err);
                    return res.json({ success: false, msg: 'Failed to insert forgetpassword fields' });
                }
                else {
                    return res.json({ success: true, msg: 'Fields added in ForgetPassword Table' });
                }
            });
        }
    });
});

module.exports = router; 