const express = require('express');
const router = express.Router();
const User = require('../models/users');
const Register = require('../models/register');
const jwt = require('jsonwebtoken');
const config = require('../../../config/database');
var bcrypt = require('bcryptjs');
const passport = require('passport');
const mongoose = require('mongoose');
const nodemailer = require('nodemailer');
const moment = require('moment');
const cors = require ("cors");


router.post('/register',  cors(), (req,res,next) => {
    const email = req.body.email;

    Register.getUserByEmail(email, (err,valid) =>{
        User.getUserByEmail(email, (err,response) => {
            if(response){
                return res.json({ success: false, msg: 'User exist' });
            } else {
                // let randomNumber = Math.floor(Math.random()*100000);
                let randomNumber = Math.random().toString(36).slice(-10);
                var smtpTransport = nodemailer.createTransport({
                    service: 'gmail',
                    host: 'smpt.gmail.com',
                    port: 587,        
                    secure: false, // true for 465, false for other ports
                    auth: {
                        user: 'kanja.26p@gmail.com',
                        pass: 'Kp26031995' 
                    }
                });   
                // setup email data with unicode symbols
                var mailOptions = {
                    to: req.body.email,
                    subject: "Context Reset password email notification for verify your account",
                    html: `
                    <div>
                        <p>==============</p>
                        
                        <p>Your Verification Code is :</p>
                        <b>${randomNumber}</b>
                        <p>==============</p>
                        <p>Click the link beflow for validation your code</p>
                        <p>==============</p>
                        https://feedme-forward.firebaseapp.com/#/codevalidate
                        <p>==============</p>
                    </div>
                    `
                }
                smtpTransport.sendMail(mailOptions, function (error, response) {
                    if (error) {
                        console.log(error);
                        return res.json({status: false, msg: "Mail Service is not availabe Please try after sme time"});
                        
                    } else {
                        var date =  new Date().toLocaleString('en-US', {
                            timeZone: 'Asia/Bangkok'
                        });
                        console.log("sec",date.getSeconds()+60);
                        let newUser = new User({
                            email: valid.email,
                            vCode: randomNumber,
                            exp_date: date,
                            status: req.body.status,
                            type: req.body.type,
                            userId: valid._id,
                            // clientId: req.body.clientId
                        });
                            // console.log("newUser.exp_date",newUser.exp_date);
                        
                            User.addUserDetails(newUser, (err, response) => {
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
            }
        });
    
    });
});

router.post('/checkCode', cors(), (req,res,next) =>{
    const vCode = req.body.vCode;
    User.getResetDate(vCode, (err, data) => {
        console.log("data",data)
        if (err) throw err;
        if (!data) {
            return res.json({ success: false, msg: 'Verification code is expired' });
        } else {
            return res.json({ success: true, msg: data });
        }
    });
});

module.exports = router; 