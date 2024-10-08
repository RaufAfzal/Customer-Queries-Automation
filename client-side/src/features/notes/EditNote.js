import { useState, useEffect } from 'react'
import { updateNote, fetchNotes } from './notesApi'
import { useSelector, useDispatch } from 'react-redux'
import { useParams, useNavigate } from 'react-router-dom'

const EditNote = () => {
    const { id } = useParams();
    const dispatch = useDispatch();
    const navigate = useNavigate();

    const { notes, status, error } = useSelector(state => state.notes);

    const noteToEdit = notes.find(note => note._id === id)
    console.log('note to edit is', noteToEdit)

    const [title, setTitle] = useState(noteToEdit?.title || '')
    const [text, setText] = useState(noteToEdit?.text || '')
    const [noteStatus, setNoteStatus] = useState(noteToEdit?.status || '')
    const [formError, setFormError] = useState('')


    useEffect(() => {
        if (status === 'idle') {
            dispatch(fetchNotes())
        }
    }, [status, dispatch])

    useEffect(() => {
        if (noteToEdit) {
            setTitle(noteToEdit?.title)
            setText(noteToEdit?.text)
            setNoteStatus(noteToEdit?.status)
        }
    }, [noteToEdit])

    const duplicateNote = notes.find(note => note.title === title && note._id !== id)

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!title || !text) {
            setFormError("Title and Text are required")
            return;
        }

        if (duplicateNote) {
            setFormError("Note with the samr title already exist")
            return;
        }

        const updatedNote = {
            _id: id,
            user: noteToEdit.user._id,
            text,
            title,
            status: noteStatus
        }
        try {
            await dispatch(updateNote(updatedNote)).unwrap();
            dispatch(fetchNotes())
            navigate('/dash/notes'); // Navigate only after the update is successful
        } catch (err) {
            setFormError(err.message); // Set error if update fails
        }
    }

    if (status === "loading") {
        return <p className="text-center text-gray-500">Loading users...</p>;
    }

    if (status === "failed") {
        return <p className="text-center text-red-500">Error: {error} </p>
    }


    return (
        <div className="max-w-md mx-auto bg-white p-6 rounded-lg shadow-md">
            <h2 className="text-2xl font-bold mb-4">Edit Note</h2>
            {formError && <p className="text-red-500 mb-4">{formError}</p>}
            <form onSubmit={handleSubmit}>
                <div className="mb-4 my-9">
                    <label className="block text-gray-700">Title</label>
                    <input
                        type="text"
                        value={title}
                        onChange={e => { setTitle(e.target.value) }}
                        className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring focus:border-blue-300"
                        required
                    />
                </div>
                <div className="mb-4 my-9">
                    <label className="block text-gray-700">Title</label>
                    <input
                        type="text"
                        value={text}
                        onChange={e => { setText(e.target.value) }}
                        className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring focus:border-blue-300"
                        required
                    />
                </div>
                <div className="mb-4 my-9">
                    <label className="block text-gray-700">Completed</label>
                    <select
                        type="text"
                        value={noteStatus.toString()}
                        onChange={e => { setNoteStatus(e.target.value === "true") }}
                        className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring focus:border-blue-300"
                        required
                    >
                        <option value="false">False</option>
                        <option value="true">true</option>
                    </select>
                </div>
                <button type="submit" className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring focus:border-blue-300 my-9">
                    Update Note
                </button>
            </form>
        </div>
    )
}

export default EditNote
