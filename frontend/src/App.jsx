import React, { useEffect, useState } from 'react';
import { useAuth } from './context/AuthContext';
import { AuthPage } from './pages/AuthPage';
import { StudentDashboard } from './pages/StudentDashboard';
import { AdminDashboard } from './pages/AdminDashboard';
import { LoadingScreen } from './components/common/LoadingScreen';

export function App() {
  const { user, loading } = useAuth();
  const [view, setView] = useState('projects');

  // Ensure view defaults to 'admin' whenever a staff member logs in
  useEffect(() => {
    if (user?.is_staff) {
      setView('admin');
    } else if (user) {
      setView('projects');
    }
  }, [user]);

  if (loading) {
    return <LoadingScreen message="Initializing College Circuit…" />;
  }

  if (!user) {
    return <AuthPage />;
  }

  // Admins always go to Admin Workspace
  if (user.is_staff) {
    return <AdminDashboard currentView={view} setView={setView} />;
  }

  // Regular students dashboard
  return <StudentDashboard currentView={view} setView={setView} />;
}
