const router = require('express').Router();
const multer = require('multer');
const Image = require('../modelsAndSchemas/imageModel')
const User = require('../modelsAndSchemas/userModel');

var storage = multer.memoryStorage()
var upload = multer({ storage: storage })

router.post('/upload', upload.single("file"), async (req, res) => {
    try {
        const userId = req.body.userId
        var image1 = {
            name: req.file.originalname,
            img: {
                data: req.file.buffer,
                contentType: req.file.mimetype
            }
        }
        var image = await User.findByIdAndUpdate(userId, {
            profile: image1
        })
        res.json(image)
    } catch (err) {
        res.status(500).json({ message: err.message })
    }
})

router.get('/images', async (req, res) => {
    try {
        const {userId} = req.body;
        const user = await User.findById(userId)
        const image = user.profile[0];
        if (image !== null) {
            // res.contentType(image.img.contentType)
            return res.json(image.img.data.toString('base64'))
        } else {
            return res.json(null)
        }
    } catch (err) {
        res.status(500).json({ message: err.message })
    }
})

module.exports = router;