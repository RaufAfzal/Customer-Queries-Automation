import { addNewNote, fetchNotes } from "./notesApi";
import { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";

const NoteForm = () => {
    const [title, setTitle] = useState("");
    const [text, setText] = useState("");
    const [assigned, setAssigned] = useState("");
    const [errors, setErrors] = useState("");

    const dispatch = useDispatch();
    const navigate = useNavigate();
    const { notes, status } = useSelector((state) => state.notes);

    useEffect(() => {
        if (status === "idle") {
            dispatch(fetchNotes());
        }
    }, [status, dispatch]);

    const duplicateNote = notes.find(note => note.title === title)

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!title || !text || !assigned) {
            setErrors("All fields are required");
            return;
        }

        if (duplicateNote) {
            setErrors("A note with this title already exists.");
            return;
        }

        const addNote = {
            title,
            text,
            user: assigned,
        };

        try {
            await dispatch(addNewNote(addNote)).unwrap();
            dispatch(fetchNotes());
            navigate("/dash/notes");
        } catch (err) {
            setErrors(err.message);
        }
    };

    return (
        <div className="max-w-md mx-auto bg-white p-6 rounded-lg shadow-md">
            <h2 className="text-2xl font-bold mb-4">Add new note</h2>
            {errors && <p className="text-red-500 mb-4">{errors}</p>}
            <form onSubmit={handleSubmit}>
                <div className="my-9">
                    <label className="block text-gray-700">Title</label>
                    <input
                        type="text"
                        value={title}
                        onChange={(e) => setTitle(e.target.value)}
                        required
                        className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring focus:border-blue-300"
                    />
                </div>
                <div className="my-9">
                    <label className="block text-gray-700">Text</label>
                    <textarea
                        value={text}
                        onChange={(e) => setText(e.target.value)}
                        required
                        className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring focus:border-blue-300"
                    />
                </div>

                <div className="my-9">
                    <label className="block text-gray-700">Assigned to</label>
                    <select
                        value={assigned}
                        onChange={(e) => setAssigned(e.target.value)}
                        required
                        className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring focus:border-blue-300"
                    >
                        <option value="">Select a user</option>
                        {notes.map((note, index) => (
                            <option key={index} value={note?.user?._id}>
                                {note.user?.username || "Unknown user"}
                            </option>
                        ))}
                    </select>
                </div>

                <button
                    type="submit"
                    className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring focus:border-blue-300 my-9"
                >
                    Add new Note
                </button>
            </form>
        </div>
    );
};

export default NoteForm;
