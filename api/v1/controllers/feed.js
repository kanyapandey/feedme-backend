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
const cors = require ("cors");

router.post('/feed-form/:userId', cors(), (req,res,next) => {
    // const email = req.body.email;
    const query = {_id:req.params.userId};
    User.findOne(query, (err, valid) => {
        console.log("valid",valid)
        if (err) {
            return res.json({ success: false, msg: 'User dont have verification code' });
        }
        else {
            var options = { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' };
            let newUser = new Feed({
                category: req.body.category,
                subject: req.body.subject,
                rating: '',
                description: req.body.description,
                contact: req.body.contact,
                userId: valid._id,
                count: '',
                date: new Date().toLocaleString('en-US', {
                    timeZone: 'Asia/Bangkok'
                },options),
                feedId: ''
            });
            // str1 = str1 + 1;
            Feed.addUserDetails(newUser, (err, response) => {
                console.log("valid userid",newUser.userId)

                let quary = {$or:[{userId:newUser.userId}]}
                Feed.findOne(quary).count(function (e, counts) {
                    // newUser.feedId = "00000" + counts;
                    if (counts.toString().length === 1){
                        newUser.feedId = "00000" + counts;
                    }else if (counts.toString().length === 2) {
                        newUser.feedId = "0000" + counts;
                    }else if (counts.toString().length === 3){
                        newUser.feedId = "000" + counts;
                    }
                    newUser.save();
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

router.get('/getCount/:userId', cors(), (req,res,next) =>{
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

router.get('/getFeed/:userId', cors(), (req,res,next) =>{
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
