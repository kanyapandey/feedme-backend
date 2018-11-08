const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const UserSchema = mongoose.Schema({
    id:{
        type: String
    },
    email:{
        type: String,
        required: true
    }
})

const Register=module.exports = mongoose.model('Register',UserSchema);

module.exports.getUserById = function(id,callback){
    Register.findById(id,callback);
};

module.exports.addUserDetails = function(newUserObj,callback){
    newUserObj.save(callback);       
};

module.exports.getUserByEmail = function(email,callback){
    const query = {email:email}
    Register.findOne(query,callback);
};
