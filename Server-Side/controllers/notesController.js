const Note = require('../models/Note')
const asyncHandler = require('express-async-handler')
const uploadFileToS3 = require('../utils/uploadFilesToS3')
const generatePresignedUrl = require('../utils/generatePresignedURL')
const deleteFiles = require('../utils/deleteFilesToS3')
const Attachment = require('../models/Attachment')


const getAllNotes = asyncHandler(async (req, res) => {
    const notes = await Note.find({}).populate('user', 'username').populate('attachment', 's3Url').lean()

    if (!notes?.length) {
        return res.status(400).json({ message: "No notes found" })
    }

    for (const note of notes) {
        const attachments = Array.isArray(note.attachment) ? note.attachment : [note.attachment];
        try {

            for (const attachment of attachments) {
                if (attachment) {
                    const key = attachment.s3Url.replace(`https://${process.env.AWS_BUCKET_NAME}.s3.amazonaws.com/`, '');
                    attachment.presignedUrl = await generatePresignedUrl(process.env.AWS_BUCKET_NAME, key)
                }
            }
        } catch (err) {
            console.log("Attachment or s3Url is missing")
        }
    }

    res.json(notes)
})

const createNewNote = asyncHandler(async (req, res) => {
    const { user, title, text } = req.body;

    if (!user || !title || !text) {
        return res.status(400).json({ message: "All fields are required" });
    }

    const duplicate = await Note.findOne({ title }).lean().exec();
    if (duplicate) {
        return res.status(409).json({ message: "Duplicate title found" });
    }

    let attachmentFields = []; // Initialize as an array

    // Check if files are present
    if (req.files['attachment']) {
        for (const file of req.files['attachment']) {
            const uploadResponse = await uploadFileToS3(file);

            const attachment = {
                fileName: file.originalname,
                mimeType: file.mimetype,
                fileSize: file.size,
                s3Key: uploadResponse.Key,
                s3Url: uploadResponse.Location,
                uploadedAt: Date.now(),
            };

            // Create the attachment document and store its ID
            const attachmentDocument = await Attachment.create(attachment);
            attachmentFields.push(attachmentDocument._id); // Add to attachmentFields
        }
    }

    const note = await Note.create({ user, title, text, attachment: attachmentFields });

    if (note) {
        res.status(200).json({ message: "New note created", note });
    } else {
        return res.status(400).json({ message: "Invalid note data received" });
    }
});


const updateNote = asyncHandler(async (req, res) => {
    const { _id, user, title, text, status } = req.body

    if (!_id || !user || !title || !text || typeof status !== 'boolean') {
        return res.status(400).json({ message: 'All fields are required' })
    }

    const note = await Note.findById(_id).exec()

    if (!note) {
        return res.status(400).json({ message: 'Note not found' })
    }

    const duplicate = await Note.findOne({ title }).lean().exec()

    if (duplicate && duplicate._id.toString() !== _id) {
        return res.status(409).json({ message: 'Duplicate note title' })
    }

    note.user = user
    note.title = title
    note.text = text
    note.status = status

    const updatedNote = await note.save()

    res.json(`${updatedNote.title} updated`)
})


const deleteNote = asyncHandler(async (req, res) => {
    const { _id } = req.body

    if (!_id) {
        return res.status(400).json({ message: 'Note ID required' })
    }

    const note = await Note.findById(_id).populate('attachment', 's3Url').exec()

    if (!note) {
        return res.status(400).json({ message: 'Note not found' })
    }

    const deletePromises = note.attachment.map(async (attachment) => {
        if (attachment) {
            const s3Key = attachment.s3Url.replace(`https://${process.env.AWS_BUCKET_NAME}.s3.amazonaws.com/`, '');
            await deleteFiles(process.env.AWS_BUCKET_NAME, s3Key)
        }
    })

    await Promise.all(deletePromises).catch(err => {
        console.log("error while deleting from s3", err)
    })

    const result = await note.deleteOne()

    const reply = `Note is deleted`

    res.json(reply)
})

module.exports = {
    getAllNotes,
    createNewNote,
    updateNote,
    deleteNote
}