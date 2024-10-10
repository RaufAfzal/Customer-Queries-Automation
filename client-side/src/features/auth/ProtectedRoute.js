// ProtectedRoute.js
import { Outlet, Navigate } from "react-router-dom";
import { useSelector } from "react-redux";

const ProtectedRoute = ({ requiredRoles }) => {
    const { user, status, accessToken } = useSelector(state => state.auth);

    console.log('auth is', user);
    console.log('status is', status);
    console.log('AccessToken is', accessToken);

    if (status === 'loading') {
        return <p className="text-center text-gray-500">Loading...</p>;
    }

    if (!accessToken) {
        return <Navigate to="/login" replace />;
    }

    if (requiredRoles && (!user || !requiredRoles.some(role => user.roles.includes(role)))) {
        return <Navigate to="/unauthorized" replace />;
    }

    return <Outlet />;
}

export default ProtectedRoute;
