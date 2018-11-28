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

router.post('/feed-form', (req,res,next) => {
    const email = req.body.email;
    User.getUserByEmail(email, (err, valid) => {
        if (err) {
            return res.json({ success: false, msg: 'User dont have verification code' });
        }
        else {
            function padDigits(number, digits) {
                return Array(Math.max(digits - String(number).length + 1, 0)).join(0) + number;
            }
            var options = { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' };
            let newUser = new Feed({
                category: req.body.category,
                subject: req.body.subject,
                rating: '',
                description: req.body.description,
                contact: req.body.contact,
                userId: valid.userId,
                count: '',
                date: new Date().toLocaleString('en-US', {
                    timeZone: 'Asia/Bangkok'
                },options),
                // date: new Date().toLocaleTimeString("en-US", options),
                // feedId: Math.floor(Math.random()*1000000),
                feedId: padDigits(1, 6)
            });
            Feed.addUserDetails(newUser, (err, response) => {
                console.log("valid userid",newUser.userId)

                let quary = {$or:[{userId:newUser.userId}]}
                Feed.findOne(quary).count(function (e, counts) {

                    console.log(counts);
                    if (err) {
                        console.log(err);
                        return res.json({ success: false, msg: 'Failed to register' });
                    }
                    else {
                        // let query = {$set:{count:counts, userId:newUser.userId}}
                            let query = {$set:{count:counts}}
                            Feed.update({userId:newUser.userId}, query, {multi: true}, function(err,raw) {
                                if (err) return handleError(err);
                                console.log('The raw response from Mongo was ', raw);
                            });
                        var data = counts;
                        return res.json({ success: true, msg: data });
                    }
                });
            });
        }
        
    })
});

router.get('/getCount/:userId', (req,res,next) =>{
    Feed.getCount(req, (err, data)=>{
        if (err) {
            // console.log(err);
            return res.json({ success: false, msg: 'Failed to get data' });
        }
        else {
            // console.log(data);
            return res.json({ success: true, data: data });
        }
    });
});

router.get('/getFeed/:userId', (req,res,next) =>{
    Feed.getFeed(req, (err, data)=>{
        if (err) {
            // console.log(err);
            return res.json({ success: false, msg: 'Failed to get data' });
        }
        else {
            // console.log(data);
            return res.json({ success: true, data: data });
        }
    });
});

module.exports = router; 