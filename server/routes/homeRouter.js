const router = require('express').Router();
const Post = require('../modelsAndSchemas/postModel');
const User = require('../modelsAndSchemas/userModel');
const mongoose = require('mongoose');

router.post("/post", async (req, res) => {
    try {
        const { publisherId, content, date } = req.body
        if (!publisherId || !content || !date)
            return res.status(400).json({ message: "Not all fields have been entered" });

        const publisher = await User.findById(publisherId)
        if (!publisher)
            return res.status(400).json({ message: "You are not logged in." });


        const newPost = new Post({
            publisher: {
                id: publisher._id,
                firstName: publisher.firstName,
                lastName: publisher.lastName,
                profile: publisher.profile[0] && publisher.profile[0].imgURL
            },
            content: content,
            date: date
        })

        newPost.save()

        res.json(newPost)

    } catch (err) {
        res.status(500).json({ message: err.message })
    }
})

router.get('/get-posts', async (req, res) => {
    const posts = await Post.find({})
    res.json(posts)
})

router.post('/like', async (req, res) => {
    try {
        const { userId, postId } = req.body;
        const post = await Post.find({ _id: postId })
        const liked = post[0].likes.includes(userId)
        if (!liked) {
            let newLike = await Post.findOneAndUpdate({ _id: postId }, {
                $push: {
                    likes: userId
                }
            });
            res.json(newLike)
        } else {
            let deletedLike = await Post.findOneAndUpdate({ _id: postId }, {
                $pull: {
                    likes: userId
                }
            })
            res.json(deletedLike)
        }
    } catch (err) {
        res.status(500).json({ message: err.message })
    }
})

router.post('/comment', async (req, res) => {
    try {
        const { commenterId, postContent, postId } = req.body;
        const commenter = await User.findById(commenterId);
        const newId2 = new mongoose.Types.ObjectId()

        const newPost = await Post.findOneAndUpdate({ _id: postId }, {
            $push: {
                comments: {
                    _id: newId2,
                    id: commenter._id,
                    firstName: commenter.firstName,
                    lastName: commenter.lastName,
                    content: postContent,
                    profile: commenter.profile[0] && commenter.profile[0].imgURL
                }
            }
        })

        res.json(newPost)

    } catch (err) {
        res.status(500).json({ message: err.message })
    }
})

module.exports = router