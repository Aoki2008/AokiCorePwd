import React, { useState, useEffect } from 'react';
import { Search, RotateCcw, Trash2, Calendar } from 'lucide-react';
import api from '../lib/api';

const RecycleBin = () => {
    const [deletedAccounts, setDeletedAccounts] = useState([]);
    const [searchTerm, setSearchTerm] = useState('');
    const [startDate, setStartDate] = useState('');
    const [endDate, setEndDate] = useState('');
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchTrash();
    }, []);

    const fetchTrash = async () => {
        try {
            const res = await api.get('/trash');
            setDeletedAccounts(res.data);
        } catch (error) {
            console.error('Failed to fetch trash', error);
        } finally {
            setLoading(false);
        }
    };

    const handleRestore = async (id) => {
        try {
            await api.post(`/accounts/${id}/restore`);
            setDeletedAccounts(deletedAccounts.filter(acc => acc.id !== id));
        } catch (error) {
            console.error('Failed to restore account', error);
            alert('恢复失败');
        }
    };

    const handleDeleteForever = async (id) => {
        if (!window.confirm('确定要永久删除吗？此操作不可撤销。')) return;
        try {
            await api.delete(`/trash/${id}`);
            setDeletedAccounts(deletedAccounts.filter(acc => acc.id !== id));
        } catch (error) {
            console.error('Failed to delete account permanently', error);
            alert('删除失败');
        }
    };

    const filteredAccounts = deletedAccounts.filter(account => {
        const matchesSearch = account.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
            Object.values(account.data).some(val =>
                String(val).toLowerCase().includes(searchTerm.toLowerCase())
            );

        const deletedDate = new Date(account.deletedAt);
        const matchesStartDate = startDate ? deletedDate >= new Date(startDate) : true;

        // End date should be inclusive, so we set it to the end of the day
        let matchesEndDate = true;
        if (endDate) {
            const end = new Date(endDate);
            end.setHours(23, 59, 59, 999);
            matchesEndDate = deletedDate <= end;
        }

        return matchesSearch && matchesStartDate && matchesEndDate;
    });

    if (loading) return <div className="p-8 text-center text-gray-500">加载中...</div>;

    return (
        <div className="space-y-6">
            <h2 className="text-2xl font-bold text-gray-800 flex items-center gap-2">
                <Trash2 size={28} />
                回收站
            </h2>

            <div className="flex flex-wrap gap-4 items-center justify-between bg-white p-4 rounded-lg shadow-sm border">
                <div className="relative flex-1 min-w-[200px]">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
                    <input
                        type="text"
                        placeholder="搜索已删除账号..."
                        className="w-full pl-10 pr-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                    />
                </div>

                <div className="flex items-center gap-2 text-sm text-gray-600">
                    <Calendar size={18} />
                    <span>日期筛选:</span>
                    <input
                        type="date"
                        className="border rounded px-2 py-1 focus:outline-none focus:ring-2 focus:ring-blue-500"
                        value={startDate}
                        onChange={(e) => setStartDate(e.target.value)}
                    />
                    <span>-</span>
                    <input
                        type="date"
                        className="border rounded px-2 py-1 focus:outline-none focus:ring-2 focus:ring-blue-500"
                        value={endDate}
                        onChange={(e) => setEndDate(e.target.value)}
                    />
                </div>
            </div>

            <div className="bg-white rounded-lg shadow-sm border overflow-hidden">
                <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-gray-50">
                        <tr>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">账号名称</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">所属项目</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">删除时间</th>
                            <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">操作</th>
                        </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                        {filteredAccounts.map((account) => (
                            <tr key={account.id} className="hover:bg-gray-50">
                                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{account.name}</td>
                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{account.project?.name || '未知项目'}</td>
                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                    {new Date(account.deletedAt).toLocaleString()}
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium space-x-3">
                                    <button
                                        onClick={() => handleRestore(account.id)}
                                        className="text-blue-600 hover:text-blue-900 flex items-center gap-1 inline-flex"
                                    >
                                        <RotateCcw size={16} /> 恢复
                                    </button>
                                    <button
                                        onClick={() => handleDeleteForever(account.id)}
                                        className="text-red-600 hover:text-red-900 flex items-center gap-1 inline-flex"
                                    >
                                        <Trash2 size={16} /> 彻底删除
                                    </button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
                {filteredAccounts.length === 0 && (
                    <div className="text-center py-12 text-gray-500">
                        回收站为空或未找到匹配项
                    </div>
                )}
            </div>
        </div>
    );
};

export default RecycleBin;
