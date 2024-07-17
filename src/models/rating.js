const mongoose = require('mongoose');


const rating = mongoose.Schema({
    userId: {
        type: String,
        required: true
    },
    rating : {
        type: Number,
        required: true
    }
});

module.exports = rating;