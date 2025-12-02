import React, { useState, useEffect } from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import AppRouter from './router/AppRouter';
import Layout from './layouts/Layout';
import AccountList from './components/features/AccountList';
import AccountForm from './components/features/AccountForm';
import RecycleBin from './components/features/RecycleBin';
import dataService from './api';
import { ThemeProvider } from './context/ThemeContext';

function App() {
  console.log('App rendering...');
  const [isProjectModalOpen, setIsProjectModalOpen] = useState(false);
  const [newProjectName, setNewProjectName] = useState('');
  const [projects, setProjects] = useState([]);
  const [selectedProjectId, setSelectedProjectId] = useState(null);
  const [currentView, setCurrentView] = useState('projects'); // 'projects' or 'trash'
  const [accounts, setAccounts] = useState([]);
  const [isAccountFormOpen, setIsAccountFormOpen] = useState(false);
  const [editingAccount, setEditingAccount] = useState(null);

  useEffect(() => {
    console.log('App mounted, fetching projects...');
    fetchProjects();
  }, []);

  useEffect(() => {
    if (selectedProjectId) {
      fetchAccounts(selectedProjectId);
    } else {
      setAccounts([]);
    }
  }, [selectedProjectId]);

  const fetchProjects = async () => {
    try {
      const res = await dataService.getProjects();
      setProjects(res.data);
      if (res.data.length > 0 && !selectedProjectId) {
        setSelectedProjectId(res.data[0].id);
      }
    } catch (error) {
      console.error('Failed to fetch projects', error);
    }
  };

  const fetchAccounts = async (projectId) => {
    try {
      const res = await dataService.getAccounts(projectId);
      setAccounts(res.data);
    } catch (error) {
      console.error('Failed to fetch accounts', error);
    }
  };

  const handleAddProject = () => {
    setNewProjectName('');
    setIsProjectModalOpen(true);
  };

  const handleCreateProject = async (e) => {
    e.preventDefault();
    if (!newProjectName.trim()) return;

    try {
      const res = await dataService.createProject({ name: newProjectName });
      setProjects([res.data, ...projects]);
      setSelectedProjectId(res.data.id);
      setIsProjectModalOpen(false);
      fetchProjects(); // Refresh to get correct order/counts
    } catch (error) {
      console.error('Failed to create project', error);
      alert('创建项目失败');
    }
  };

  const handleDeleteProject = async (id) => {
    if (!window.confirm('确定要删除吗？这将删除该项目下的所有账号。')) return;

    try {
      await dataService.deleteProject(id);
      const newProjects = projects.filter(p => p.id !== id);
      setProjects(newProjects);
      if (selectedProjectId === id) {
        setSelectedProjectId(newProjects.length > 0 ? newProjects[0].id : null);
      }
    } catch (error) {
      console.error('Failed to delete project', error);
      alert('删除项目失败');
    }
  };

  const handleAddAccount = () => {
    setEditingAccount(null);
    setIsAccountFormOpen(true);
  };

  const handleEditAccount = (account) => {
    setEditingAccount(account);
    setIsAccountFormOpen(true);
  };

  const handleDeleteAccount = async (id) => {
    if (!window.confirm('确定要删除这个账号吗？')) return;

    try {
      await dataService.deleteAccount(id);
      setAccounts(accounts.filter(a => a.id !== id));
      fetchProjects(); // Update counts
    } catch (error) {
      console.error('Failed to delete account', error);
      alert('删除账号失败');
    }
  };

  const handleAccountSubmit = async (formData) => {
    try {
      if (editingAccount) {
        const res = await dataService.updateAccount(editingAccount.id, formData);
        setAccounts(accounts.map(a => a.id === editingAccount.id ? res.data : a));
      } else {
        const res = await dataService.createAccount({
          ...formData,
          projectId: selectedProjectId
        });
        setAccounts([res.data, ...accounts]);
      }
      setIsAccountFormOpen(false);
      fetchProjects(); // Update counts
    } catch (error) {
      console.error('Failed to save account', error);
      alert('保存账号失败');
    }
  };

  return (
    <ThemeProvider>
      <AppRouter>
        <Layout
          projects={projects}
          selectedProjectId={selectedProjectId}
          onSelectProject={setSelectedProjectId}
          onAddProject={handleAddProject}
          onDeleteProject={handleDeleteProject}
          currentView={currentView}
          onSelectView={setCurrentView}
        >
          {currentView === 'trash' ? (
            <RecycleBin />
          ) : selectedProjectId ? (
            <AccountList
              accounts={accounts}
              onAddAccount={handleAddAccount}
              onEditAccount={handleEditAccount}
              onDeleteAccount={handleDeleteAccount}
            />
          ) : (
            <div className="flex items-center justify-center h-full text-gray-500">
              请选择或创建一个项目以开始
            </div>
          )}

          <AccountForm
            isOpen={isAccountFormOpen}
            onClose={() => setIsAccountFormOpen(false)}
            onSubmit={handleAccountSubmit}
            initialData={editingAccount}
          />

          {/* Project Creation Modal */}
          {isProjectModalOpen && (
            <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
              <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-lg w-96">
                <h2 className="text-xl font-bold mb-4 text-gray-900 dark:text-white">新建项目</h2>
                <form onSubmit={handleCreateProject}>
                  <input
                    type="text"
                    value={newProjectName}
                    onChange={(e) => setNewProjectName(e.target.value)}
                    placeholder="项目名称"
                    className="w-full px-3 py-2 border dark:border-gray-600 rounded-md mb-4 bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                    autoFocus
                  />
                  <div className="flex justify-end gap-2">
                    <button
                      type="button"
                      onClick={() => setIsProjectModalOpen(false)}
                      className="px-4 py-2 text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-md"
                    >
                      取消
                    </button>
                    <button
                      type="submit"
                      className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
                    >
                      创建
                    </button>
                  </div>
                </form>
              </div>
            </div>
          )}
        </Layout>
      </AppRouter>
    </ThemeProvider>
  );
}

export default App;
