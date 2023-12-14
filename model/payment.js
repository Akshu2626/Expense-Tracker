const mongoose = require('mongoose');
const paymentMod = new mongoose.Schema({
    exname: {
        type: String,
        require: [true, "enter properly"]
    },
    examt: {
        type: Number,
        require: [true, "enter amount"]
    }
}, { timestamps: true },
)


module.exports = mongoose.model('paymentDet', paymentMod);
