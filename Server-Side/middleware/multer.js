const multer = require('multer');

const storage = multer.memoryStorage()

// Define allowed Types

const allowedTypes = [
    'application/pdf',     // PDF
    'application/msword',  // DOC
    'application/vnd.openxmlformats-officedocument.wordprocessingml.document', // DOCX
    'image/png',           // PNG
    'image/jpeg',          // JPEG
];

const fileFilter = (req, file, cb) => {
    if (allowedTypes.includes(file.mimetype)) {
        cb(null, true)
    } else {
        cb(new Error('Invalid file type, only pdf, word, doc, png, jpeg are required'))
    }
}
const upload = multer(
    {
        storage: storage,
        fileFilter: fileFilter,
        limits: { fileSize: 5 * 1024 * 1024 } //5mb file
    }
)


module.exports = upload;
