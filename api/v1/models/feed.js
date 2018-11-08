const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const UserSchema = mongoose.Schema({
    id:{
        type: String
    },
    category:{
        type: String,
        required: true
    },
    subject:{
        type: String,
        required: true
    },
    rating:{
        type: String
    },
    description:{
        type: String
    },
    contact:{
        type: String
    },
    userId:{
        type: mongoose.Schema.Types.ObjectId
    },
    count:{
        type: Number
    }
})

const Feed=module.exports = mongoose.model('Feed',UserSchema);

module.exports.getUserById = function(id,callback){
    Feed.findById(id,callback);
};

module.exports.addUserDetails = function(newUserObj,callback){
    newUserObj.save(callback);       
};

module.exports.getUserByEmail = function(email,callback){
    const query = {email:email}
    Feed.findOne(query,callback);
};

module.exports.getUserByUserId = function(userId,callback){
    const query = {userId:userId}
    Feed.findOne(query,callback);
};
