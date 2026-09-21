import React, { useState } from 'react';

export function AddEditCompanyModal({ isOpen, onClose, onSaved, initialData }) {
  const [formData, setFormData] = useState(
    initialData || {
      department: 'cse',
      company_name: '',
      role_title: '',
      job_type: 'Full-time',
      apply_link: '',
      deadline: '',
      batch_eligibility: '',
      salary_or_stipend: '',
      location: '',
      description: '',
    }
  );
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  if (!isOpen) return null;

  function handleChange(e) {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  }

  async function handleSubmit(e) {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      await onSaved(formData, initialData?.id);
      onClose();
    } catch (err) {
      console.error('Failed to save placement company:', err);
      setError(err.message || 'Failed to save company link. Check all fields.');
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content-card" onClick={(e) => e.stopPropagation()}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <h2>{initialData ? 'Edit Placement Link' : 'Add Placement Company Link'}</h2>
          <button
            type="button"
            onClick={onClose}
            style={{ background: 'none', border: 'none', fontSize: '20px', cursor: 'pointer' }}
          >
            ✕
          </button>
        </div>
        <p style={{ color: '#6b7280', fontSize: '14px', margin: '4px 0 16px 0' }}>
          Publish placement company links categorized by department for students to apply directly.
        </p>

        {error && (
          <div
            style={{
              background: '#fef2f2',
              border: '1px solid #fecaca',
              color: '#991b1b',
              padding: '10px 14px',
              borderRadius: '6px',
              fontSize: '13px',
              marginBottom: '16px',
            }}
          >
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit}>
          <div className="modal-form-grid">
            <div>
              <label htmlFor="department">Target Department *</label>
              <select
                id="department"
                name="department"
                value={formData.department}
                onChange={handleChange}
                required
              >
                <option value="cse">CSE (Computer Science)</option>
                <option value="ece">ECE (Electronics & Communication)</option>
                <option value="it">IT (Information Technology)</option>
                <option value="eee">EEE (Electrical & Electronics)</option>
              </select>
            </div>

            <div>
              <label htmlFor="job_type">Job Type *</label>
              <select
                id="job_type"
                name="job_type"
                value={formData.job_type}
                onChange={handleChange}
                required
              >
                <option value="Full-time">Full-time</option>
                <option value="Internship">Internship</option>
                <option value="Intern + Full-time">Intern + Full-time</option>
                <option value="Contract">Contract</option>
              </select>
            </div>

            <div>
              <label htmlFor="company_name">Company Name *</label>
              <input
                type="text"
                id="company_name"
                name="company_name"
                placeholder="e.g. Google, Cisco, Qualcomm"
                value={formData.company_name}
                onChange={handleChange}
                required
              />
            </div>

            <div>
              <label htmlFor="role_title">Role / Job Title *</label>
              <input
                type="text"
                id="role_title"
                name="role_title"
                placeholder="e.g. Software Engineer, VLSI Trainee"
                value={formData.role_title}
                onChange={handleChange}
                required
              />
            </div>

            <div className="form-full-width">
              <label htmlFor="apply_link">Link to Apply (URL) *</label>
              <input
                type="url"
                id="apply_link"
                name="apply_link"
                placeholder="https://careers.company.com/job/12345"
                value={formData.apply_link}
                onChange={handleChange}
                required
              />
            </div>

            <div>
              <label htmlFor="deadline">Deadline to Apply *</label>
              <input
                type="date"
                id="deadline"
                name="deadline"
                value={formData.deadline || ''}
                onChange={handleChange}
                required
              />
            </div>

            <div>
              <label htmlFor="batch_eligibility">Batch / Eligibility</label>
              <input
                type="text"
                id="batch_eligibility"
                name="batch_eligibility"
                placeholder="e.g. 2025 / 2026 Batch, 7.0+ CGPA"
                value={formData.batch_eligibility || ''}
                onChange={handleChange}
              />
            </div>

            <div>
              <label htmlFor="salary_or_stipend">Salary / CTC / Stipend</label>
              <input
                type="text"
                id="salary_or_stipend"
                name="salary_or_stipend"
                placeholder="e.g. 8-12 LPA or ₹40k/month"
                value={formData.salary_or_stipend || ''}
                onChange={handleChange}
              />
            </div>

            <div>
              <label htmlFor="location">Job Location</label>
              <input
                type="text"
                id="location"
                name="location"
                placeholder="e.g. Bangalore / Remote / Hyderabad"
                value={formData.location || ''}
                onChange={handleChange}
              />
            </div>

            <div className="form-full-width">
              <label htmlFor="description">Short Description / Key Requirements</label>
              <textarea
                id="description"
                name="description"
                rows="3"
                placeholder="Key skills required, rounds information, or brief notes for students..."
                value={formData.description || ''}
                onChange={handleChange}
              />
            </div>
          </div>

          <div className="modal-actions-bar">
            <button
              type="button"
              className="btn-cancel"
              onClick={onClose}
              disabled={loading}
              style={{
                background: '#f3f4f6',
                border: '1px solid #d1d5db',
                padding: '10px 18px',
                borderRadius: '8px',
                cursor: 'pointer',
              }}
            >
              Cancel
            </button>
            <button
              type="submit"
              className="btn-submit"
              disabled={loading}
              style={{
                background: 'var(--color-primary)',
                color: '#fff',
                border: 'none',
                padding: '10px 22px',
                borderRadius: '8px',
                fontWeight: '600',
                cursor: 'pointer',
              }}
            >
              {loading ? 'Saving…' : initialData ? 'Save Changes' : 'Publish Link'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
