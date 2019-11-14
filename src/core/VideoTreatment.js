const extractAudio = require('ffmpeg-extract-audio');

async function extractAudioFromVideo(videoPath, audioPath) {
    await extractAudio({
        input: videoPath,
        output: audioPath
    });
    return audioPath;
}

module.exports = {
    extractAudioFromVideo: extractAudioFromVideo,
};