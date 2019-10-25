const express = require('express');
const router = express();
const multer = require('multer');

// The path where we will store the videos
var upload = multer({dest: 'uploads/videos/'});

router.post('/subtitles', upload.single('video'), function (req, res) {
    res.sendStatus(200)
});

module.exports = router;