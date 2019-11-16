const express = require('express');
const router = express();

const videoRouter = require('./videoRouter');
router.use('/video', videoRouter);

const pictureRouter = require('./pictureRouter');
router.use('/picture', pictureRouter);

module.exports = router;