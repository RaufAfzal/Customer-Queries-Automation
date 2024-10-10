import { useEffect, useState } from "react"
import { useSelector, useDispatch } from 'react-redux';
import { updateUser, fetchUsers } from "./usersApi"
import { useParams, useNavigate } from "react-router-dom"

const EditUser = () => {

    const { id } = useParams();
    const navigate = useNavigate();
    const dispatch = useDispatch();
    const { users, status, error } = useSelector(state => state.users);

    const userToEdit = users.find(user => user._id === id)

    const [username, setUsername] = useState(userToEdit?.username || '')
    const [roles, setRoles] = useState(userToEdit?.roles || ['Employee']);
    const [userStatus, setUserStatus] = useState(userToEdit?.status || false);
    const [formError, setFormError] = useState('')

    const duplicateUser = users.find(user => user.username === username && user._id !== id)

    useEffect(() => {
        if (status === 'idle') {
            dispatch(fetchUsers())
        }
    }, [status, dispatch])

    useEffect(() => {
        if (userToEdit) {
            setUsername(userToEdit.username)
            setRoles(userToEdit.roles)
            setUserStatus(userToEdit.status)
        }
    }, [userToEdit])

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!username || roles.length === 0) {
            setFormError('Username and one roles is Required')
            return;
        }

        if (duplicateUser) {
            setFormError("Username already exists")
            return;
        }


        const updatedUser = {
            _id: id,
            username,
            roles,
            status: userStatus,
        }

        try {
            await dispatch(updateUser(updatedUser)).unwrap();
            dispatch(fetchUsers())
            navigate('/dash/users'); // Navigate only after the update is successful
        } catch (err) {
            setFormError(err.message); // Set error if update fails
        }
    };

    if (status === "loading") {
        return <p className="text-center text-gray-500">Loading users...</p>;
    }

    if (status === "failed") {
        return <p className="text-center text-red-500">Error: {error} </p>
    }

    return (
        <div className="max-w-md mx-auto bg-white p-6 rounded-lg shadow-md">
            <h2 className="text-2xl font-bold mb-4">Edit User</h2>
            {formError && <p className="text-red-500 mb-4">{formError}</p>}
            <form onSubmit={handleSubmit}>
                <div className="mb-4 my-9">
                    <label className="block text-gray-700">Username</label>
                    <input
                        type="text"
                        value={username}
                        onChange={e => { setUsername(e.target.value) }}
                        className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring focus:border-blue-300"
                        required
                    />
                </div>
                <div className="mb-4 my-9">
                    <label className="block text-gray-700">Roles </label>
                    <select
                        multiple
                        value={roles}
                        onChange={e => {
                            const selectedOptions = Array.from(e.target.selectedOptions, (option) => option.value);
                            setRoles(selectedOptions)
                        }}
                        className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring focus:border-blue-300"
                        required
                    >
                        <option value="Employee">Employee</option>
                        <option value="Admin">Admin</option>
                        <option value="User">User</option>
                    </select>

                </div>
                <div className="mb-4 my-9">
                    <label className="block text-gray-700"> Status  </label>
                    <select
                        value={userStatus.toString()}
                        onChange={e => {
                            setUserStatus(e.target.value === 'true')
                        }}
                        className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring focus:border-blue-300"
                        required
                    >
                        <option value="false">Inactive</option>
                        <option value="true">Active</option>
                    </select>

                </div>
                <button type="submit" className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring focus:border-blue-300 my-9">
                    Update User
                </button>
            </form>
        </div>
    )
}

export default EditUser;