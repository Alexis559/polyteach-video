require('dotenv').config();
const fs = require('fs');

const CONTENT_FOLDER = process.env.CONTENT_FOLDER;
const SUBTITLES_FOLDER = process.env.SUBTITLES_FOLDER;

const createFolderStorage = (pathFolder) => {
    try {
        if (!fs.existsSync(pathFolder)) {
            fs.mkdirSync(pathFolder, {recursive: true});
        }
    } catch (err) {
        console.error(err);
    }
};

module.exports = {
    CONTENT_FOLDER: CONTENT_FOLDER,
    SUBTITLES_FOLDER: SUBTITLES_FOLDER,
    createFolderStorage: createFolderStorage,
};