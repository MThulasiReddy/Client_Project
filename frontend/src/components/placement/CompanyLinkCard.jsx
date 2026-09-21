import React from 'react';
import { formatDate } from '../../utils/constants';

export function CompanyLinkCard({ company, isAdmin, onEdit, onDelete, onToggleApply, onTrackClick }) {
  const {
    id,
    department,
    company_name,
    role_title,
    job_type,
    apply_link,
    deadline,
    batch_eligibility,
    salary_or_stipend,
    location,
    description,
    has_applied,
    applicant_count,
    click_count,
  } = company;

  // Compute deadline status
  const now = new Date();
  const deadlineDate = deadline ? new Date(deadline + 'T23:59:59') : null;
  const isExpired = deadlineDate ? deadlineDate < now : false;
  const daysRemaining = deadlineDate
    ? Math.ceil((deadlineDate.getTime() - now.getTime()) / (1000 * 60 * 60 * 24))
    : null;

  let deadlineClass = 'normal';
  let deadlineText = deadline ? `Deadline: ${formatDate(deadline)}` : 'Rolling applications';

  if (isExpired) {
    deadlineClass = 'expired';
    deadlineText = `Deadline passed (${formatDate(deadline)})`;
  } else if (daysRemaining !== null && daysRemaining <= 3) {
    deadlineClass = 'urgent';
    deadlineText = `Expires in ${daysRemaining === 0 ? 'today' : `${daysRemaining} day${daysRemaining > 1 ? 's' : ''}`} (${formatDate(deadline)})`;
  }

  function handleApplyClick() {
    if (onTrackClick) {
      onTrackClick(id);
    }
  }

  return (
    <div className={`company-card ${has_applied ? 'applied-card' : ''}`}>
      <div>
        <div className="company-card-top">
          <span className={`company-dept-tag dept-${department.toLowerCase()}`}>
            {department.toUpperCase()}
          </span>
          <span className="company-job-type-pill">{job_type}</span>
        </div>

        <div className="company-title-area">
          <h3>{company_name}</h3>
          <p className="company-role">{role_title}</p>
        </div>

        <div className="company-meta-tags">
          {location && (
            <span className="meta-tag-item">
              📍 {location}
            </span>
          )}
          {salary_or_stipend && (
            <span className="meta-tag-item">
              💰 {salary_or_stipend}
            </span>
          )}
          {batch_eligibility && (
            <span className="meta-tag-item">
              🎓 {batch_eligibility}
            </span>
          )}
        </div>

        {/* Live VEMU Competition / Activity Counter */}
        <div className="competition-meter">
          <div className="competition-stats">
            <span className="competition-tag" title="VEMU students who clicked to apply" >
              🔥 <strong>{click_count || 0}</strong> VEMU{' '}
                  {click_count === 1 ? 'student' : 'students'} Clicked/Applied
            </span>
          </div>
        </div>

        {description && <p className="company-desc">{description}</p>}

        <div className={`deadline-badge ${deadlineClass}`}>
          <span>⏳ <strong>{deadlineText}</strong></span>
          {has_applied && <span className="badge-applied-check">✓ Marked Applied</span>}
        </div>
      </div>

      <div className="company-card-actions">
        <a
          href={apply_link}
          target="_blank"
          rel="noopener noreferrer"
          className="apply-link-btn"
          onClick={handleApplyClick}
          title={`Open and apply on ${company_name} portal`}
        >
          Apply Now ↗
        </a>

        {!isAdmin && (
          <button
            type="button"
            className={`btn-toggle-apply ${has_applied ? 'applied' : ''}`}
            onClick={() => onToggleApply(id)}
            title={has_applied ? 'Click to unmark' : 'Mark as applied for your reference'}
          >
            {has_applied ? '✓ Applied' : 'Mark as Applied'}
          </button>
        )}

        {isAdmin && (
          <div className="admin-card-controls">
            <button
              type="button"
              className="btn-admin-icon"
              onClick={() => onEdit(company)}
              title="Edit Link"
            >
              ✏️ Edit
            </button>
            <button
              type="button"
              className="btn-admin-icon delete"
              onClick={() => onDelete(id, company_name)}
              title="Delete Link"
            >
              🗑️ Delete
            </button>
          </div>
        )}
      </div>
    </div>
  );
}

