import React, { useState } from 'react';
import { projectsApi } from '../../services/api';

export function FeedbackModal({ project, onClose, onFeedbackSubmitted }) {
  const [rating, setRating] = useState(5);
  const [hoverRating, setHoverRating] = useState(0);
  const [feedbackText, setFeedbackText] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');

  if (!project) return null;

  async function handleSubmit(e) {
    e.preventDefault();
    if (!feedbackText.trim()) {
      setError('Please provide a brief note sharing your experience.');
      return;
    }

    setSubmitting(true);
    setError('');

    try {
      const updated = await projectsApi.submitFeedback(project.id, {
        rating,
        feedback: feedbackText.trim(),
      });
      onFeedbackSubmitted(updated);
      onClose();
    } catch (err) {
      setError(err.message || 'Failed to submit review. Please try again.');
    } finally {
      setSubmitting(false);
    }
  }

  const ratingDescriptions = {
    1: 'Needs major improvement',
    2: 'Below expectations',
    3: 'Satisfactory delivery',
    4: 'Great work & communication',
    5: 'Exceptional project & support!',
  };

  return (
    <div className="modal-backdrop" onClick={onClose}>
      <div className="modal-card feedback-modal" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <div>
            <p className="eyebrow">PROJECT REVIEW</p>
            <h3>Rate Your Experience</h3>
            <p className="muted">"{project.title}"</p>
          </div>
          <button type="button" className="modal-close" onClick={onClose} aria-label="Close modal">
            ✕
          </button>
        </div>

        <form onSubmit={handleSubmit}>
          <div className="star-rating-container">
            <div className="star-row">
              {[1, 2, 3, 4, 5].map((star) => (
                <button
                  type="button"
                  key={star}
                  className={`star-btn ${star <= (hoverRating || rating) ? 'filled' : ''}`}
                  onMouseEnter={() => setHoverRating(star)}
                  onMouseLeave={() => setHoverRating(0)}
                  onClick={() => setRating(star)}
                  aria-label={`${star} Star`}
                >
                  ★
                </button>
              ))}
            </div>
            <span className="rating-desc">
              {ratingDescriptions[hoverRating || rating]}
            </span>
          </div>

          <label>
            Your Feedback & Comments
            <textarea
              required
              rows={4}
              value={feedbackText}
              onChange={(e) => setFeedbackText(e.target.value)}
              placeholder="Tell us about the code quality, delivery speed, mentor support, and if your requirements were met…"
            />
          </label>

          {error && <div className="error">{error}</div>}

          <div className="modal-actions">
            <button type="button" className="btn-secondary" onClick={onClose} disabled={submitting}>
              Cancel
            </button>
            <button type="submit" disabled={submitting}>
              {submitting ? 'Submitting review…' : 'Submit Feedback ★'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
