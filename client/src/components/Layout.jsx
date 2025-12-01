import React from 'react';
import { Link } from 'react-router-dom';
import { Layout as LayoutIcon, Plus, Trash2 } from 'lucide-react';
import ProjectList from './ProjectList';

const Layout = ({ children, projects, onSelectProject, onAddProject, onDeleteProject, selectedProjectId, currentView, onSelectView }) => {
    return (
        <div className="flex h-screen bg-gray-100">
            {/* Sidebar */}
            <div className="w-64 bg-white shadow-md flex flex-col">
                <div className="p-4 border-b flex items-center justify-between">
                    <h1 className="text-xl font-bold text-gray-800 flex items-center gap-2">
                        <LayoutIcon size={24} />
                        AokiCorePwd
                    </h1>
                </div>

                <div className="p-4 border-b">
                    <button
                        onClick={onAddProject}
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
                        }}
                        onDeleteProject={onDeleteProject}
                    />
                </div>

                <div className="p-4 border-t">
                    <button
                        onClick={() => onSelectView('trash')}
                        className={`w-full flex items-center gap-3 px-3 py-2 rounded-md transition-colors ${currentView === 'trash' ? 'bg-blue-50 text-blue-700' : 'text-gray-700 hover:bg-gray-50'
                            }`}
                    >
                        <Trash2 size={18} />
                        <span className="font-medium">回收站</span>
                    </button>
                </div>
            </div>

            {/* Main Content */}
            <div className="flex-1 overflow-auto p-8">
                {children}
            </div>
        </div>
    );
};

export default Layout;
