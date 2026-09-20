import React, { useCallback, useEffect, useState } from 'react';
import { Header } from '../components/common/Header';
import { EmptyState } from '../components/common/EmptyState';
import { Footer } from '../components/common/Footer';
import { ProjectCard } from '../components/student/ProjectCard';
import { NewRequestForm } from '../components/student/NewRequestForm';
import { FeedbackModal } from '../components/student/FeedbackModal';
import { projectsApi } from '../services/api';
import { connectProjectSocket } from '../services/websocket';
import { useAuth } from '../context/AuthContext';

export function StudentDashboard({ currentView, setView }) {
  const { user, logout } = useAuth();
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [feedbackProject, setFeedbackProject] = useState(null);

  const firstName = user?.name ? user.name.split(' ')[0] : 'Student';

  const loadProjects = useCallback(async () => {
    try {
      const data = await projectsApi.list();
      setProjects(data);
    } catch (err) {
      console.error('Failed to load student projects:', err);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadProjects();

    // Setup real-time WebSocket updates with auto-reconnect
    const disconnectSocket = connectProjectSocket(() => {
      loadProjects();
    });

    // Fallback polling every 30 seconds
    const pollInterval = setInterval(loadProjects, 30000);

    return () => {
      disconnectSocket();
      clearInterval(pollInterval);
    };
  }, [loadProjects]);

  function handleProjectCreated() {
    loadProjects();
    setView('projects');
  }

  function handleFeedbackSubmitted(updatedProject) {
    setProjects((prev) =>
      prev.map((p) => (p.id === updatedProject.id ? updatedProject : p))
    );
  }

  return (
    <div className="dashboard-page-wrapper">
      <Header
        user={user}
        currentView={currentView}
        onNavigate={setView}
        onLogout={logout}
      />

      <main className="dashboard">
        <div className="intro">
          <p className="eyebrow">STUDENT DASHBOARD</p>
          <h1>
            Hi, {firstName} <span>✦</span>
          </h1>
          <p>Track your active requests and monitor live milestone progress.</p>
        </div>

        {currentView === 'new' ? (
          <NewRequestForm
            onCreated={handleProjectCreated}
            onCancel={() => setView('projects')}
          />
        ) : (
          <>
            <div className="sectionhead">
              <h2>Your project requests</h2>
              <button type="button" onClick={() => setView('new')}>
                + New request
              </button>
            </div>

            {loading ? (
              <div className="empty">
                <p>Loading your projects…</p>
              </div>
            ) : projects.length > 0 ? (
              <div className="cards">
                {projects.map((project) => (
                  <ProjectCard
                    key={project.id}
                    project={project}
                    onOpenFeedback={setFeedbackProject}
                  />
                ))}
              </div>
            ) : (
              <EmptyState onCreateClick={() => setView('new')} />
            )}
          </>
        )}
      </main>

      {feedbackProject && (
        <FeedbackModal
          project={feedbackProject}
          onClose={() => setFeedbackProject(null)}
          onFeedbackSubmitted={handleFeedbackSubmitted}
        />
      )}

      <Footer />
    </div>
  );
}
