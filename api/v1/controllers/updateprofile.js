const express = require('express');
const router = express.Router();
const User = require('../models/users');
const Feed = require('../models/feed');
const Register = require('../models/register');
const Update = require('../models/updateprofile');
const config = require('../../../config/database');
const mongoose = require('mongoose');


router.post('/update-profile', (req,res,next) => {
    const user_email = req.body.user_email;
    User.getUserByEmail(user_email, (err,valid) =>{
        let newProfile = new Update({
            username: req.body.username,
            password: req.body.password,
            birthyear: req.body.birthyear,
            gender: req.body.gender,
            status: req.body.status,
            userId: valid.userId,
            bu: req.body.bu,
            email: req.body.email,
            phone: req.body.phone
        });
        Update.addUserDetails(newProfile, (err, response) => {
            if (err) {
                console.log(err);
                    return res.json({ success: false, msg: 'Failed to insert forgetpassword fields' });
            }
            else {
                    return res.json({ success: true, msg: 'Fields added in ForgetPassword Table' });
            }
        });
    });
});

router.post('/login', (req,res,next) =>{
    const username = req.body.username;
    const password = req.body.password;
    Update.login(username,password, (err, data) => {
        if (err) throw err;
        if (!data) {
            return res.json({ success: false, msg: 'Incorrect username or password' });
        } else {
            return res.json({ success: true, msg: data });
        }
    });
});

router.get('/userprofile/:_id', (req,res,next) => {
    Update.getProfile(req, (err, data)=>{
        if (err) {
            // console.log(err);
            res.json({ success: false, msg: 'Failed to get data' });
        }
        else {
            // console.log(data);
            res.json({ success: true, data: data });
        }
    });
});

module.exports = router; 