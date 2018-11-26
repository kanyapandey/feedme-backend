const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const UserSchema = mongoose.Schema({
    id:{
        type: String
    },
    username:{
        type: String,
        required: true
    },
    password:{
        type: String,
        required: true
    },
    birthyear:{
        type: String,
        required: true
    },
    gender:{
        type: String,
        required: true
    },
    status:{
        type: String
    },
    userId:{
        type: mongoose.Schema.Types.ObjectId
    },
    bu:{
        type: String
    },
    email:{
        type: String
    },
    phone: {
        type: String
    }
})

const Update=module.exports = mongoose.model('Update',UserSchema);

module.exports.getUserById = function(id,callback){
    Update.findById(id,callback);
};

module.exports.addUserDetails = function(newUserObj,callback){
    newUserObj.save(callback);       
};

module.exports.login = function(username,password,  callback) {
    const query = {username:username,password:password}
    Update.findOne(query,callback);
};

module.exports.getProfile = function(req,callback){
    let filter = {};
    if(req.params.userId){
        filter = {userId:req.params.userId};
    }
    Update.find(filter,"-_id -__v -userId ", callback);
};