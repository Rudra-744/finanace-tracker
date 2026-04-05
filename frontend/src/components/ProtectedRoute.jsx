import { useContext } from 'react';
import { Navigate } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';

const ProtectedRoute = ({ children, allowedRoles }) => {
    const { isAuthenticated, user, loading } = useContext(AuthContext);

    if (loading) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-gray-50">
                <div className="w-6 h-6 border-2 border-gray-200 border-t-indigo-600 rounded-full animate-spin" />
            </div>
        );
    }

    if (!isAuthenticated) {
        return <Navigate to="/login" replace />;
    }

    if (allowedRoles && !allowedRoles.includes(user?.role)) {
        return (
            <div className="flex items-center justify-center h-[60vh]">
                <div className="text-center">
                    <p className="text-6xl font-bold text-gray-200 mb-3">403</p>
                    <p className="text-gray-500 text-sm">You don't have permission to view this page.</p>
                </div>
            </div>
        );
    }

    return children;
};

export default ProtectedRoute;
