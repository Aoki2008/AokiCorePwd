import React, { useState } from 'react';
import { Plus, Search, Edit2, Trash2, Copy, ExternalLink, Eye, EyeOff } from 'lucide-react';

const AccountList = ({ accounts, onAddAccount, onEditAccount, onDeleteAccount }) => {
    const [searchTerm, setSearchTerm] = useState('');
    const [visiblePasswords, setVisiblePasswords] = useState({});

    const filteredAccounts = accounts.filter(account =>
        account.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        Object.values(account.data).some(val =>
            String(val).toLowerCase().includes(searchTerm.toLowerCase())
        )
    );

    const togglePasswordVisibility = (id) => {
        setVisiblePasswords(prev => ({
            ...prev,
            [id]: !prev[id]
        }));
    };

    const copyToClipboard = (text) => {
        navigator.clipboard.writeText(text);
    };

    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <div className="relative w-96">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
                    <input
                        type="text"
                        placeholder="搜索账号..."
                        className="w-full pl-10 pr-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                    />
                </div>
                <button
                    onClick={onAddAccount}
                    className="flex items-center gap-2 bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 transition-colors"
                >
                    <Plus size={20} />
                    添加账号
                </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {filteredAccounts.map((account) => (
                    <div key={account.id} className="bg-white rounded-lg shadow-sm border p-6 hover:shadow-md transition-shadow">
                        <div className="flex items-start justify-between mb-4">
                            <h3 className="text-lg font-semibold text-gray-800">{account.name}</h3>
                            <div className="flex items-center gap-2">
                                <button
                                    onClick={() => onEditAccount(account)}
                                    className="p-1 text-gray-400 hover:text-blue-600 transition-colors"
                                >
                                    <Edit2 size={16} />
                                </button>
                                <button
                                    onClick={() => onDeleteAccount(account.id)}
                                    className="p-1 text-gray-400 hover:text-red-600 transition-colors"
                                >
                                    <Trash2 size={16} />
                                </button>
                            </div>
                        </div>

                        <div className="space-y-3">
                            {Object.entries(account.data).map(([key, value]) => {
                                const isPassword = key.toLowerCase().includes('password') || key.toLowerCase().includes('secret') || key === '密码';
                                const isUrl = key.toLowerCase().includes('url') || key.toLowerCase().includes('link') || (typeof value === 'string' && value.startsWith('http'));

                                return (
                                    <div key={key} className="flex flex-col text-sm">
                                        <span className="text-gray-500 font-medium text-xs uppercase tracking-wider mb-1">{key}</span>
                                        <div className="flex items-center justify-between bg-gray-50 p-2 rounded border border-gray-100 group">
                                            <div className="truncate flex-1 mr-2">
                                                {isPassword && !visiblePasswords[account.id + key] ? (
                                                    <span className="text-gray-400">••••••••</span>
                                                ) : isUrl ? (
                                                    <a href={value} target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline flex items-center gap-1">
                                                        {value} <ExternalLink size={12} />
                                                    </a>
                                                ) : (
                                                    <span className="text-gray-700">{value}</span>
                                                )}
                                            </div>

                                            <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                                                {isPassword && (
                                                    <button
                                                        onClick={() => togglePasswordVisibility(account.id + key)}
                                                        className="p-1 text-gray-400 hover:text-gray-600"
                                                    >
                                                        {visiblePasswords[account.id + key] ? <EyeOff size={14} /> : <Eye size={14} />}
                                                    </button>
                                                )}
                                                <button
                                                    onClick={() => copyToClipboard(value)}
                                                    className="p-1 text-gray-400 hover:text-gray-600"
                                                    title="Copy"
                                                >
                                                    <Copy size={14} />
                                                </button>
                                            </div>
                                        </div>
                                    </div>
                                );
                            })}
                        </div>

                        <div className="mt-4 pt-4 border-t text-xs text-gray-400 flex justify-between">
                            <span>创建时间: {new Date(account.createdAt).toLocaleDateString()}</span>
                        </div>
                    </div>
                ))}
            </div>

            {filteredAccounts.length === 0 && (
                <div className="text-center py-12 text-gray-500">
                    {searchTerm ? '未找到匹配的账号。' : '该项目下暂无账号。'}
                </div>
            )}
        </div>
    );
};

export default AccountList;
