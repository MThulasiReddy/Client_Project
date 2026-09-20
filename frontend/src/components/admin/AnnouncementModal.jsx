import React, { useEffect, useState } from 'react';
import { projectsApi } from '../../services/api';

export function AnnouncementModal({ isOpen, onClose, onSaved }) {
  const [title, setTitle] = useState('');
  const [text, setText] = useState('');
  const [statsBadge, setStatsBadge] = useState('');
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    if (isOpen) {
      setLoading(true);
      projectsApi
        .getAnnouncement()
        .then((data) => {
          setTitle(data.title || 'PROVEN TRACK RECORD');
          setText(
            data.text || 'We did 100+ projects as of now, 200+ clients satisfied across colleges!'
          );
          setStatsBadge(
            data.stats_badge || '100+ Projects Completed · 200+ Satisfied Students'
          );
        })
        .catch((err) => {
          setError(err.message);
        })
        .finally(() => {
          setLoading(false);
        });
    }
  }, [isOpen]);

  if (!isOpen) return null;

  async function handleSave(e) {
    e.preventDefault();
    setSaving(true);
    setError('');

    try {
      const updated = await projectsApi.updateAnnouncement({
        title,
        text,
        stats_badge: statsBadge,
      });
      if (onSaved) onSaved(updated);
      onClose();
    } catch (err) {
      setError(err.message || 'Failed to update hero announcement.');
    } finally {
      setSaving(false);
    }
  }

  return (
    <div className="modal-backdrop" onClick={onClose}>
      <div className="modal-card announcement-modal" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <div>
            <p className="eyebrow">HERO BANNER CONFIGURATION</p>
            <h3>Edit Hero Section Announcement</h3>
            <p className="muted">
              This milestone card appears prominently in the hero section for all students and visitors.
            </p>
          </div>
          <button type="button" className="modal-close" onClick={onClose} aria-label="Close modal">
            ✕
          </button>
        </div>

        {loading ? (
          <div style={{ padding: '24px', textAlign: 'center', color: '#64746d' }}>
            Loading current announcement…
          </div>
        ) : (
          <form onSubmit={handleSave}>
            <label>
              Header Tagline
              <input
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                required
                placeholder="e.g. PROVEN TRACK RECORD or LIVE MILESTONES"
              />
            </label>

            <label>
              Announcement / Metrics Text
              <textarea
                value={text}
                onChange={(e) => setText(e.target.value)}
                required
                rows={3}
                placeholder="e.g. We did 100+ projects as of now, 200+ clients satisfied across colleges!"
              />
            </label>

            <label>
              Key Metrics Badge
              <input
                value={statsBadge}
                onChange={(e) => setStatsBadge(e.target.value)}
                required
                placeholder="e.g. 100+ Projects Completed · 200+ Satisfied Students"
              />
            </label>

            {error && <div className="error">{error}</div>}

            <div className="modal-actions">
              <button
                type="button"
                className="btn-secondary"
                onClick={onClose}
                disabled={saving}
              >
                Cancel
              </button>
              <button type="submit" disabled={saving}>
                {saving ? 'Updating…' : 'Save & Publish Live →'}
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
}
