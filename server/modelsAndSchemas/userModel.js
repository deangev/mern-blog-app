const mongoose = require('mongoose');
const { index } = require('./contactSchema');
const contactSchema = require('./contactSchema');
const profileSchema = require('./profileSchema');

const userSchema = new mongoose.Schema({
    firstName: {
        type: String,
        required: true,
        index: true
    },
    lastName: {
        type: String,
        required: true,
        index: true
    },
    email: {
        type: String,
        required: true,
        unique: true
    },
    password: {
        type: String,
        required: true,
        index: true
    },
    contacts: {
        type: [contactSchema],
        index: true
    },
    profile: {
        type: [profileSchema]
    },
    gallery: {
        type: [Object],
        index: true
    }
})

const User = mongoose.model('User', userSchema)

module.exports = User, userSchema