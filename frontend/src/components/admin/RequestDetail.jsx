import React, { useState } from 'react';
import { projectsApi } from '../../services/api';
import { STATUSES, STATUS_LABELS, formatDateTime } from '../../utils/constants';

export function RequestDetail({ project, onUpdated }) {
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');

  if (!project) {
    return (
      <section className="panel detail muted">
        <p>Select a student request from the list to view requirements and update delivery status.</p>
      </section>
    );
  }

  const requestedAt = formatDateTime(project.created_at);
  const respondedAt = formatDateTime(project.admin_responded_at);
  const lastUpdatedAt = formatDateTime(project.updated_at);
  const feedbackAt = formatDateTime(project.feedback_at);

  async function handleSave(e) {
    e.preventDefault();
    setSaving(true);
    setError('');

    const formData = new FormData(e.target);
    const updates = {
      status: formData.get('status'),
      quote: formData.get('quote') ? parseFloat(formData.get('quote')) : null,
      admin_note: formData.get('admin_note') || '',
    };

    try {
      await projectsApi.adminUpdate(project.id, updates);
      onUpdated();
    } catch (err) {
      setError(err.message);
    } finally {
      setSaving(false);
    }
  }

  return (
    <section className="panel detail" key={project.id}>
      <p className="eyebrow">REQUEST #{project.id}</p>
      <h2>{project.title}</h2>
      <p>{project.description}</p>

      {/* Action Timestamps Box */}
      <div className="admin-timestamps-card">
        <div className="audit-item">
          <strong>📅 Student Requested:</strong>
          <span>{requestedAt || 'Unknown'}</span>
        </div>
        <div className="audit-item">
          <strong>⚡ Team Responded:</strong>
          <span>{respondedAt || 'Awaiting initial team response'}</span>
        </div>
        <div className="audit-item">
          <strong>🕒 Last Action:</strong>
          <span>{lastUpdatedAt || 'Recent'}</span>
        </div>
      </div>

      {/* Student Feedback Display */}
      {project.rating ? (
        <div className="admin-review-box">
          <div className="admin-review-header">
            <strong>⭐ Student Review & Rating</strong>
            <div className="stars-read-only">
              {[1, 2, 3, 4, 5].map((s) => (
                <span key={s} className={s <= project.rating ? 'star filled' : 'star'}>
                  ★
                </span>
              ))}
              <span className="rating-badge-score">{project.rating} / 5</span>
            </div>
          </div>
          {project.feedback && <p className="review-content">"{project.feedback}"</p>}
          {feedbackAt && <span className="review-timestamp">Reviewed on {feedbackAt}</span>}
        </div>
      ) : (
        <div className="admin-no-review">
          <small>Student hasn't submitted a review for this project yet.</small>
        </div>
      )}

      <div className="contact">
        <b>Student Contact Information</b>
        <a href={`mailto:${project.student?.email}`}>✉ {project.student?.email}</a>
        <a href={`tel:${project.phone}`}>☎ {project.phone}</a>
        <span>🏛 {project.college}</span>
      </div>

      <form onSubmit={handleSave}>
        <label>
          Project Status
          <select name="status" defaultValue={project.status}>
            {STATUSES.map((statusKey) => (
              <option key={statusKey} value={statusKey}>
                {STATUS_LABELS[statusKey]}
              </option>
            ))}
          </select>
        </label>

        <label>
          Quote Amount (₹)
          <input
            name="quote"
            type="number"
            step="0.01"
            defaultValue={project.quote || ''}
            placeholder="e.g. 3500"
          />
        </label>

        <label>
          Client-facing update
          <textarea
            name="admin_note"
            defaultValue={project.admin_note || ''}
            placeholder="Shown directly on the student dashboard timeline"
          />
        </label>

        {error && <div className="error">{error}</div>}

        <button type="submit" disabled={saving}>
          {saving ? 'Saving changes…' : 'Save & Notify Student →'}
        </button>
      </form>
    </section>
  );
}
