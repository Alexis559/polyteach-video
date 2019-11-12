const speech = require('@google-cloud/speech').v1p1beta1;
const {Storage} = require('@google-cloud/storage');
const extractAudio = require('ffmpeg-extract-audio');

require('dotenv').config();

// Name of the place where will be stored the audio file on the Cloud Storage
const bucketName = process.env.BUCKET_NAME;

// Creates access to Cloud Storage
const storage = new Storage({
    projectId: process.env.PROJECT_ID,
    keyFilename: process.env.GOOGLE_APPLICATION_CREDENTIALS,
});

// Create access to the Speech to text API
const speechClient = new speech.SpeechClient({
    projectId: process.env.PROJECT_ID,
    keyFilename: process.env.GOOGLE_APPLICATION_CREDENTIALS,
});

/**
 * Function to upload a file on the Google Cloud Storage.
 *
 * @param filePath The path to the file we want to upload
 * @returns {Promise<string>}
 */
async function uploadToStorage(filePath) {
    await storage.bucket(bucketName).upload(filePath);
    return `https://storage.googleapis.com/${bucketName}/` + filePath.replace(/^.*[\\\/]/, '')
}

/**
 * Function to extract the audio and upload it to Google Cloud Storage
 *
 * @param file the name of the video (must be in uploads/videos)
 * @returns {Promise<string>}
 */
const uploadToGcs = async (file) => {
    const fileName = file.replace(file.split('.')[file.split('.').length - 1], "");
    const audioPath = 'uploads/videos/' + fileName + '.mp3';
    const videoPath = 'uploads/videos/' + file;
    // Get the audio from the video (needs ffmpeg to be installed on the server)
    await extractAudio({
        input: videoPath,
        output: audioPath
    });
    // We upload the audio on the Cloud Storage
    await uploadToStorage(audioPath);
    // We upload the video on the Cloud Storage
    await uploadToStorage('uploads/videos/' + file);
    // We return the uri of the file on the Cloud Storage
    return `gs://${bucketName}/${fileName}` + '.mp3';
};

/**
 * Function to get the text and their timestamps for a video.
 *
 * @param file The NAME of the video file (must be in uploads/videos)
 * @returns {Promise<{videoURL: string, response: *}>} Return the text and their timestamps and the URL of the video on the Google Cloud Storage
 */
async function getTextFromVideo(file) {
    return await uploadToGcs(file)
        .then(async (gcsUri) => {
            const audio = {
                uri: gcsUri,
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

            return {response: response, videoURL: `https://storage.googleapis.com/${bucketName}/` + file};
        });

}

module.exports = {
    getTextFromVideo: getTextFromVideo,
    uploadToStorage: uploadToStorage
};