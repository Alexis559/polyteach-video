const {Storage} = require('@google-cloud/storage');
const logger = require('../helpers/logger');

require('dotenv').config();

// Name of the place where will be stored the audio file on the Cloud Storage
const bucketName = process.env.BUCKET_NAME;

// Creates access to Cloud Storage
const storage = new Storage({
    projectId: process.env.PROJECT_ID,
    keyFilename: process.env.GOOGLE_APPLICATION_CREDENTIALS,
});

/**
 * Function to get the options for the signed URL.
 *
 * @returns {{expires: number, action: string, version: string}}
 */
const getOptions = () => {
    logger.log('info', 'src/api/GCPApi.getOptions called');
    return {
        version: 'v4',
        action: 'write',
        expires: Date.now() + 5 * 60 * 1000, // 5 minutes
    };
};

/**
 * Function to get the options for the download.
 *
 * @param videoName The file name to download
 * @param contentFolder The path where well be saved the file
 * @returns {{destination: string}}
 */
const optionsDownload = (videoName, contentFolder) => {
    logger.log('info', 'src/api/GCPApi.optionsDownload called', videoName, contentFolder);
    return {
        // The path to which the file should be downloaded, e.g. "./file.txt"
        destination: `${contentFolder}/${videoName}`,
    };
};


/**
 * Function to upload a file on the Google Cloud Storage.
 *
 * @param filePath The path to the file we want to upload
 * @returns {Promise<{gsUrl: string, fileUrl: string}>}
 */
const uploadToStorage = async (filePath) => {
    logger.log('info', 'src/api/GCPApi.uploadToStorage called', filePath);
    await storage.bucket(bucketName).upload(filePath);
    // eslint-disable-next-line no-useless-escape
    const fileName = filePath.replace(/^.*[\\\/]/, '');
    return {
        gsUrl: `gs://${bucketName}/${fileName}`,
        fileUrl: `https://storage.googleapis.com/${bucketName}/${fileName}`
    };
};

/**
 * Function to download a file from GCP.
 *
 * @param videoName The file name to download
 * @param contentFolder The path where will be saved the file
 * @returns {Promise<{videoUrl: string, placeVideo: string}>}
 */
const downloadFromStorage = async (videoName, contentFolder) => {
    logger.log('info', 'src/api/GCPApi.downloadFromStorage called', videoName, contentFolder);
    await storage
        .bucket(bucketName)
        .file(videoName)
        .download(optionsDownload(videoName, contentFolder));
    return {
        placeVideo: `${contentFolder}/${videoName}`,
        videoUrl: `https://storage.googleapis.com/${bucketName}/${videoName}`
    };
};

/**
 * Function to generate a signed URL.
 *
 * @param videoName The file name we want to access on GCP
 * @returns {Promise<[string]>}
 */
const getSignedURL = async (videoName) => {
    logger.log('info', 'src/api/GCPApi.downloadFromStorage called', getSignedURL);
    const url = await storage
        .bucket(bucketName)
        .file(videoName)
        .getSignedUrl(getOptions());
    return url;
};

const getBucketName = () => {
    return process.env.BUCKET_NAME;
};

module.exports = {
    uploadToStorage: uploadToStorage,
    getSignedURL: getSignedURL,
    downloadFromStorage: downloadFromStorage,
    getBucketName: getBucketName,
};
