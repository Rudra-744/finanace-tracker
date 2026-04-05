import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import Login from './pages/Login';
import Register from './pages/Register';
import Dashboard from './pages/Dashboard';
import Records from './pages/Records';
import Layout from './components/Layout';
import ProtectedRoute from './components/ProtectedRoute';

function App() {
    return (
        <AuthProvider>
            <BrowserRouter>
                <Routes>
                    {/* Public Routes */}
                    <Route path="/login" element={<Login />} />
                    <Route path="/register" element={<Register />} />

                    {/* Protected Routes (Sidebar Layout) */}
                    <Route element={
                        <ProtectedRoute>
                            <Layout />
                        </ProtectedRoute>
                    }>
                        <Route path="/dashboard" element={
                            <ProtectedRoute allowedRoles={['admin', 'analyst']}>
                                <Dashboard />
                            </ProtectedRoute>
                        } />
                        <Route path="/records" element={
                            <ProtectedRoute allowedRoles={['admin', 'analyst', 'viewer']}>
                                <Records />
                            </ProtectedRoute>
                        } />
                    </Route>

                    <Route path="/" element={<Navigate to="/login" />} />
                </Routes>
            </BrowserRouter>
        </AuthProvider>
    );
}

export default App;