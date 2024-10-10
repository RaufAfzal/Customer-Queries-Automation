import React from 'react';
import { Link } from 'react-router-dom';

const Unauthorized = () => {
    return (
        <div className="flex flex-col items-center justify-center h-screen bg-gray-100">
            <h1 className="text-4xl font-bold text-red-500 mb-4">403 - Unauthorized</h1>
            <p className="mb-6">You do not have permission to access this page.</p>
            <Link to="/dash" className="text-blue-500 hover:underline">
                Go to Dashboard
            </Link>
        </div>
    );
};

export default Unauthorized;
