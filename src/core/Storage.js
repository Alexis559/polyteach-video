const multer = require('multer');

// The Storage options on the server
const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, 'uploads/videos/')
    },
    filename: function (req, file, cb) {
        cb(null, file.originalname)
    }
});

module.exports = {
    storage: storage
};