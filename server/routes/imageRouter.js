const router = require('express').Router();
const multer = require('multer');
const Image = require('../modelsAndSchemas/imageModel')

var storage = multer.memoryStorage()
var upload = multer({ storage: storage })

router.post('/upload', upload.single("file"), (req, res) => {
    var image = new Image({
        name: req.file.originalname
    })
    image.img.data = req.file.buffer;
    image.img.contentType = req.file.mimetype;
    image.save();

})

router.get('/images', async (req, res) => {
    const image = await Image.findOne({})
    if (image !== null) {
        // res.contentType(image.img.contentType)
        res.json(image.img.data.toString('base64'))
    }
})

module.exports = router;