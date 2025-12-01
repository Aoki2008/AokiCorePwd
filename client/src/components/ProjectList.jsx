import React from 'react';
import { Folder, Trash2 } from 'lucide-react';

const ProjectList = ({ projects, selectedProjectId, onSelectProject, onDeleteProject }) => {
    return (
        <div className="space-y-2">
            {projects.map((project) => (
                <div
                    key={project.id}
                    className={`group flex items-center justify-between p-3 rounded-md cursor-pointer transition-colors ${selectedProjectId === project.id ? 'bg-blue-50 text-blue-700' : 'hover:bg-gray-50 text-gray-700'
                        }`}
                    onClick={() => onSelectProject(project.id)}
                >
                    <div className="flex items-center gap-3 truncate">
                        <Folder size={18} />
                        <span className="font-medium truncate">{project.name}</span>
                    </div>
                    <button
                        onClick={(e) => {
                            e.stopPropagation();
                            onDeleteProject(project.id);
                        }}
                        className="opacity-0 group-hover:opacity-100 p-1 text-gray-400 hover:text-red-500 transition-all"
                    >
                        <Trash2 size={16} />
                    </button>
                </div>
            ))}
            {projects.length === 0 && (
                <div className="text-center text-gray-400 py-4 text-sm">
                    暂无项目
                </div>
            )}
        </div>
    );
};

export default ProjectList;
