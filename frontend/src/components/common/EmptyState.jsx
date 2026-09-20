import React from 'react';

export function EmptyState({ onCreateClick }) {
  return (
    <div className="empty">
      <b>Your ideas belong here.</b>
      <p>
        Submit your first project request and our engineering partners will reach out to discuss
        requirements and timeline.
      </p>
      <button type="button" onClick={onCreateClick}>
        Create a request
      </button>
    </div>
  );
}
