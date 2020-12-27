const mongoose = require('mongoose');

const messageSchema = new mongoose.Schema({
    senderId: {
        type: String,
        index: true
    },
    senderName: {
        type: String,
        index: true
    },
    content: {
        type: String,
        index: true
    }
});


module.exports = messageSchema;