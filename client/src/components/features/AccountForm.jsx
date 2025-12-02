import React, { useState, useEffect } from 'react';
import { X, Plus, Trash2 } from 'lucide-react';


const AccountForm = ({ isOpen, onClose, onSubmit, initialData = null }) => {
    const [name, setName] = useState('');
    const [fields, setFields] = useState([{ key: '', value: '' }]);

    useEffect(() => {
        if (initialData) {
            setName(initialData.name);
            const dataFields = Object.entries(initialData.data).map(([key, value]) => ({ key, value }));
            setFields(dataFields.length > 0 ? dataFields : [{ key: '', value: '' }]);
        } else {
            setName('');
            setFields([{ key: '用户名', value: '' }, { key: '密码', value: '' }]);
        }
    }, [initialData, isOpen]);

    const handleFieldChange = (index, type, val) => {
        const newFields = [...fields];
        newFields[index][type] = val;
        setFields(newFields);
    };

    const addField = () => {
        setFields([...fields, { key: '', value: '' }]);
    };

    const removeField = (index) => {
        const newFields = fields.filter((_, i) => i !== index);
        setFields(newFields);
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        const data = fields.reduce((acc, field) => {
            if (field.key.trim()) {
                acc[field.key.trim()] = field.value;
            }
            return acc;
        }, {});

        onSubmit({ name, data });
    };

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 bg-black/50 flex justify-center items-center z-50 p-4">
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow-xl w-full max-w-md overflow-hidden border dark:border-gray-700">
                <div className="p-4 border-b dark:border-gray-700 flex justify-between items-center bg-gray-50 dark:bg-gray-700/50">
                    <h2 className="text-lg font-semibold text-gray-800 dark:text-white">
                        {initialData ? '编辑账户' : '添加账户'}
                    </h2>
                    <button onClick={onClose} className="text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-200">
                        <X size={20} />
                    </button>
                </div>
                <form onSubmit={handleSubmit} className="p-4 space-y-4">
                    <div>
                        <label htmlFor="accountName" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                            账户名称
                        </label>
                        <input
                            type="text"
                            id="accountName"
                            className="w-full px-3 py-2 border dark:border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-white placeholder-gray-400 dark:placeholder-gray-500"
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                            required
                            placeholder="例如：Google 账号"
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                            自定义字段
                        </label>
                        <div className="space-y-2 max-h-60 overflow-y-auto pr-1">
                            {fields.map((field, index) => (
                                <div key={index} className="flex gap-2">
                                    <input
                                        type="text"
                                        placeholder="字段名"
                                        className="flex-1 px-3 py-2 border dark:border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-white placeholder-gray-400 dark:placeholder-gray-500 text-sm"
                                        value={field.key}
                                        onChange={(e) => handleFieldChange(index, 'key', e.target.value)}
                                    />
                                    <input
                                        type="text"
                                        placeholder="字段值"
                                        className="flex-1 px-3 py-2 border dark:border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-white placeholder-gray-400 dark:placeholder-gray-500 text-sm"
                                        value={field.value}
                                        onChange={(e) => handleFieldChange(index, 'value', e.target.value)}
                                    />
                                    <button
                                        type="button"
                                        onClick={() => removeField(index)}
                                        className="p-2 text-red-500 hover:text-red-700 dark:text-red-400 dark:hover:text-red-300 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-md transition-colors"
                                    >
                                        <Trash2 size={18} />
                                    </button>
                                </div>
                            ))}
                        </div>
                        <button
                            type="button"
                            onClick={addField}
                            className="mt-3 flex items-center text-sm text-blue-600 dark:text-blue-400 hover:text-blue-800 dark:hover:text-blue-300 font-medium"
                        >
                            <Plus size={16} className="mr-1" /> 添加字段
                        </button>
                    </div>

                    <div className="pt-4 border-t dark:border-gray-700 flex justify-end gap-3">
                        <button
                            type="button"
                            onClick={onClose}
                            className="px-4 py-2 text-sm font-medium text-gray-700 dark:text-gray-300 bg-white dark:bg-gray-700 border dark:border-gray-600 rounded-md hover:bg-gray-50 dark:hover:bg-gray-600 focus:outline-none focus:ring-2 focus:ring-gray-500"
                        >
                            取消
                        </button>
                        <button
                            type="submit"
                            className="px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 shadow-sm"
                        >
                            保存
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default AccountForm;
