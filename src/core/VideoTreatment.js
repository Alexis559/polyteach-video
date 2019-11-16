const extractAudio = require('ffmpeg-extract-audio');
const logger = require('../helpers/logger');

/**
 * Function to extract audio from a video.
 *
 * @param videoPath The path of the video
 * @param audioPath The path where will be saved the audio
 * @returns {Promise<*>}
 */
const extractAudioFromVideo = async (videoPath, audioPath) => {
    logger.log('info', 'src.core.VideoTreatment.extractAudioFromVideo called', videoPath, audioPath);
    await extractAudio({
        input: videoPath,
        output: audioPath
    });
    return audioPath;
};

module.exports = {
    extractAudioFromVideo: extractAudioFromVideo,
};
