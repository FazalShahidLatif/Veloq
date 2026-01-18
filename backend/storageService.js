// backend/storageService.js

const archiver = require('archiver');
const AWS = require('aws-sdk');
const fs = require('fs');
const path = require('path');

// Configure AWS S3
const s3 = new AWS.S3();

/**
 * Creates a ZIP file from an array of file paths.
 * @param {Array<string>} filePaths - The paths of files to zip.
 * @param {string} zipPath - The path where the ZIP file will be created.
 */
function createZip(filePaths, zipPath) {
    const output = fs.createWriteStream(zipPath);
    const archive = archiver('zip');

    output.on('close', () => {
        console.log(`Created ZIP file: ${zipPath}, total bytes: ${archive.pointer()}`);
    });
    archive.on('error', (err) => { throw err; });

    archive.pipe(output);

    filePaths.forEach(filePath => {
        const fileName = path.basename(filePath);
        archive.file(filePath, { name: fileName });
    });

    return archive.finalize();
}

/**
 * Uploads a file to S3 storage.
 * @param {string} filePath - The path of the file to upload.
 * @param {string} bucketName - The S3 bucket name.
 * @param {string} key - The key under which the file will be stored.
 */
function uploadToStorage(filePath, bucketName, key) {
    const fileStream = fs.createReadStream(filePath);
    const uploadParams = { Bucket: bucketName, Key: key, Body: fileStream };

    return s3.upload(uploadParams).promise();
}

/**
 * Retrieves a file from S3 storage.
 * @param {string} bucketName - The S3 bucket name.
 * @param {string} key - The key of the file to retrieve.
 */
function getFromStorage(bucketName, key) {
    const params = { Bucket: bucketName, Key: key };
    return s3.getObject(params).promise();
}

/**
 * Generates a signed URL for accessing a file in S3 storage.
 * @param {string} bucketName - The S3 bucket name.
 * @param {string} key - The key of the file for which to generate the URL.
 * @param {number} expiresIn - The expiration time for the URL in seconds.
 */
function generateSignedUrl(bucketName, key, expiresIn) {
    const params = { Bucket: bucketName, Key: key, Expires: expiresIn };
    return s3.getSignedUrl('getObject', params);
}

module.exports = { createZip, uploadToStorage, getFromStorage, generateSignedUrl };