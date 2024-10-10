import { useSelector, useDispatch } from 'react-redux';
import { fetchUsers, deleteUser } from './usersApi';
import { Link } from 'react-router-dom';
import { useEffect } from 'react';
const UsersList = () => {
    const dispatch = useDispatch();
    const { users, status, error } = useSelector(state => state.users);

    useEffect(() => {
        if (status === 'idle') {
            dispatch(fetchUsers())
        }
    }, [status, dispatch])

    const handleDelete = (_id) => {
        if (window.confirm('Are you sure you want to delete this user?')) {
            dispatch(deleteUser(_id));
        }
    };

    if (status === 'loading') {
        return <p className="text-center text-gray-500">Loading users...</p>;
    }

    if (status === 'failed') {
        return <p className="text-center text-red-500">Error: {error}</p>;
    }

    return (
        <div className="overflow-x-auto">
            <table className="min-w-full bg-white shadow-md rounded-lg overflow-hidden">
                <thead className="bg-gray-800 text-white">
                    <tr>
                        <th className="w-1/4 py-3 px-4 uppercase font-semibold text-sm">Username</th>
                        <th className="w-1/4 py-3 px-4 uppercase font-semibold text-sm">Roles</th>
                        <th className="w-1/4 py-3 px-4 uppercase font-semibold text-sm">Status</th>
                        <th className="w-1/4 py-3 px-4 uppercase font-semibold text-sm">Actions</th>
                    </tr>
                </thead>
                <tbody className="text-gray-700">
                    {users.map(user => (
                        <tr key={user._id} className="border-b">
                            <td className="py-3 px-4">{user.username}</td>
                            <td className="py-3 px-4">{user.roles.join(',')}</td>
                            <td className="py-3 px-4">
                                <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full 
                                    ${user.status ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
                                    {user.status ? 'Active' : 'Inactive'}
                                </span>
                            </td>
                            <td className="py-3 px-4 space-x-7">
                                <Link to={`/dash/users/edit/${user._id}`} className="text-blue-500 hover:text-blue-700 mr-2">
                                    Edit
                                </Link>
                                <button
                                    onClick={() => handleDelete(user._id)}
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
    );
};

export default UsersList;