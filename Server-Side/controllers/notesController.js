const Note = require('../models/Note')
const asyncHandler = require('express-async-handler')


const getAllNotes = asyncHandler(async (req, res) => {
    const notes = await Note.find({}).populate('user', 'username').lean()
    console.log("Notes are ", notes)

    if (!notes?.length) {
        return res.status(400).json({ message: "No notes found" })
    }

    res.json(notes)
})

const createNewNote = asyncHandler(async (req, res) => {
    const { user, title, text } = req.body

    if (!user || !title || !text) {
        return res.status(400).json({ message: "All fields are required" })
    }

    const duplicate = await Note.findOne({ title }).lean().exec()
    if (duplicate) {
        return res.status(409).json({ message: "Duplicate title found" })
    }

    const note = await Note.create({ user, title, text })

    if (note) {
        res.status(200).json({ message: "New note created" })
    }
    else {
        return res.status(400).json({ message: "Invalid note data recieved" })
    }
})

const updateNote = asyncHandler(async (req, res) => {
    const { _id, user, title, text, status } = req.body

    if (!_id || !user || !title || !text || typeof status !== 'boolean') {
        return res.status(400).json({ message: 'All fields are required' })
    }

    const note = await Note.findById(_id).exec()
    console.log('note is', note)

    if (!note) {
        return res.status(400).json({ message: 'Note not found' })
    }

    const duplicate = await Note.findOne({ title }).lean().exec()
    console.log("Duplicate is", duplicate)

    if (duplicate && duplicate._id.toString() !== _id) {
        return res.status(409).json({ message: 'Duplicate note title' })
    }

    note.user = user
    note.title = title
    note.text = text
    note.status = status

    const updatedNote = await note.save()

    res.json(`'${updatedNote.title}' updated`)
})


const deleteNote = asyncHandler(async (req, res) => {
    const { _id } = req.body

    if (!_id) {
        return res.status(400).json({ message: 'Note ID required' })
    }

    const note = await Note.findById(_id).exec()
    console.log(note)

    if (!note) {
        return res.status(400).json({ message: 'Note not found' })
    }

    const result = await note.deleteOne()

    const reply = `Note '${result.title}' with ID ${result._id} deleted`

    res.json(reply)
})

module.exports = {
    getAllNotes,
    createNewNote,
    updateNote,
    deleteNote
}