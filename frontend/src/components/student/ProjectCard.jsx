import React from 'react';
import { StatusBadge } from '../common/StatusBadge';
import { Timeline } from '../common/Timeline';
import { formatDateTime } from '../../utils/constants';

export function ProjectCard({ project, onOpenFeedback }) {
  const requestedTime = formatDateTime(project.created_at);
  const responseTime = formatDateTime(project.admin_responded_at || project.updated_at);

  return (
    <article className="project">
      <div className="cardtop">
        <span className="category">{project.category_label || project.category}</span>
        <StatusBadge status={project.status} />
      </div>

      <h3>{project.title}</h3>
      <p>{project.description}</p>

      <Timeline status={project.status} />

      <div className="timestamps-box">
        <div className="timestamp-item">
          <span className="timestamp-label">Requested:</span>
          <span className="timestamp-value">{requestedTime || 'Just now'}</span>
        </div>
        <div className="timestamp-item">
          <span className="timestamp-label">
            {project.admin_responded_at ? 'Team Responded:' : 'Last Activity:'}
          </span>
          <span className="timestamp-value">{responseTime || 'Pending review'}</span>
        </div>
      </div>

      <div className="meta">
        <span>Updated {requestedTime?.split(',')[0]}</span>
        {project.quote && <b>Quote: ₹{project.quote}</b>}
      </div>

      {project.admin_note && (
        <div className="note">
          <strong>✦ Update from team:</strong> {project.admin_note}
        </div>
      )}

      {/* Feedback Section */}
      <div className="feedback-card-section">
        {project.rating ? (
          <div className="feedback-display">
            <div className="feedback-header">
              <span className="feedback-title">Your Review</span>
              <div className="stars-read-only">
                {[1, 2, 3, 4, 5].map((s) => (
                  <span key={s} className={s <= project.rating ? 'star filled' : 'star'}>
                    ★
                  </span>
                ))}
                <strong className="rating-num">{project.rating}/5</strong>
              </div>
            </div>
            {project.feedback && <p className="feedback-text">"{project.feedback}"</p>}
            {project.feedback_at && (
              <span className="feedback-timestamp">
                Submitted {formatDateTime(project.feedback_at)}
              </span>
            )}
          </div>
        ) : (
          <button
            type="button"
            className="btn-feedback-trigger"
            onClick={() => onOpenFeedback(project)}
          >
            ★ Rate Our Work & Give Feedback
          </button>
        )}
      </div>
    </article>
  );
}
