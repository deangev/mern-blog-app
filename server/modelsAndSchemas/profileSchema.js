const mongoose = require('mongoose');

const profileSchema = new mongoose.Schema({
    userId: {
        type: String,
        required: true
    },
    imgURL: String
});


module.exports = profileSchema;