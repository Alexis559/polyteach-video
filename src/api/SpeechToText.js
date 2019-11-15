const speech = require('@google-cloud/speech').v1p1beta1;
const logger = require('../helpers/logger');

require('dotenv').config();


// Create access to the Speech to text API
const speechClient = new speech.SpeechClient({
    projectId: process.env.PROJECT_ID,
    keyFilename: process.env.GOOGLE_APPLICATION_CREDENTIALS,
});

/**
 * Function to get the text and their timestamps for a video.
 *
 * @returns {Promise<{response: *}>} Return the text and their timestamps and the URL of the video on the Google Cloud Storage
 * @param gcUrlFile
 */
async function getTextFromVideo(gcUrlFile) {
    logger.log('info', 'src.api.SpeechToText.getTextFromVideo called', gcUrlFile);
    const audio = {
        uri: gcUrlFile,
    };

    // Some config for the Speech To Text API
    const config = {
        encoding: 'mp3',
        sampleRateHertz: 16000,
        languageCode: 'en-US',
        enableWordTimeOffsets: true,
        enableAutomaticPunctuation: true,
        model: 'video'
    };

    const request = {
        audio: audio,
        config: config
    };

    const [operation] = await speechClient.longRunningRecognize(request);
    const [response] = await operation.promise();

    logger.log('info', 'src.api.SpeechToText.getTextFromVideo returning', response);
    return {response: response};
}

module.exports = {
    getTextFromVideo: getTextFromVideo,
};
