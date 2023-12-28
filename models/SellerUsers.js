const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
    name:String,
    email:String,
    password:String
})

const SellerUserModel = mongoose.model('sellerUsers' , userSchema);
module.exports = SellerUserModel