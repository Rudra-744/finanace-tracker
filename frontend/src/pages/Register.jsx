import { useState, useContext } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import api from '../utils/axios';

const Register = () => {
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [role, setRole] = useState('viewer');
    const [error, setError] = useState('');
    const [isLoading, setIsLoading] = useState(false);

    const { login } = useContext(AuthContext);
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        setIsLoading(true);

        try {
            const res = await api.post('/auth/register', { name, email, password, role });
            login(res.data.user, res.data.accessToken);
            navigate('/dashboard');
        } catch (err) {
            setError(err.response?.data?.message || 'Registration failed. Please try again.');
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-white px-4">
            <div className="w-full max-w-sm">
                <div className="mb-8">
                    <div className="w-10 h-10 bg-indigo-100 rounded-xl flex items-center justify-center mb-5">
                        <svg className="w-5 h-5 text-indigo-600" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                            <path strokeLinecap="round" strokeLinejoin="round" d="M18 7.5v3m0 0v3m0-3h3m-3 0h-3m-2.25-4.125a3.375 3.375 0 11-6.75 0 3.375 3.375 0 016.75 0zM4 19.235v-.11a6.375 6.375 0 0112.75 0v.109A12.318 12.318 0 0110.374 21c-2.331 0-4.512-.645-6.374-1.766z" />
                        </svg>
                    </div>
                    <h1 className="text-2xl font-semibold text-gray-900">Create account</h1>
                    <p className="text-gray-500 mt-1 text-sm">Start tracking your finances</p>
                </div>

                {error && (
                    <div className="bg-red-50 border border-red-100 rounded-xl px-4 py-3 mb-6">
                        <p className="text-red-600 text-sm">{error}</p>
                    </div>
                )}

                <form onSubmit={handleSubmit} className="space-y-4">
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1.5">Full Name</label>
                        <input type="text" value={name} onChange={(e) => setName(e.target.value)} placeholder="Rudra Gajjar" required
                            className="w-full px-4 py-2.5 bg-white border border-gray-200 rounded-xl text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all text-sm" />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1.5">Email</label>
                        <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="you@example.com" required
                            className="w-full px-4 py-2.5 bg-white border border-gray-200 rounded-xl text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all text-sm" />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1.5">Password</label>
                        <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} placeholder="••••••••" required
                            className="w-full px-4 py-2.5 bg-white border border-gray-200 rounded-xl text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all text-sm" />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1.5">Role</label>
                        <select value={role} onChange={(e) => setRole(e.target.value)}
                            className="w-full px-4 py-2.5 bg-white border border-gray-200 rounded-xl text-gray-900 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all text-sm appearance-none cursor-pointer">
                            <option value="viewer">Viewer</option>
                            <option value="analyst">Analyst</option>
                            <option value="admin">Admin</option>
                        </select>
                    </div>

                    <button type="submit" disabled={isLoading}
                        className="w-full bg-indigo-600 text-white font-medium py-2.5 rounded-xl hover:bg-indigo-700 transition-colors cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed text-sm">
                        {isLoading ? 'Creating account...' : 'Create account'}
                    </button>
                </form>

                <p className="text-center text-gray-500 mt-8 text-sm">
                    Already have an account?{' '}
                    <Link to="/login" className="text-indigo-600 font-medium hover:text-indigo-700">Sign in</Link>
                </p>
            </div>
        </div>
    );
};

export default Register;
