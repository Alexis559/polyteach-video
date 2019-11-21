const express = require('express');
const router = express();
const GCP = require('../api/GCPApi');
const ExtractAudio = require('../core/VideoTreatment');
const SpeechToText = require('../api/SpeechToText');
const Config = require('../config/Config');
const Subtitles = require('../core/Subtitles');
const logger = require('../helpers/logger');
const Storage = require('../core/Storage');

// Return the video name with the extension in parameter => video.mp4 -> video.mp3
const videoFileName = (videoName, newExtension) => {
    // Extension of the video file "mp4", etc...
    const extension = videoName.substr(videoName.lastIndexOf('.'));
    return videoName.replace(extension, newExtension);
};

const videoFilePath = (videoName, videoPath, newExtension) => {
    // Extension of the video file "mp4", etc...
    const extension = videoName.substr(videoName.lastIndexOf('.'));
    return videoPath.placeVideo.replace(extension, newExtension);
};

// Get signed url to upload file
router.get('/upload/:videoName', async function (req, res) {
    logger.log('info', 'GET video/upload received', req);
    const URL = await GCP.getSignedURL(req.params.videoName);
    res.send({signedURL: URL[0]});
});

// Create VTT file for a video
router.get('/subtitles/:videoName', async function (req, res) {
    logger.log('info', 'GET video/subtitles received ', req);
    await Storage.createFolderStorage(Config.CONTENT_FOLDER);
    await Storage.createFolderStorage(Config.SUBTITLES_FOLDER);
    try {
        const videoPath = await GCP.downloadFromStorage(req.params.videoName, Config.CONTENT_FOLDER);
        const vttURL = await treatmentSub(videoPath, req.params.videoName);
        GCP.deleteFileFromBucket(videoFileName(req.params.videoName, '.mp3'));
        res.send({videoURL: videoPath.videoUrl, vttURL: vttURL.fileUrl});
    } catch (e) {
        console.log(e);
        logger.log('error', 'POST video/subtitles error ', e, req.params.videoName);
        res.sendStatus(500);
    }
});

// Get subtitles from a VTT file
router.post('/vtt', async function (req, res) {
    logger.log('info', 'POST video/vtt received ', req);
    const vttURL = req.body.vttURL;
    // eslint-disable-next-line no-useless-escape
    const vttPath = await GCP.downloadFromStorage(vttURL.replace(/^.*[\\\/]/, ''), Config.SUBTITLES_FOLDER);
    const content = await Storage.readContentFile(vttPath.placeVideo);
    const subtitles = Subtitles.parseVttFile(content);
    Storage.deleteFileFromStorage(vttPath.placeVideo);
    res.send(subtitles);
});

const treatmentSub = async (videoPath, videoName) => {
    logger.log('info', 'src.routes.videoRouter.treatmentSeb called ', videoPath, videoName);
    const audioPath = await ExtractAudio.extractAudioFromVideo(videoPath.placeVideo, videoFilePath(videoName, videoPath, '.mp3'));
    const urlAudio = await GCP.uploadToStorage(audioPath);
    // Call to the Speech To Text API
    const result = await SpeechToText.getTextFromVideo(urlAudio.gsUrl);
    // Get the sentences from the result of the API
    const transcription = Subtitles.getSentences(result.response);
    // We get the timings for each sentences
    const timings = Subtitles.getSubtitlesTiming(result.response);
    // We create the VTT file
    const vttPath = Subtitles.createVTTFile(videoFileName(videoName, ''), timings, transcription, Config.SUBTITLES_FOLDER);
    // We upload the VTT file to the Google Cloud Storage
    const vttURL = await GCP.uploadToStorage(vttPath);
    await deleteFiles(videoPath, videoName, vttPath);

    return vttURL;
};

const deleteFiles = async (videoPath, videoName, vttPath) => {
    logger.log('info', 'src.routes.videoRouter.deleteFile called ', videoPath, videoName, vttPath);
    // We delete the files from our storage
    Storage.deleteFileFromStorage(videoPath.placeVideo);
    Storage.deleteFileFromStorage(videoFilePath(videoName, videoPath, '.mp3'));
    Storage.deleteFileFromStorage(vttPath);
};

module.exports = router;
