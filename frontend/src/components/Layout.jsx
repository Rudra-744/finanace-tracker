import { useContext } from 'react';
import { NavLink, Outlet, useNavigate } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';

const Layout = () => {
    const { user, logout } = useContext(AuthContext);
    const navigate = useNavigate();

    const handleLogout = () => {
        logout();
        navigate('/login');
    };

    const navItems = [
        { path: '/dashboard', label: 'Dashboard', icon: (
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 6A2.25 2.25 0 016 3.75h2.25A2.25 2.25 0 0110.5 6v2.25a2.25 2.25 0 01-2.25 2.25H6a2.25 2.25 0 01-2.25-2.25V6zM3.75 15.75A2.25 2.25 0 016 13.5h2.25a2.25 2.25 0 012.25 2.25V18a2.25 2.25 0 01-2.25 2.25H6A2.25 2.25 0 013.75 18v-2.25zM13.5 6a2.25 2.25 0 012.25-2.25H18A2.25 2.25 0 0120.25 6v2.25A2.25 2.25 0 0118 10.5h-2.25a2.25 2.25 0 01-2.25-2.25V6zM13.5 15.75a2.25 2.25 0 012.25-2.25H18a2.25 2.25 0 012.25 2.25V18A2.25 2.25 0 0118 20.25h-2.25A2.25 2.25 0 0113.5 18v-2.25z" />
            </svg>
        ), roles: ['admin', 'analyst'] },
        { path: '/records', label: 'Records', icon: (
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M8.25 6.75h12M8.25 12h12m-12 5.25h12M3.75 6.75h.007v.008H3.75V6.75zm.375 0a.375.375 0 11-.75 0 .375.375 0 01.75 0zM3.75 12h.007v.008H3.75V12zm.375 0a.375.375 0 11-.75 0 .375.375 0 01.75 0zm-.375 5.25h.007v.008H3.75v-.008zm.375 0a.375.375 0 11-.75 0 .375.375 0 01.75 0z" />
            </svg>
        ), roles: ['admin', 'analyst', 'viewer'] },
    ];

    const visibleItems = navItems.filter(item => item.roles.includes(user?.role));

    return (
        <div className="min-h-screen flex bg-gray-50">
            {/* Sidebar */}
            <aside className="w-60 bg-white border-r border-gray-100 flex flex-col fixed h-full">
                <div className="p-6 pb-4">
                    <div className="flex items-center gap-3">
                        <div className="w-9 h-9 bg-indigo-100 rounded-xl flex items-center justify-center">
                            <svg className="w-5 h-5 text-indigo-600" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                                <path strokeLinecap="round" strokeLinejoin="round" d="M12 6v12m-3-2.818l.879.659c1.171.879 3.07.879 4.242 0 1.172-.879 1.172-2.303 0-3.182C13.536 12.219 12.768 12 12 12c-.725 0-1.45-.22-2.003-.659-1.106-.879-1.106-2.303 0-3.182s2.9-.879 4.006 0l.415.33M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                            </svg>
                        </div>
                        <span className="text-sm font-semibold text-gray-900">Finance Tracker</span>
                    </div>
                </div>

                <nav className="flex-1 px-3 space-y-0.5">
                    {visibleItems.map(item => (
                        <NavLink
                            key={item.path}
                            to={item.path}
                            className={({ isActive }) =>
                                `flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all ${
                                    isActive
                                        ? 'bg-indigo-50 text-indigo-700'
                                        : 'text-gray-500 hover:text-gray-700 hover:bg-gray-50'
                                }`
                            }
                        >
                            {item.icon}
                            {item.label}
                        </NavLink>
                    ))}
                </nav>

                <div className="p-4 border-t border-gray-100">
                    <div className="flex items-center gap-3 px-2 mb-3">
                        <div className="w-8 h-8 rounded-full bg-indigo-100 flex items-center justify-center text-sm font-semibold text-indigo-700">
                            {user?.name?.charAt(0)?.toUpperCase()}
                        </div>
                        <div className="min-w-0">
                            <p className="text-sm font-medium text-gray-900 truncate">{user?.name}</p>
                            <p className="text-xs text-gray-400 capitalize">{user?.role}</p>
                        </div>
                    </div>
                    <button
                        onClick={handleLogout}
                        className="flex items-center gap-2 w-full px-3 py-2 rounded-xl text-sm text-gray-500 hover:text-red-600 hover:bg-red-50 transition-all cursor-pointer"
                    >
                        <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                            <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 9V5.25A2.25 2.25 0 0013.5 3h-6a2.25 2.25 0 00-2.25 2.25v13.5A2.25 2.25 0 007.5 21h6a2.25 2.25 0 002.25-2.25V15m3 0l3-3m0 0l-3-3m3 3H9" />
                        </svg>
                        Sign out
                    </button>
                </div>
            </aside>

            {/* Main Content */}
            <main className="flex-1 ml-60 p-8">
                <Outlet />
            </main>
        </div>
    );
};

export default Layout;
