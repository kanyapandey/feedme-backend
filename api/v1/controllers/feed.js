const express = require('express');
const router = express.Router();
const User = require('../models/users');
const Feed = require('../models/feed');
const Register = require('../models/register');
const jwt = require('jsonwebtoken');
const config = require('../../../config/database');
var bcrypt = require('bcryptjs');
const mongoose = require('mongoose');
const nodemailer = require('nodemailer');
const moment = require('moment');

router.post('/feed-form', (req,res,next) => {
    const email = req.body.email;
    User.getUserByEmail(email, (err, valid) => {
        if (err) {
            return res.json({ success: false, msg: 'User dont have verification code' });
        }
        // if(valid){
        //     return res.json({ success: false, msg: 'User exist' });
        // }
        else {
            console.log("valid",valid)
            let newUser = new Feed({
                category: req.body.category,
                subject: req.body.subject,
                rating: '',
                description: req.body.description,
                contact: req.body.contact,
                userId: valid.userId,
                count: ''
            });
            Feed.addUserDetails(newUser, (err, response) => {
                console.log("valid userid",newUser.userId)

                let quary = {$or:[{userId:newUser.userId}]}
                Feed.findOne(quary).count(function (e, counts) {

                    console.log(counts);
                    if (err) {
                        console.log(err);
                        res.json({ success: false, msg: 'Failed to register' });
                    }
                    else {
                        let query = {$set:{count:counts}}
                            Feed.update(query, function(err,raw) {
                                if (err) return handleError(err);
                                console.log('The raw response from Mongo was ', raw);
                            });
                        var data = counts;
                        res.json({ success: true, msg: data });
                    }
                });
            });
        }
        
    })
});

module.exports = router; 