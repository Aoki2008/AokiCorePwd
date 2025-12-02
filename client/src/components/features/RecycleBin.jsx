import React, { useState, useEffect } from 'react';
import { Search, RotateCcw, Trash2, Calendar, Eye, X } from 'lucide-react';
import dataService from '../../api';

const RecycleBin = () => {
    const [deletedAccounts, setDeletedAccounts] = useState([]);
    const [searchTerm, setSearchTerm] = useState('');
    const [startDate, setStartDate] = useState('');
    const [endDate, setEndDate] = useState('');
    const [loading, setLoading] = useState(true);
    const [selectedAccount, setSelectedAccount] = useState(null);

    const fetchTrash = async () => {
        setLoading(true);
        try {
            const response = await dataService.getTrash();
            setDeletedAccounts(response.data);
        } catch (error) {
            console.error('Failed to fetch deleted accounts', error);
            alert('获取回收站数据失败');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchTrash();
    }, []);

    const handleRestore = async (id) => {
        if (!window.confirm('确定要恢复此账号吗？')) return;
        try {
            await dataService.restoreAccount(id);
            setDeletedAccounts(deletedAccounts.filter(acc => acc.id !== id));
            alert('账号恢复成功');
        } catch (error) {
            console.error('Failed to restore account', error);
            alert('恢复失败');
        }
    };

    const handleDeleteForever = async (id) => {
        if (!window.confirm('确定要彻底删除此账号吗？此操作不可逆！')) return;
        try {
            await dataService.deleteTrash(id);
            setDeletedAccounts(deletedAccounts.filter(acc => acc.id !== id));
            alert('账号已彻底删除');
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

    if (loading) return <div className="p-8 text-center text-gray-500 dark:text-gray-400">加载中...</div>;

    return (
        <div className="space-y-6">
            <h2 className="text-2xl font-bold text-gray-800 dark:text-white flex items-center gap-2">
                <Trash2 size={28} />
                回收站
            </h2>

            <div className="flex flex-wrap gap-4 items-center justify-between bg-white dark:bg-gray-800 p-4 rounded-lg shadow-sm border dark:border-gray-700 transition-colors">
                <div className="relative flex-1 min-w-[200px]">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
                    <input
                        type="text"
                        placeholder="搜索已删除账号..."
                        className="w-full pl-10 pr-4 py-2 border dark:border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-white placeholder-gray-400 dark:placeholder-gray-500"
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                    />
                </div>

                <div className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400">
                    <Calendar size={18} />
                    <span>日期筛选:</span>
                    <input
                        type="date"
                        className="border dark:border-gray-600 rounded px-2 py-1 focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                        value={startDate}
                        onChange={(e) => setStartDate(e.target.value)}
                    />
                    <span>-</span>
                    <input
                        type="date"
                        className="border dark:border-gray-600 rounded px-2 py-1 focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                        value={endDate}
                        onChange={(e) => setEndDate(e.target.value)}
                    />
                </div>
            </div>

            <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border dark:border-gray-700 overflow-hidden">
                <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
                    <thead className="bg-gray-50 dark:bg-gray-700/50">
                        <tr>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">账号名称</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">所属项目</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">删除时间</th>
                            <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">操作</th>
                        </tr>
                    </thead>
                    <tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
                        {filteredAccounts.map((account) => (
                            <tr key={account.id} className="hover:bg-gray-50 dark:hover:bg-gray-700/50">
                                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900 dark:text-white">{account.name}</td>
                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">{account.project?.name || '未知项目'}</td>
                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">
                                    {new Date(account.deletedAt).toLocaleString()}
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium space-x-3">
                                    <button
                                        onClick={() => setSelectedAccount(account)}
                                        className="text-gray-600 dark:text-gray-400 hover:text-blue-600 dark:hover:text-blue-400 flex items-center gap-1 inline-flex"
                                    >
                                        <Eye size={16} /> 详情
                                    </button>
                                    <button
                                        onClick={() => handleRestore(account.id)}
                                        className="text-blue-600 dark:text-blue-400 hover:text-blue-900 dark:hover:text-blue-300 flex items-center gap-1 inline-flex"
                                    >
                                        <RotateCcw size={16} /> 恢复
                                    </button>
                                    <button
                                        onClick={() => handleDeleteForever(account.id)}
                                        className="text-red-600 dark:text-red-400 hover:text-red-900 dark:hover:text-red-300 flex items-center gap-1 inline-flex"
                                    >
                                        <Trash2 size={16} /> 彻底删除
                                    </button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
                {filteredAccounts.length === 0 && (
                    <div className="text-center py-12 text-gray-500 dark:text-gray-400">
                        回收站为空或未找到匹配项
                    </div>
                )}
            </div>

            {selectedAccount && (
                <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
                    <div className="bg-white dark:bg-gray-800 rounded-lg shadow-xl w-full max-w-md overflow-hidden border dark:border-gray-700">
                        <div className="p-4 border-b dark:border-gray-700 flex justify-between items-center bg-gray-50 dark:bg-gray-700/50">
                            <h2 className="text-lg font-semibold text-gray-800 dark:text-white">
                                账号详情 (已删除)
                            </h2>
                            <button onClick={() => setSelectedAccount(null)} className="text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-200">
                                <X size={20} />
                            </button>
                        </div>
                        <div className="p-4 space-y-4">
                            <div>
                                <label className="block text-sm font-medium text-gray-500 dark:text-gray-400 mb-1">账号名称</label>
                                <div className="text-gray-900 dark:text-white font-medium">{selectedAccount.name}</div>
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-500 dark:text-gray-400 mb-1">所属项目</label>
                                <div className="text-gray-900 dark:text-white">{selectedAccount.project?.name || '未知项目'}</div>
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-500 dark:text-gray-400 mb-1">删除时间</label>
                                <div className="text-gray-900 dark:text-white">{new Date(selectedAccount.deletedAt).toLocaleString()}</div>
                            </div>
                            <div className="space-y-2">
                                <label className="block text-sm font-medium text-gray-500 dark:text-gray-400">自定义字段</label>
                                {Object.entries(selectedAccount.data).map(([key, value]) => (
                                    <div key={key} className="flex flex-col bg-gray-50 dark:bg-gray-700/50 p-2 rounded border dark:border-gray-700">
                                        <span className="text-xs text-gray-500 dark:text-gray-400 uppercase">{key}</span>
                                        <span className="text-sm text-gray-900 dark:text-white break-all">{value}</span>
                                    </div>
                                ))}
                            </div>
                        </div>
                        <div className="p-4 border-t dark:border-gray-700 flex justify-end">
                            <button
                                onClick={() => setSelectedAccount(null)}
                                className="px-4 py-2 text-sm font-medium text-gray-700 dark:text-gray-300 bg-white dark:bg-gray-700 border dark:border-gray-600 rounded-md hover:bg-gray-50 dark:hover:bg-gray-600"
                            >
                                关闭
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default RecycleBin;
