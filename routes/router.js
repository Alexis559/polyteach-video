const express = require('express');
const router = express();

videoRouter = require('./videoRouter');
router.use('/video', videoRouter);

module.exports = router;