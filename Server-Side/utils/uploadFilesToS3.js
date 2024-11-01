const { PutObjectCommand } = require('@aws-sdk/client-s3');
const s3Client = require('../config/awsConfig');
const crypto = require('crypto');

const generateFileName = (bytes = 32) => crypto.randomBytes(bytes).toString('hex')


const uploadFileToS3 = async (file) => {
    const fileName = generateFileName()
    try {
        const uploadParams = {
            Bucket: process.env.AWS_BUCKET_NAME,
            Key: fileName, // You can customize the key
            Body: file.buffer,
            ContentType: file.mimetype,
        };

        const command = new PutObjectCommand(uploadParams);
        await s3Client.send(command);

        return { Key: uploadParams.Key, Location: `https://${process.env.AWS_BUCKET_NAME}.s3.amazonaws.com/${uploadParams.Key}` };
    } catch (err) {
        console.log("error uploading to s3", err)
        throw err
    }
};

module.exports = uploadFileToS3;
