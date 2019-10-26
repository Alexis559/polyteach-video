const express = require('express');
const router = express();
const multer = require('multer');
const SpeechToText = require('../api/SpeechToText');
const fs = require('fs');

// The Storage options on the server
var storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, 'uploads/videos/')
  },
  filename: function (req, file, cb) {
    cb(null, file.originalname)
  }
});


const upload = multer({storage: storage});

router.post('/subtitles', upload.single('video'), async function (req, res) {
  const result = await SpeechToText.getTextFromVideo(req.file.path);
  console.log(result);
  res.send(result)
});

module.exports = router;