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

const uploadToGcs = async (filePath) => {
    const audioPath = 'uploads/videos/' + filePath.replace(/^.*[\\\/]/, '').replace('.mp4', '.mp3');
    // Get the audio from the video (needs ffmpeg to be installed on the server)
    await extractAudio({
        input: filePath,
        output: audioPath
    });
    // We upload the audio on the Cloud Storage
    await storage.bucket(bucketName).upload(audioPath);
    await storage.bucket(bucketName).upload('uploads/videos/' + filePath.replace(/^.*[\\\/]/, ''));
    // We return the uri of the file on the Cloud Storage
    return `gs://${bucketName}/${filePath.replace(/^.*[\\\/]/, '').replace('.mp4', '.mp3')}`;
};

async function getTextFromVideo(filePath) {
    return await uploadToGcs(filePath)
        .then(async (gcsUri) => {
            console.log(gcsUri);
            const audio = {
                uri: gcsUri,
            };

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
            const transcription = response.results
                .map(result => result.alternatives[0].transcript)
                .join("\n");

            return {
                transcription: transcription.split('.'),
                videoURL: `https://storage.googleapis.com/${bucketName}/` + filePath.replace(/^.*[\\\/]/, '')
            }
        });

}

module.exports = {
    getTextFromVideo: getTextFromVideo
};