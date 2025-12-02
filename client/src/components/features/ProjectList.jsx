import React from 'react';
import { Folder, Trash2 } from 'lucide-react';

const ProjectList = ({ projects, selectedProjectId, onSelectProject, onDeleteProject }) => {
    return (
        <div className="space-y-1">
            {projects.map((project) => (
                <div
                    key={project.id}
                    className={`
                        group flex items-center justify-between px-3 py-2 rounded-md cursor-pointer transition-colors
                        ${selectedProjectId === project.id
                            ? 'bg-blue-50 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400'
                            : 'text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700'
                        }
                    `}
                    onClick={() => onSelectProject(project.id)}
                >
                    <div className="flex items-center gap-3 overflow-hidden">
                        <Folder size={18} className={selectedProjectId === project.id ? 'fill-current' : ''} />
                        <span className="truncate font-medium">{project.name}</span>
                        {project._count?.accounts > 0 && (
                            <span className="text-xs text-gray-400 dark:text-gray-500">({project._count.accounts})</span>
                        )}
                    </div>
                    <button
                        onClick={(e) => {
                            e.stopPropagation();
                            onDeleteProject(project.id);
                        }}
                        className="opacity-0 group-hover:opacity-100 p-1 text-gray-400 hover:text-red-500 transition-all"
                        title="删除项目"
                    >
                        <Trash2 size={16} />
                    </button>
                </div>
            ))}
            {projects.length === 0 && (
                <div className="text-center text-gray-400 dark:text-gray-500 py-4 text-sm">
                    暂无项目
                </div>
            )}
        </div>
    );
};

export default ProjectList;
