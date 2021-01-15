const router = require('express').Router();
const aws = require('aws-sdk');
const multerS3 = require('multer-s3');
const multer = require('multer');
const path = require('path');
const User = require('../modelsAndSchemas/userModel');
const Post = require('../modelsAndSchemas/postModel')

const s3 = new aws.S3({
    accessKeyId: process.env.ACCESS_KEY_ID,
    secretAccessKey: process.env.SECRET_ACCESS_KEY,
    Bucket: 'mernupload'
});

const profileImgUpload = multer({
    storage: multerS3({
        s3: s3,
        bucket: 'mernupload',
        acl: 'public-read',
        key: function (req, file, cb) {
            cb(null, path.basename(file.originalname, path.extname(file.originalname)) + '-' + Date.now() + path.extname(file.originalname))
        }
    }),
    limits: { fileSize: 2000000 }, // In bytes: 5000000 bytes = 5 MB

}).single('profileImage');

router.post('/profile-img-upload', (req, res) => {
    try {
        profileImgUpload(req, res, async (error) => {
            if (error) {
                console.log('errors', error);
                res.json({ error: error });
            } else {
                // If File not found
                if (req.file === undefined) {
                    console.log('Error: No File Selected!');
                    res.json('Error: No File Selected');
                } else {
                    // If Success
                    const imageName = req.file.key;
                    const imageLocation = req.file.location;

                    // Save the file name into database into profile model
                    const userId = req.body.userId
                    var image1 = {
                        userId: userId,
                        imgURL: imageLocation
                    }
                    await User.findByIdAndUpdate(userId, {
                        profile: image1
                    })
                    const user = await User.findById(userId)

                    const postsComments = await Post.find().elemMatch("comments", { "id": user._id })
                    postsComments.map(async post => {
                        post.comments.map(async (comment) => {
                            if (comment.id == userId) {
                                await Post.updateOne({ 'comments._id': comment._id }, {
                                    $set: {
                                        'comments.$.profile': image1.imgURL
                                    }
                                })
                            }
                        })
                    })


                    await Post.updateMany({ "publisher.id": user._id }, {
                        $set: {
                            'publisher.profile': image1.imgURL
                        }
                    })

                    res.json({
                        image: imageName,
                        location: imageLocation
                    });
                }
            }
        });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

router.post('/gallery-img-upload', (req, res) => {
    try {
        profileImgUpload(req, res, async (error) => {
            if (error) {
                console.log('errors', error);
                res.json({ error: error });
            } else {
                // If File not found
                if (req.file === undefined) {
                    console.log('Error: No File Selected!');
                    res.json('Error: No File Selected');
                } else {
                    // If Success
                    const imageName = req.file.key;
                    const imageLocation = req.file.location;

                    // Save the file name into database into profile model
                    const userId = req.body.userId
                    var image1 = {
                        userId: userId,
                        imgURL: imageLocation
                    }
                    await User.findByIdAndUpdate(userId, {
                        $push: {
                            gallery: image1
                        }
                    })

                    res.json({
                        image: imageName,
                        location: imageLocation
                    });
                }
            }
        });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

module.exports = router;
