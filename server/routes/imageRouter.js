const router = require('express').Router();
const aws = require('aws-sdk');
const multerS3 = require('multer-s3');
const multer = require('multer');
const path = require('path');
const User = require('../modelsAndSchemas/userModel')

const s3 = new aws.S3({
    accessKeyId: 'AKIAUKCQJQEPJ3E6F5GN',
    secretAccessKey: '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',
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

                res.json({
                    image: imageName,
                    location: imageLocation
                });
            }
        }
    });
});

router.post('/gallery-img-upload', (req, res) => {
    profileImgUpload(req, res, async (error) => {
        console.log(req.body);
        console.log(req.file);
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
});

module.exports = router;
