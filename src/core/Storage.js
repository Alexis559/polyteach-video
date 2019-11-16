const fs = require('fs');
const logger = require('../helpers/logger');

/**
 * Function to delete a file.
 *
 * @param pathFile The path of the file to delete
 */
const deleteFileFromStorage = (pathFile) => {
    fs.unlink(pathFile, function (err) {
        if (err) {
            logger.log('error', 'src.core.Storage.deleteFileFromStorage error', err);
            throw err;
        }
        console.log(`File ${pathFile} deleted!`);
        logger.log('info', 'src.core.Storage.deleteFileFromStorage ', `File ${pathFile} deleted!`);
    });
};

/**
 * Function to create folders.
 *
 * @param pathFolder The path of the folder to create
 */
const createFolderStorage = (pathFolder) => {
    try {
        if (!fs.existsSync(pathFolder)) {
            fs.mkdirSync(pathFolder, {recursive: true});
        }
    } catch (err) {
        console.error(err);
        logger.log('error', 'src.core.Storage.createFolderStorage ', err);
    }
};

/**
 * Function to read the content of a file.
 *
 * @param filePath The path to the file.
 * @returns {Promise<string>}
 */
const readContentFile = async (filePath) => {
    return fs.readFileSync(filePath, 'utf-8');
};


/**
 * Function to write a file.
 *
 * @param filename The name fo the file
 * @param text The text to write
 * @param contentFolder Path where will be write the file
 * @returns {string} The path where is stored the file on the server
 */
const writeFile = (filename, text, contentFolder) => {
    logger.log('info', 'src.core.Subtitles.writeFile called', filename, text);
    fs.writeFile(contentFolder + '/' + filename, text, function (err) {
        if (err) {
            console.log(err);
            logger.log('error', 'src.core.Subtitles.writeFile error', filename, text, contentFolder);
        }
        console.log(`The file ${contentFolder}/${filename} was saved!`);
        logger.log('info', 'src.core.Subtitles.writeFile info', `The file ${contentFolder}/${filename} was saved!`);
    });
    return `${contentFolder}/${filename}`;
};


module.exports = {
    createFolderStorage: createFolderStorage,
    deleteFileFromStorage: deleteFileFromStorage,
    readContentFile: readContentFile,
    writeFile: writeFile,
};