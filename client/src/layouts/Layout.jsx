import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Layout as LayoutIcon, Plus, Trash2, Sun, Moon, Monitor, Menu, X } from 'lucide-react';
import ProjectList from '../components/features/ProjectList';
import { useTheme } from '../context/ThemeContext';

const Layout = ({ children, projects, onSelectProject, onAddProject, onDeleteProject, selectedProjectId, currentView, onSelectView }) => {
    const { theme, setTheme } = useTheme();
    const [isSidebarOpen, setIsSidebarOpen] = useState(false);

    const toggleTheme = () => {
        if (theme === 'light') setTheme('dark');
        else if (theme === 'dark') setTheme('system');
        else setTheme('light');
    };

    const getThemeIcon = () => {
        if (theme === 'light') return <Sun size={18} />;
        if (theme === 'dark') return <Moon size={18} />;
        return <Monitor size={18} />;
    };

    const getThemeLabel = () => {
        if (theme === 'light') return '浅色模式';
        if (theme === 'dark') return '深色模式';
        return '跟随系统';
    };

    return (
        <div className="flex h-screen bg-gray-100 dark:bg-gray-900 transition-colors duration-200 overflow-hidden">
            {/* Mobile Header */}
            <div
                className="md:hidden fixed top-0 left-0 right-0 bg-white dark:bg-gray-800 border-b dark:border-gray-700 flex items-center justify-between px-4 z-20"
                style={{
                    paddingTop: 'max(env(safe-area-inset-top), 32px)',
                    height: 'calc(4rem + max(env(safe-area-inset-top), 32px))'
                }}
            >
                <div className="flex items-center gap-2 font-bold text-gray-800 dark:text-white">
                    <LayoutIcon size={24} />
                    AokiCorePwd
                </div>
                <button
                    onClick={() => setIsSidebarOpen(!isSidebarOpen)}
                    className="p-2 text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-md"
                >
                    {isSidebarOpen ? <X size={24} /> : <Menu size={24} />}
                </button>
            </div>

            {/* Sidebar Overlay */}
            {isSidebarOpen && (
                <div
                    className="fixed inset-0 bg-black/50 z-30 md:hidden"
                    onClick={() => setIsSidebarOpen(false)}
                />
            )}

            {/* Sidebar */}
            <div className={`
                fixed md:static inset-y-0 left-0 z-40 w-64 bg-white dark:bg-gray-800 shadow-md flex flex-col border-r dark:border-gray-700 transition-transform duration-200 transform 
                ${isSidebarOpen ? 'translate-x-0' : '-translate-x-full'} md:translate-x-0
            `}
                style={{ paddingTop: 'max(env(safe-area-inset-top), 32px)' }}
            >
                <div className="p-4 border-b dark:border-gray-700 flex items-center justify-between h-16 md:h-auto">
                    <h1 className="text-xl font-bold text-gray-800 dark:text-white flex items-center gap-2">
                        <LayoutIcon size={24} />
                        AokiCorePwd
                    </h1>
                </div>

                <div className="p-4 border-b dark:border-gray-700">
                    <button
                        onClick={() => {
                            onAddProject();
                            setIsSidebarOpen(false);
                        }}
                        className="w-full flex items-center justify-center gap-2 bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 transition-colors"
                    >
                        <Plus size={18} />
                        新建项目
                    </button>
                </div>

                <div className="flex-1 overflow-y-auto p-4">
                    <ProjectList
                        projects={projects}
                        selectedProjectId={selectedProjectId}
                        onSelectProject={(id) => {
                            onSelectProject(id);
                            onSelectView('projects');
                            setIsSidebarOpen(false);
                        }}
                        onDeleteProject={onDeleteProject}
                    />
                </div>

                <div className="p-4 border-t dark:border-gray-700 space-y-2">
                    <button
                        onClick={() => {
                            onSelectView('trash');
                            setIsSidebarOpen(false);
                        }}
                        className={`w-full flex items-center gap-3 px-3 py-2 rounded-md transition-colors ${currentView === 'trash' ? 'bg-blue-50 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400' : 'text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700'}`}
                    >
                        <Trash2 size={18} />
                        <span className="font-medium">回收站</span>
                    </button>

                    <button
                        onClick={toggleTheme}
                        className="w-full flex items-center gap-3 px-3 py-2 rounded-md transition-colors text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700"
                    >
                        {getThemeIcon()}
                        <span className="font-medium">{getThemeLabel()}</span>
                    </button>
                </div>
            </div>

            {/* Main Content */}
            <div
                className="flex-1 overflow-auto p-4 md:p-8 text-gray-900 dark:text-gray-100 md:pt-8"
                style={{
                    paddingTop: 'calc(5rem + max(env(safe-area-inset-top), 32px))'
                }}
            >
                {children}
            </div>
        </div>
    );
};

export default Layout;
