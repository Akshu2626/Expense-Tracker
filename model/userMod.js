const mongoose = require('mongoose');
const plm = require('passport-local-mongoose')
const userMod = new mongoose.Schema({
    name: {
        type: String,
        require: [true, "enter name plz"]
    },
    email: {
        type: String,
        require: [true, "enter name plz"]
    },
    token: { type: Number, default: -1 },
    password: {
        type: String,
        require: [true, "enter name plz"]
    },
    cpassword: {
        type: String,
        require: [true, "enter name plz"]
    },
    city: {
        type: String,
        require: [true, "enter name plz"]
    },
})

userMod.plugin(plm)

module.exports = mongoose.model('userData', userMod);