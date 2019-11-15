require('dotenv').config();

const CONTENT_FOLDER = process.env.CONTENT_FOLDER;
const SUBTITLES_FOLDER = process.env.SUBTITLES_FOLDER;

module.exports = {
    CONTENT_FOLDER: CONTENT_FOLDER,
    SUBTITLES_FOLDER: SUBTITLES_FOLDER,
};