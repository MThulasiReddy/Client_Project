import React from 'react';
import { STATUS_LABELS } from '../../utils/constants';

export function StatusBadge({ status }) {
  const label = STATUS_LABELS[status] || status;
  return <span className={`status ${status}`}>{label}</span>;
}
