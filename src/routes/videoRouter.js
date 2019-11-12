const express = require('express');
const router = express();
const multer = require('multer');
const SpeechToText = require('../api/SpeechToText');
const Storage = require('../core/Storage');
const Subtitles = require('../core/Subtitles');

const upload = multer({storage: Storage.storage});

router.post('/subtitles', upload.single('video'), async function (req, res) {
    if (req.file.mimetype.split('/')[0] === 'video') {
        // Call to the Speech To Text API
        const result = await SpeechToText.getTextFromVideo(req.file.originalname);
        // Get the sentences from the result of the API
        const transcription = Subtitles.getSentences(result.response);
        // We get the timings for each sentences
        const timings = Subtitles.getSubtitlesTiming(result.response);
        // We create the VTT file
        const vttPath = Subtitles.createVTTFile(req.file.originalname.replace('.mp4', ''), timings, transcription);
        // We upload the VTT file to the Google Cloud Storage
        const vttURL = await SpeechToText.uploadToStorage(vttPath);

        // We send back the Video URL, the content of the video, the VTT file URL
        res.send({videoURL: result.videoURL, transcription: transcription, vttURL: vttURL, timings: timings});
    } else {
        res.sendStatus(415);
    }

});

module.exports = router;