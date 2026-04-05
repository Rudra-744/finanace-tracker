import { useState, useEffect, useContext, useCallback } from 'react';
import api from '../utils/axios';
import { AuthContext } from '../context/AuthContext';

const Records = () => {
    const { user } = useContext(AuthContext);
    const [records, setRecords] = useState([]);
    const [loading, setLoading] = useState(true);
    const [showForm, setShowForm] = useState(false);
    const [filterType, setFilterType] = useState('');
    const [page, setPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);

    const [form, setForm] = useState({
        amount: '',
        type: 'income',
        category: '',
        notes: '',
    });

    const fetchRecords = useCallback(async () => {
        try {
            const params = new URLSearchParams();
            if (filterType) params.append('type', filterType);
            params.append('page', page);
            params.append('limit', 10);

            const res = await api.get(`/records?${params.toString()}`);
            setRecords(res.data.records);
            setTotalPages(res.data.totalPages || 1);
        } catch (err) {
            console.error('Fetch records error:', err);
        } finally {
            setLoading(false);
        }
    }, [filterType, page]);

    useEffect(() => {
        fetchRecords();
    }, [fetchRecords]);

    const handleCreate = async (e) => {
        e.preventDefault();
        try {
            await api.post('/records', { ...form, amount: Number(form.amount) });
            setForm({ amount: '', type: 'income', category: '', notes: '' });
            setShowForm(false);
            setPage(1);
            fetchRecords();
        } catch (err) {
            console.error('Create record error:', err);
        }
    };

    const handleDelete = async (id) => {
        try {
            await api.delete(`/records/${id}`);
            fetchRecords();
        } catch (err) {
            console.error('Delete record error:', err);
        }
    };

    if (loading) {
        return (
            <div className="flex items-center justify-center h-[60vh]">
                <div className="w-6 h-6 border-2 border-gray-200 border-t-indigo-600 rounded-full animate-spin" />
            </div>
        );
    }

    return (
        <div>
            <div className="flex items-center justify-between mb-8">
                <div>
                    <h1 className="text-2xl font-semibold text-gray-900">Records</h1>
                    <p className="text-gray-500 text-sm mt-1">Financial entries</p>
                </div>
                <div className="flex items-center gap-3">
                    <select value={filterType} onChange={(e) => { setFilterType(e.target.value); setPage(1); }}
                        className="px-4 py-2 bg-white border border-gray-200 rounded-xl text-gray-700 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 cursor-pointer appearance-none">
                        <option value="">All</option>
                        <option value="income">Income</option>
                        <option value="expense">Expense</option>
                    </select>
                    {user?.role === 'admin' && (
                        <button onClick={() => setShowForm(!showForm)}
                            className="px-4 py-2 bg-indigo-600 text-white rounded-xl text-sm font-medium hover:bg-indigo-700 transition-colors cursor-pointer">
                            {showForm ? 'Cancel' : '+ Add Record'}
                        </button>
                    )}
                </div>
            </div>

            {/* Create Form */}
            {showForm && user?.role === 'admin' && (
                <form onSubmit={handleCreate} className="bg-white rounded-2xl p-6 mb-6 border border-gray-100 shadow-sm grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1.5">Amount</label>
                        <input type="number" value={form.amount} onChange={(e) => setForm({ ...form, amount: e.target.value })} placeholder="5000" required
                            className="w-full px-4 py-2.5 bg-white border border-gray-200 rounded-xl text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent text-sm" />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1.5">Type</label>
                        <select value={form.type} onChange={(e) => setForm({ ...form, type: e.target.value })}
                            className="w-full px-4 py-2.5 bg-white border border-gray-200 rounded-xl text-gray-900 focus:outline-none focus:ring-2 focus:ring-indigo-500 text-sm appearance-none cursor-pointer">
                            <option value="income">Income</option>
                            <option value="expense">Expense</option>
                        </select>
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1.5">Category</label>
                        <input type="text" value={form.category} onChange={(e) => setForm({ ...form, category: e.target.value })} placeholder="Salary, Rent, Food..." required
                            className="w-full px-4 py-2.5 bg-white border border-gray-200 rounded-xl text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent text-sm" />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1.5">Notes</label>
                        <input type="text" value={form.notes} onChange={(e) => setForm({ ...form, notes: e.target.value })} placeholder="Optional notes"
                            className="w-full px-4 py-2.5 bg-white border border-gray-200 rounded-xl text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent text-sm" />
                    </div>
                    <div className="md:col-span-2">
                        <button type="submit"
                            className="px-6 py-2.5 bg-indigo-600 text-white rounded-xl text-sm font-medium hover:bg-indigo-700 transition-colors cursor-pointer">
                            Save Record
                        </button>
                    </div>
                </form>
            )}

            {/* Table */}
            <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
                {records.length === 0 ? (
                    <p className="text-gray-400 text-sm text-center py-16">No records found.</p>
                ) : (
                    <table className="w-full text-sm">
                        <thead>
                            <tr className="border-b border-gray-100 bg-gray-50/50">
                                <th className="text-left px-6 py-3.5 text-xs font-semibold text-gray-500 uppercase tracking-wider">Date</th>
                                <th className="text-left px-6 py-3.5 text-xs font-semibold text-gray-500 uppercase tracking-wider">Category</th>
                                <th className="text-left px-6 py-3.5 text-xs font-semibold text-gray-500 uppercase tracking-wider">Type</th>
                                <th className="text-right px-6 py-3.5 text-xs font-semibold text-gray-500 uppercase tracking-wider">Amount</th>
                                {user?.role === 'admin' && (
                                    <th className="text-right px-6 py-3.5 text-xs font-semibold text-gray-500 uppercase tracking-wider">Action</th>
                                )}
                            </tr>
                        </thead>
                        <tbody>
                            {records.map((record) => (
                                <tr key={record._id} className="border-b border-gray-50 hover:bg-gray-50/50 transition-colors">
                                    <td className="px-6 py-4 text-gray-500">
                                        {new Date(record.date).toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' })}
                                    </td>
                                    <td className="px-6 py-4 text-gray-900 font-medium">{record.category}</td>
                                    <td className="px-6 py-4">
                                        <span className={`text-xs font-medium px-2.5 py-1 rounded-full ${record.type === 'income' ? 'bg-emerald-50 text-emerald-600' : 'bg-red-50 text-red-500'}`}>
                                            {record.type}
                                        </span>
                                    </td>
                                    <td className={`px-6 py-4 text-right font-semibold ${record.type === 'income' ? 'text-emerald-600' : 'text-red-500'}`}>
                                        {record.type === 'income' ? '+' : '-'}₹{record.amount.toLocaleString('en-IN')}
                                    </td>
                                    {user?.role === 'admin' && (
                                        <td className="px-6 py-4 text-right">
                                            <button onClick={() => handleDelete(record._id)}
                                                className="text-gray-400 hover:text-red-500 text-xs font-medium transition-colors cursor-pointer">
                                                Delete
                                            </button>
                                        </td>
                                    )}
                                </tr>
                            ))}
                        </tbody>
                    </table>
                )}
            </div>

            {/* Pagination */}
            {totalPages > 1 && (
                <div className="flex items-center justify-center gap-2 mt-6">
                    <button onClick={() => setPage((p) => Math.max(1, p - 1))} disabled={page === 1}
                        className="px-4 py-2 bg-white border border-gray-200 rounded-xl text-sm text-gray-600 hover:bg-gray-50 disabled:opacity-40 disabled:cursor-not-allowed cursor-pointer transition-colors">
                        Previous
                    </button>
                    <span className="text-sm text-gray-500 px-3">
                        Page {page} of {totalPages}
                    </span>
                    <button onClick={() => setPage((p) => Math.min(totalPages, p + 1))} disabled={page === totalPages}
                        className="px-4 py-2 bg-white border border-gray-200 rounded-xl text-sm text-gray-600 hover:bg-gray-50 disabled:opacity-40 disabled:cursor-not-allowed cursor-pointer transition-colors">
                        Next
                    </button>
                </div>
            )}
        </div>
    );
};

export default Records;
