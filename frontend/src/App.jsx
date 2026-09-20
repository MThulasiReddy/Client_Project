import React, { useState } from 'react';
import { useAuth } from './context/AuthContext';
import { AuthPage } from './pages/AuthPage';
import { StudentDashboard } from './pages/StudentDashboard';
import { AdminDashboard } from './pages/AdminDashboard';
import { LoadingScreen } from './components/common/LoadingScreen';

export function App() {
  const { user, loading } = useAuth();
  const [view, setView] = useState(() => (user?.is_staff ? 'admin' : 'projects'));

  if (loading) {
    return <LoadingScreen message="Initializing College Circuit…" />;
  }

  if (!user) {
    return <AuthPage />;
  }

  // If user is staff and viewing admin
  if (view === 'admin' && user.is_staff) {
    return <AdminDashboard currentView={view} setView={setView} />;
  }

  // Standard student dashboard (and student view for staff when toggled)
  return <StudentDashboard currentView={view} setView={setView} />;
}
