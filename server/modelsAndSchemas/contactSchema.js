const mongoose = require('mongoose');

const contactSchema = new mongoose.Schema({
    id: {
        type: String,
        index: true
    },
    name: {
        type: String,
        index: true
    },
    email: {
        type: String
    }
});

module.exports = contactSchema;