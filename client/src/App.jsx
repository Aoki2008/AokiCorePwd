import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Layout from './components/Layout';
import AccountList from './components/AccountList';
import AccountForm from './components/AccountForm';
import RecycleBin from './components/RecycleBin';
import api from './lib/api';

function App() {
  const [projects, setProjects] = useState([]);
  const [selectedProjectId, setSelectedProjectId] = useState(null);
  const [currentView, setCurrentView] = useState('projects'); // 'projects' or 'trash'
  const [accounts, setAccounts] = useState([]);
  const [isAccountFormOpen, setIsAccountFormOpen] = useState(false);
  const [editingAccount, setEditingAccount] = useState(null);

  useEffect(() => {
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
      const res = await api.get('/projects');
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
      const res = await api.get(`/projects/${projectId}/accounts`);
      setAccounts(res.data);
    } catch (error) {
      console.error('Failed to fetch accounts', error);
    }
  };

  const handleAddProject = async () => {
    const name = prompt('请输入项目名称:');
    if (!name) return;

    try {
      const res = await api.post('/projects', { name });
      setProjects([res.data, ...projects]);
      setSelectedProjectId(res.data.id);
    } catch (error) {
      console.error('Failed to create project', error);
      alert('创建项目失败');
    }
  };

  const handleDeleteProject = async (id) => {
    if (!window.confirm('确定要删除吗？这将删除该项目下的所有账号。')) return;

    try {
      await api.delete(`/projects/${id}`);
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
      await api.delete(`/accounts/${id}`);
      setAccounts(accounts.filter(a => a.id !== id));
    } catch (error) {
      console.error('Failed to delete account', error);
      alert('删除账号失败');
    }
  };

  const handleAccountSubmit = async (formData) => {
    try {
      if (editingAccount) {
        const res = await api.put(`/accounts/${editingAccount.id}`, formData);
        setAccounts(accounts.map(a => a.id === editingAccount.id ? res.data : a));
      } else {
        const res = await api.post('/accounts', {
          ...formData,
          projectId: selectedProjectId
        });
        setAccounts([res.data, ...accounts]);
      }
      setIsAccountFormOpen(false);
    } catch (error) {
      console.error('Failed to save account', error);
      alert('保存账号失败');
    }
  };

  return (
    <Router>
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
      </Layout>
    </Router>
  );
}

export default App;
