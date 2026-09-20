import React from 'react';
import { StatusBadge } from '../common/StatusBadge';
import { formatDateTime } from '../../utils/constants';

export function RequestRow({ project, isSelected, onSelect }) {
  const requestedDate = formatDateTime(project.created_at);

  return (
    <button
      type="button"
      className={`requestrow ${isSelected ? 'active' : ''}`}
      onClick={() => onSelect(project)}
    >
      <div>
        <b>{project.title}</b>
        <small>
          {project.student?.name || 'Student'} · {project.student?.email}
        </small>
        <span className="row-date">Req: {requestedDate || 'Recent'}</span>
      </div>

      <div className="row-status-group">
        {project.rating && (
          <span className="rating-pill" title={`Rated ${project.rating} out of 5 stars`}>
            ★ {project.rating}/5
          </span>
        )}
        <StatusBadge status={project.status} />
      </div>
    </button>
  );
}
