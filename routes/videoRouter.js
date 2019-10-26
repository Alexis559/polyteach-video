const express = require('express');
const router = express();
const multer = require('multer');
const SpeechToText = require('../api/SpeechToText');

// The path where we will store the videos
const upload = multer({dest: 'uploads/videos/'});

router.post('/subtitles', upload.single('video'), function (req, res) {
    Promise.resolve(SpeechToText.getTextFromVideo(req.file.path)).then(
        result => console.log(result),
        res.sendStatus(200)
    )
});

module.exports = router;