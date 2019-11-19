const express = require('express');
const router = express();
const GCP = require('../api/GCPApi');
const logger = require('../helpers/logger');

// Get signed url to upload file
router.get('/upload/:pictureName', async function (req, res) {
    logger.log('info', 'POST /pictures/upload received', req);
    const URL = await GCP.getSignedURL(req.params.pictureName);
    res.send({
        signedURL: URL[0],
        pictureURL: `https://storage.googleapis.com/${GCP.getBucketName()}/${req.body.pictureName}`
    });
});

module.exports = router;