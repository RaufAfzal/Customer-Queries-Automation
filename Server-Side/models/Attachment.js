const mongoose = require('mongoose')

// Define attachment schema separately
const attachmentSchema = new mongoose.Schema({
    fileName: {
        type: String,
        required: true
    },
    mimeType: {
        type: String,
        required: true
    },
    fileType: {
        type: String,
        // required: true
    },
    fileSize: {
        type: Number,
        required: true
    },
    s3Key: {
        type: String,
        required: true
    },
    s3Url: {
        type: String,
        required: true
    },
    uploadedAt: {
        type: Date,
        default: Date.now,
        required: true
    }
})

// Create Attachment model
module.exports = mongoose.model('Attachment', attachmentSchema)