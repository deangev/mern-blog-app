const mongoose = require('mongoose');
const contactSchema = require('./contactSchema')
const messageSchema = require('./messageSchema')

const conversationSchema = new mongoose.Schema({
    name: {
        type: String,
        index: true
    },
    contacts: {
        type: [contactSchema],
        index: true
    },
    messages: {
        type: [messageSchema],
        index: true
    }
})

const Conversation = mongoose.model('Conversation', conversationSchema)

module.exports = Conversation;