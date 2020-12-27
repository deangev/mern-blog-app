const mongoose = require('mongoose');

const postSchema = new mongoose.Schema({
    publisher: {
        type: Object,
        required: true,
        index: true
    },
    content: {
        type: String,
        index: true
    },
    date: {
        type: String,
        index: true
    },
    likes: [{
        type: String,
        index: true
    }],
    comments: [{
        type: [Object],
        index: true
    }]
})

const Post = mongoose.model('Post', postSchema)

module.exports = Post