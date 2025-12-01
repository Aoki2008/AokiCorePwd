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
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-lg shadow-xl w-full max-w-md max-h-[90vh] overflow-y-auto">
                <div className="flex items-center justify-between p-4 border-b">
                    <h2 className="text-xl font-semibold text-gray-800">
                        {initialData ? '编辑账号' : '新建账号'}
                    </h2>
                    <button onClick={onClose} className="text-gray-500 hover:text-gray-700">
                        <X size={24} />
                    </button>
                </div>

                <form onSubmit={handleSubmit} className="p-4 space-y-4">
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">账号名称</label>
                        <input
                            type="text"
                            required
                            className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                            placeholder="例如：Google, Netflix, AWS"
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                        />
                    </div>

                    <div className="space-y-3">
                        <div className="flex items-center justify-between">
                            <label className="block text-sm font-medium text-gray-700">自定义字段</label>
                            <button
                                type="button"
                                onClick={addField}
                                className="text-sm text-blue-600 hover:text-blue-700 flex items-center gap-1"
                            >
                                <Plus size={14} /> 添加字段
                            </button>
                        </div>

                        {fields.map((field, index) => (
                            <div key={index} className="flex gap-2 items-start">
                                <input
                                    type="text"
                                    placeholder="字段名"
                                    className="w-1/3 px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
                                    value={field.key}
                                    onChange={(e) => handleFieldChange(index, 'key', e.target.value)}
                                />
                                <input
                                    type="text"
                                    placeholder="值"
                                    className="flex-1 px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
                                    value={field.value}
                                    onChange={(e) => handleFieldChange(index, 'value', e.target.value)}
                                />
                                <button
                                    type="button"
                                    onClick={() => removeField(index)}
                                    className="p-2 text-gray-400 hover:text-red-500"
                                    tabIndex={-1}
                                >
                                    <Trash2 size={16} />
                                </button>
                            </div>
                        ))}
                    </div>

                    <div className="pt-4 flex justify-end gap-3">
                        <button
                            type="button"
                            onClick={onClose}
                            className="px-4 py-2 text-gray-700 hover:bg-gray-100 rounded-md transition-colors"
                        >
                            取消
                        </button>
                        <button
                            type="submit"
                            className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
                        >
                            {initialData ? '保存修改' : '创建账号'}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default AccountForm;
