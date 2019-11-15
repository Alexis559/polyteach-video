const express = require('express');
const router = express();
const GCP = require('../api/GCPApi');
const ExtractAudio = require('../core/VideoTreatment');
const SpeechToText = require('../api/SpeechToText');
const Config = require('../config/Config');
const Subtitles = require('../core/Subtitles');
const logger = require('../helpers/logger');
const Storage = require('../core/Storage');

router.post('/upload', async function (req, res) {
    logger.log('info', 'POST /upload received', req);
    const URL = await GCP.getSignedURL(req.body.videoName);
    res.send({signedURL: URL[0]});
});

router.post('/subtitles', async function (req, res) {

    logger.log('info', 'POST /subtitles received', req);
    await Storage.createFolderStorage(Config.CONTENT_FOLDER);
    await Storage.createFolderStorage(Config.SUBTITLES_FOLDER);

    const videoPath = await GCP.downloadFromStorage(req.body.videoName, Config.CONTENT_FOLDER);
    // Extension of the video file "mp4", etc...
    const extension = req.body.videoName.substr(req.body.videoName.lastIndexOf('.'));

    // Return the video name with the extension in parameter => video.mp4 -> video.mp3
    const videoFileName = (newExtension) => {
        return req.body.videoName.replace(extension, newExtension);
    };

    const videoFilePath = (newExtension) => {
        return videoPath.placeVideo.replace(extension, newExtension);
    };

    const audioPath = await ExtractAudio.extractAudioFromVideo(videoPath.placeVideo, videoFilePath('.mp3'));
    const urlAudio = await GCP.uploadToStorage(audioPath);
    // Call to the Speech To Text API
    const result = await SpeechToText.getTextFromVideo(urlAudio.gsUrl);
    // Get the sentences from the result of the API
    const transcription = Subtitles.getSentences(result.response);
    // We get the timings for each sentences
    const timings = Subtitles.getSubtitlesTiming(result.response);
    // We create the VTT file
    const vttPath = Subtitles.createVTTFile(videoFileName(''), timings, transcription);
    // We upload the VTT file to the Google Cloud Storage
    const vttURL = await GCP.uploadToStorage(vttPath);

    // We delete the files from our storage
    Storage.deleteFileFromStorage(videoPath.placeVideo);
    Storage.deleteFileFromStorage(videoFilePath('.mp3'));
    Storage.deleteFileFromStorage(vttPath);

    res.send({videoURL: videoPath.videoUrl, transcription: transcription, vttURL: vttURL.fileUrl, timings: timings});
});

module.exports = router;
