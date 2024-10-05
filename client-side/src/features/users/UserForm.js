import { addNewUser, fetchUsers } from "./usersApi";
import { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
const UserForm = () => {
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const { users, status } = useSelector(state => state.users);

    const [username, setUsername] = useState('')
    const [password, setPassword] = useState('')
    const [roles, setRoles] = useState(['Employee']) //By default Employee role
    const [userStatus, setUserStatus] = useState('true')
    const [errors, setError] = useState(null);

    useEffect(() => {
        if (status === 'idle') {
            dispatch(fetchUsers())
        }
    }, [status, dispatch])

    const duplicateUser = users.find(user => user.username === username)

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!username || !password || roles.length === 0) {
            setError("Username, Password and roles are required")
            return
        }

        if (duplicateUser) {
            setError("Username already exists")
            return;
        }

        const addUser = {
            username,
            password,
            roles,
            status: userStatus
        }

        try {
            await dispatch(addNewUser(addUser)).unwrap();
            dispatch(fetchUsers())
            navigate('/dash/users')
        } catch (err) {
            setError(err.message)
        }

    }
    return (
        <div className="max-w-md mx-auto bg-white p-6 rounded-lg shadow-md">
            <h2 className="text-2xl font-bold mb-4">Add New User</h2>
            {errors && <p className="text-red-500 mb-4" >{errors}</p>}
            <form onSubmit={handleSubmit}>
                <div className="my-9">
                    <label className="block text-gray-700">Username</label>
                    <input
                        type="text"
                        value={username}
                        onChange={e => { setUsername(e.target.value) }}
                        className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring focus:border-blue-300"
                        required
                    />
                </div>
                <div className="my-9">
                    <label className="block text-gray-700">Password</label>
                    <input
                        type="password"
                        value={password}
                        onChange={e => { setPassword(e.target.value) }}
                        className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring focus:border-blue-300"
                        required
                    />
                </div>
                <div className="my-9">
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
                <div className="my-9">
                    <label className="block text-gray-700"> Status  </label>
                    <select
                        value={userStatus}
                        onChange={e => {
                            setUserStatus(e.target.value)
                        }}
                        className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring focus:border-blue-300"
                        required
                    >
                        <option value="false">Inactive</option>
                        <option value="true">Active</option>
                    </select>

                </div>
                <button type="submit" className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring focus:border-blue-300 my-5">
                    Add User
                </button>

            </form>
        </div>
    )
}

export default UserForm;
