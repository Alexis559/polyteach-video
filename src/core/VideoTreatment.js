const extractAudio = require('ffmpeg-extract-audio');
const logger = require('../helpers/logger');

async function extractAudioFromVideo(videoPath, audioPath) {
    logger.log('info', 'src.core.VideoTreatment.extractAudioFromVideo called', videoPath, audioPath);
    await extractAudio({
        input: videoPath,
        output: audioPath
    });
    return audioPath;
}

module.exports = {
    extractAudioFromVideo: extractAudioFromVideo,
};
