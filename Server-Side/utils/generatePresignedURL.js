const { GetObjectCommand } = require('@aws-sdk/client-s3');
const { getSignedUrl } = require('@aws-sdk/s3-request-presigner');
const s3Client = require('../config/awsConfig');

const generatePresignedUrl = async (bucketName, key) => {
    const command = new GetObjectCommand({
        Bucket: bucketName,
        Key: key,
    });

    const url = await getSignedUrl(s3Client, command, { expiresIn: 60 });
    return url
};

module.exports = generatePresignedUrl;
