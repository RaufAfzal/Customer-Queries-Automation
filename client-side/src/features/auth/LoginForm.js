// LoginForm.js
import { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { login } from './authApi';

const LoginForm = () => {
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const { user, status, error } = useSelector((state) => state.auth);
    console.log('auth is', user);
    console.log('status is', status);
    console.log('error is', error)

    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');

    const handleSubmit = async (e) => {
        e.preventDefault();
        const userObj = { username, password };
        try {
            const resultAction = await dispatch(login(userObj));
            if (login.fulfilled.match(resultAction)) {
                navigate('/dash/users');
            }
        }
        catch (err) {
            // This catch block may not be necessary as errors are handled by createAsyncThunk
            console.error('Login failed:', err);
        }
    }

    return (
        <div className='max-w-md mx-auto mt-10 p-6 bg-white rounded shadow'>
            <h2 className='text-2xl font-bold mb-4 text-center'>Login</h2>
            {status === 'failed' && error && (
                <p className="text-red-500 mb-4">Error: {error}</p>
            )}
            <form onSubmit={handleSubmit}>
                <div className="my-9">
                    <label className="block text-gray-700">Username</label>
                    <input
                        type="text"
                        value={username}
                        onChange={(e) => setUsername(e.target.value)}
                        required
                        className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring focus:border-blue-300"
                    />
                </div>
                <div className="my-9">
                    <label className="block text-gray-700">Password</label>
                    <input
                        type="password" // Changed from 'text' to 'password'
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        required
                        className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring focus:border-blue-300"
                    />
                </div>
                <button
                    type="submit"
                    className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring focus:border-blue-300 my-5"
                    disabled={status === 'loading'}
                >
                    {status === 'loading' ? 'Logging In...' : 'Login'}
                </button>
            </form>
        </div>
    );
}

export default LoginForm;
