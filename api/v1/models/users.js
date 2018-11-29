const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const UserSchema = mongoose.Schema({
    id:{
        type: String
    },
    email:{
        type: String,
        required: true
    },
    vCode:{
        type: String
    },
    exp_date: {
        type: Date
    },
    status:{
        type: String
    },
    type:{
        type: String
    },
    userId:{
        type: mongoose.Schema.Types.ObjectId
    }
})

const User=module.exports = mongoose.model('User',UserSchema);

module.exports.getUserById = function(id,callback){
    User.findById(id,callback);
};

// module.exports.getUserByUsername = function(username,callback){
//     const query = {username:username}
//     User.findOne(query,callback);
// };

module.exports.getUserByEmail = function(email,callback){
    const query = {email:email}
    User.findOne(query,callback);
};
module.exports.addUserDetails = function(newUserObj,callback){
    newUserObj.save(callback);       
};

module.exports.getResetDate = function(vCode,  callback) {
    const query = {vCode:vCode}
    User.findOne(query,callback);
};