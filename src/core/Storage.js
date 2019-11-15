const fs = require('fs');

const deleteFileFromStorage = (pathFile) => {
    fs.unlink(pathFile, function (err) {
        if (err) throw err;
        console.log('File deleted!');
    });
};

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
    createFolderStorage: createFolderStorage,
    deleteFileFromStorage: deleteFileFromStorage,
};