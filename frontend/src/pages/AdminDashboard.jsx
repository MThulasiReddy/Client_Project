import React, { useCallback, useEffect, useState } from 'react';
import { Header } from '../components/common/Header';
import { Footer } from '../components/common/Footer';
import { RequestRow } from '../components/admin/RequestRow';
import { RequestDetail } from '../components/admin/RequestDetail';
import { AnnouncementModal } from '../components/admin/AnnouncementModal';
import { ApplyDailyView } from '../components/placement/ApplyDailyView';
import { projectsApi } from '../services/api';
import { connectProjectSocket } from '../services/websocket';
import { useAuth } from '../context/AuthContext';

export function AdminDashboard({ currentView, setView }) {
  const { user, logout } = useAuth();
  const [requests, setRequests] = useState([]);
  const [selectedRequest, setSelectedRequest] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isAnnouncementModalOpen, setIsAnnouncementModalOpen] = useState(false);

  const loadRequests = useCallback(async () => {
    try {
      const data = await projectsApi.adminList();
      setRequests(data);

      // Keep selected request synchronized with fresh data if present
      setSelectedRequest((prevSelected) => {
        if (!prevSelected) return null;
        return data.find((r) => r.id === prevSelected.id) || null;
      });
    } catch (err) {
      console.error('Failed to load admin requests:', err);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadRequests();

    // Enable live WebSocket synchronization for admin workspace
    const disconnectSocket = connectProjectSocket(() => {
      loadRequests();
    });

    return () => {
      disconnectSocket();
    };
  }, [loadRequests]);

  return (
    <div className="dashboard-page-wrapper">
      <Header
        user={user}
        currentView={currentView}
        onNavigate={setView}
        onLogout={logout}
      />

      <main className="dashboard">
        {currentView === 'apply-daily' ? (
          <ApplyDailyView user={user} />
        ) : (
          <>
            <div className="intro admin-intro-row">
              <div>
                <p className="eyebrow">OPERATIONS</p>
                <h1>Admin Workspace</h1>
                <p>
                  {requests.length} student {requests.length === 1 ? 'request' : 'requests'} currently in
                  the pipeline.
                </p>
              </div>

              <button
                type="button"
                className="btn-edit-announcement"
                onClick={() => setIsAnnouncementModalOpen(true)}
                title="Configure the announcement card shown on the hero section"
              >
                📢 Edit Hero Announcement
              </button>
            </div>

            <div className="admin-grid">
              <section className="panel requests">
                <h2>All Requests</h2>
                {loading ? (
                  <div style={{ padding: '24px', color: '#64746d' }}>Loading requests…</div>
                ) : requests.length > 0 ? (
                  requests.map((req) => (
                    <RequestRow
                      key={req.id}
                      project={req}
                      isSelected={selectedRequest?.id === req.id}
                      onSelect={setSelectedRequest}
                    />
                  ))
                ) : (
                  <div style={{ padding: '24px', color: '#64746d' }}>No project requests found.</div>
                )}
              </section>

              <RequestDetail project={selectedRequest} onUpdated={loadRequests} />
            </div>
          </>
        )}
      </main>

      <AnnouncementModal
        isOpen={isAnnouncementModalOpen}
        onClose={() => setIsAnnouncementModalOpen(false)}
      />

      <Footer />
    </div>
  );
}
