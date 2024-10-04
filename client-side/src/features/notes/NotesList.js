import { useEffect } from "react"
import { useSelector, useDispatch } from "react-redux"
import { fetchNotes, deleteNote } from "./notesApi"
import { Link } from "react-router-dom"
const NotesList = () => {

    const dispatch = useDispatch();
    const { notes, status, error } = useSelector(state => state.notes)

    useEffect(() => {
        if (status === 'idle') {
            dispatch(fetchNotes())
        }

    }, [status, dispatch])

    const handleDelete = (e) => {
        console.log(e.target.value)
    }


    if (status === 'loading') {
        return <p className="text-center text-gray-500">Loading notes...</p>;
    }

    if (status === 'failed') {
        return <p className="text-center text-red-500">Error: {error}</p>;
    }

    return (
        <div className="overflow-x-auto">
            <table className="min-w-full bg-white shadow-md overflow-hidden rounded-lg">
                <thead className="bg-gray-800 text-white">
                    <tr>
                        <th className="w-1/4 py-3 px-4 uppercase font-semibold text-sm">Title</th>
                        <th className="w-1/4 py-3 px-4 uppercase font-semibold text-sm">Text</th>
                        <th className="w-1/4 py-3 px-4 uppercase font-semibold text-sm">Ticket</th>
                        <th className="w-1/4 py-3 px-4 uppercase font-semibold text-sm">Username</th>
                        <th className="w-1/4 py-3 px-4 uppercase font-semibold text-sm">Status</th>
                        <th className="w-1/4 py-3 px-4 uppercase font-semibold text-sm">Actions</th>
                    </tr>
                </thead>
                <tbody className="text-gray-700">
                    {notes.map(note => (
                        <tr key={note._id} className="border-b">
                            <td className="py-3 px-4">{note.title}</td>
                            <td className="py-3 px-4">{note.text}</td>
                            <td className="py-3 px-4">{note.ticket}</td>
                            <td className="py-3 px-4">{note.user.username}</td>
                            <td className="py-3 px-4">
                                <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full 
                                    ${note.status ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
                                    {note.status ? 'Active' : 'Inactive'}
                                </span>
                            </td>
                            <td className="py-3 px-4">
                                <Link to={`/dash/notes/edit${note._id}`} className="text-blue-500 hover:text-blue-700 mr-2">
                                    Edit
                                </Link>
                                <button
                                    onClick={() => handleDelete(note._id)}
                                    className="text-red-500 hover:text-red-700"
                                >
                                    Delete
                                </button>
                            </td>
                        </tr>
                    ))}

                </tbody>

            </table>
        </div>
    )
}

export default NotesList    
