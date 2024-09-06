
const mongoose = require("mongoose");

mongoose.connect('')


const userSchema = new mongoose.Schema({
    firstName:{ 
        type: String,
        required:true
    },
    lastName: {
        type: String,
        required: true
    },
    username: {
        type: String,
        required:true
    },
    password: {
        type: String,
        required: true,
        minLength: 7
    }
});

const accountSchema = new mongoose.Schema({
    userId:{
        type: mongoose.Schema.Types.ObjectId, //Reference to user in User model with _id
        ref: 'User',
        required: true
    },
    balance:{
        type: Number,
        required: true
    }
})

const User = mongoose.model('User',userSchema);
const Account = mongoose.model('Account',accountSchema)

module.exports = {
    User,Account
}
