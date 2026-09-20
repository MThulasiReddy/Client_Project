import React from 'react';
import { STATUSES, STATUS_LABELS } from '../../utils/constants';

export function Timeline({ status }) {
  const currentIndex = STATUSES.indexOf(status);

  return (
    <div className="timeline">
      {STATUSES.map((stepStatus, index) => {
        const isReached = index <= currentIndex;
        const isCompleted = index < currentIndex;

        return (
          <React.Fragment key={stepStatus}>
            <div className={`step ${isReached ? 'active' : ''}`}>
              <span>{isCompleted ? '✓' : index + 1}</span>
              <small>{STATUS_LABELS[stepStatus]}</small>
            </div>
            {index < STATUSES.length - 1 && (
              <div className={`line ${index < currentIndex ? 'active' : ''}`} />
            )}
          </React.Fragment>
        );
      })}
    </div>
  );
}
