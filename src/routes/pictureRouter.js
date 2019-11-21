const express = require('express');
const router = express();
const GCP = require('../api/GCPApi');
const logger = require('../helpers/logger');

// Get signed url to upload file
router.get('/upload/:pictureName', async function (req, res) {
    logger.log('info', 'GET /pictures/upload received', req);
    const URL = await GCP.getSignedURL(req.params.pictureName.replace(' ', '_'));
    res.send({
        signedURL: URL[0],
        pictureURL: encodeURI(`https://storage.googleapis.com/${GCP.getBucketName()}/${req.params.pictureName}`)
    });
});

module.exports = router;