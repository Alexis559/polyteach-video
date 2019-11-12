const express = require('express');
const router = express();

const videoRouter = require('./videoRouter');
router.use('/video', videoRouter);

module.exports = router;