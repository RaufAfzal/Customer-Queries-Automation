const express = require('express')
const router = express.Router()
const notesController = require('../controllers/notesController')
const verifyJWT = require('../middleware/verifyJWT')
const upload = require('../middleware/multer')

router.use(verifyJWT)

router.route('/')
    .get(notesController.getAllNotes)
    .post(upload.fields([{ name: 'attachment', maxCount: 5 }]), notesController.createNewNote)
    .patch(notesController.updateNote)
    .delete(notesController.deleteNote)

module.exports = router