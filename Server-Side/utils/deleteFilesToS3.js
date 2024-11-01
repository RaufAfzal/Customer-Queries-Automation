const { DeleteObjectCommand } = require('@aws-sdk/client-s3');
const s3Client = require('../config/awsConfig');

const deleteFiles = async (bucket, key) => {
    try {
        const deleteParams = {
            Bucket: bucket,
            Key: key
        }
        const command = new DeleteObjectCommand(deleteParams);
        await s3Client.send(command);


    } catch (err) {
        console.log("error while deleting from s3", err)
        throw err
    }
}

module.exports = deleteFiles