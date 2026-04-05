import { useState, useEffect } from 'react';
import api from '../utils/axios';
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip, BarChart, Bar, XAxis, YAxis, CartesianGrid } from 'recharts';

const MONTHS = ['', 'Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];

const Dashboard = () => {
    const [stats, setStats] = useState(null);
    const [categories, setCategories] = useState([]);
    const [recent, setRecent] = useState([]);
    const [trends, setTrends] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchAll = async () => {
            try {
                const [statsRes, catRes, recentRes, trendsRes] = await Promise.all([
                    api.get('/dashboard/summary'),
                    api.get('/dashboard/categories'),
                    api.get('/dashboard/recent'),
                    api.get('/dashboard/trends'),
                ]);
                setStats(statsRes.data.stats);
                setCategories(catRes.data.categories);
                setRecent(recentRes.data.records);
                setTrends(trendsRes.data.trends);
            } catch (err) {
                console.error('Dashboard fetch error:', err);
            } finally {
                setLoading(false);
            }
        };
        fetchAll();
    }, []);

    if (loading) {
        return (
            <div className="flex items-center justify-center h-[60vh]">
                <div className="w-6 h-6 border-2 border-gray-200 border-t-indigo-600 rounded-full animate-spin" />
            </div>
        );
    }

    const income = stats?.totalIncome || 0;
    const expense = stats?.totalExpense || 0;
    const balance = stats?.netBalance || 0;

    const pieData = [
        { name: 'Income', value: income },
        { name: 'Expense', value: expense },
    ];
    const PIE_COLORS = ['#6366f1', '#f43f5e'];

    const trendData = [];
    trends.forEach((t) => {
        const key = `${MONTHS[t.month]} ${t.year}`;
        let existing = trendData.find((d) => d.month === key);
        if (!existing) {
            existing = { month: key, income: 0, expense: 0 };
            trendData.push(existing);
        }
        existing[t.type] = t.totalAmount;
    });

    const statCards = [
        { label: 'Total Income', value: income, accent: 'bg-emerald-50 text-emerald-600', icon: '↑' },
        { label: 'Total Expense', value: expense, accent: 'bg-red-50 text-red-500', icon: '↓' },
        { label: 'Net Balance', value: balance, accent: balance >= 0 ? 'bg-indigo-50 text-indigo-600' : 'bg-red-50 text-red-500', icon: '₹' },
    ];

    return (
        <div>
            <div className="mb-8">
                <h1 className="text-2xl font-semibold text-gray-900">Dashboard</h1>
                <p className="text-gray-500 text-sm mt-1">Financial overview and analytics</p>
            </div>

            {/* Stat Cards */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-5 mb-8">
                {statCards.map((card) => (
                    <div key={card.label} className="bg-white rounded-2xl p-6 border border-gray-100 shadow-sm">
                        <div className="flex items-center justify-between mb-4">
                            <p className="text-sm font-medium text-gray-500">{card.label}</p>
                            <span className={`w-8 h-8 rounded-lg flex items-center justify-center text-sm font-bold ${card.accent}`}>
                                {card.icon}
                            </span>
                        </div>
                        <p className="text-2xl font-semibold text-gray-900">₹{card.value.toLocaleString('en-IN')}</p>
                    </div>
                ))}
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-5 mb-8">
                {/* Pie Chart */}
                <div className="bg-white rounded-2xl p-6 border border-gray-100 shadow-sm">
                    <h2 className="text-sm font-semibold text-gray-900 mb-6">Income vs Expense</h2>
                    {income === 0 && expense === 0 ? (
                        <p className="text-gray-400 text-sm text-center py-12">No records yet.</p>
                    ) : (
                        <div className="h-56">
                            <ResponsiveContainer width="100%" height="100%">
                                <PieChart>
                                    <Pie data={pieData} cx="50%" cy="50%" innerRadius={55} outerRadius={85} paddingAngle={4} dataKey="value" stroke="none">
                                        {pieData.map((entry, i) => (
                                            <Cell key={entry.name} fill={PIE_COLORS[i]} />
                                        ))}
                                    </Pie>
                                    <Tooltip contentStyle={{ background: '#fff', border: '1px solid #e5e7eb', borderRadius: '12px', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.05)', fontSize: '13px' }}
                                        formatter={(value) => [`₹${value.toLocaleString('en-IN')}`, '']} />
                                </PieChart>
                            </ResponsiveContainer>
                        </div>
                    )}
                </div>

                {/* Monthly Trends Bar Chart */}
                <div className="bg-white rounded-2xl p-6 border border-gray-100 shadow-sm">
                    <h2 className="text-sm font-semibold text-gray-900 mb-6">Monthly Trends</h2>
                    {trendData.length === 0 ? (
                        <p className="text-gray-400 text-sm text-center py-12">No trend data yet.</p>
                    ) : (
                        <div className="h-56">
                            <ResponsiveContainer width="100%" height="100%">
                                <BarChart data={trendData}>
                                    <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
                                    <XAxis dataKey="month" tick={{ fontSize: 12, fill: '#94a3b8' }} />
                                    <YAxis tick={{ fontSize: 12, fill: '#94a3b8' }} />
                                    <Tooltip contentStyle={{ background: '#fff', border: '1px solid #e5e7eb', borderRadius: '12px', fontSize: '13px' }}
                                        formatter={(value) => [`₹${value.toLocaleString('en-IN')}`, '']} />
                                    <Bar dataKey="income" fill="#6366f1" radius={[4, 4, 0, 0]} />
                                    <Bar dataKey="expense" fill="#f43f5e" radius={[4, 4, 0, 0]} />
                                </BarChart>
                            </ResponsiveContainer>
                        </div>
                    )}
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
                {/* Category Breakdown */}
                <div className="bg-white rounded-2xl p-6 border border-gray-100 shadow-sm">
                    <h2 className="text-sm font-semibold text-gray-900 mb-4">Category Breakdown</h2>
                    {categories.length === 0 ? (
                        <p className="text-gray-400 text-sm text-center py-8">No categories yet.</p>
                    ) : (
                        <div className="space-y-3 max-h-64 overflow-y-auto">
                            {categories.map((cat, i) => (
                                <div key={i} className="flex items-center justify-between py-2 border-b border-gray-50 last:border-0">
                                    <div className="flex items-center gap-3">
                                        <span className={`text-xs font-medium px-2 py-0.5 rounded-full ${cat.type === 'income' ? 'bg-emerald-50 text-emerald-600' : 'bg-red-50 text-red-500'}`}>
                                            {cat.type}
                                        </span>
                                        <span className="text-sm text-gray-700">{cat.category}</span>
                                    </div>
                                    <span className="text-sm font-semibold text-gray-900">₹{cat.totalAmount.toLocaleString('en-IN')}</span>
                                </div>
                            ))}
                        </div>
                    )}
                </div>

                {/* Recent Activity */}
                <div className="bg-white rounded-2xl p-6 border border-gray-100 shadow-sm">
                    <h2 className="text-sm font-semibold text-gray-900 mb-4">Recent Activity</h2>
                    {recent.length === 0 ? (
                        <p className="text-gray-400 text-sm text-center py-8">No recent activity.</p>
                    ) : (
                        <div className="space-y-3 max-h-64 overflow-y-auto">
                            {recent.map((rec) => (
                                <div key={rec._id} className="flex items-center justify-between py-2 border-b border-gray-50 last:border-0">
                                    <div>
                                        <p className="text-sm font-medium text-gray-800">{rec.category}</p>
                                        <p className="text-xs text-gray-400">{new Date(rec.date).toLocaleDateString('en-IN', { day: '2-digit', month: 'short' })}</p>
                                    </div>
                                    <span className={`text-sm font-semibold ${rec.type === 'income' ? 'text-emerald-600' : 'text-red-500'}`}>
                                        {rec.type === 'income' ? '+' : '-'}₹{rec.amount.toLocaleString('en-IN')}
                                    </span>
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default Dashboard;
