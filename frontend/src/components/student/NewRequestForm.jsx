import React, { useState } from 'react';
import { projectsApi } from '../../services/api';
import { CATEGORIES } from '../../utils/constants';

export function NewRequestForm({ onCreated, onCancel }) {
  const [error, setError] = useState('');
  const [submitting, setSubmitting] = useState(false);

  async function handleSubmit(e) {
    e.preventDefault();
    setError('');
    setSubmitting(true);

    const formData = new FormData(e.target);
    const payload = Object.fromEntries(formData.entries());

    try {
      const createdProject = await projectsApi.create(payload);
      e.target.reset();
      onCreated(createdProject);
    } catch (err) {
      setError(err.message);
    } finally {
      setSubmitting(false);
    }
  }

  function handlePhoneInput(e) {
    // Only allow digits and cap length at 10
    e.currentTarget.value = e.currentTarget.value.replace(/\D/g, '').slice(0, 10);
  }

  return (
    <section className="panel formpanel">
      <div>
        <p className="eyebrow">NEW REQUEST</p>
        <h2>What are we building?</h2>
        <p className="muted">
          Share your idea — our team will reach out promptly to finalize requirements and pricing.
        </p>
      </div>

      <form onSubmit={handleSubmit} className="projectform">
        <label>
          Project title
          <input
            name="title"
            required
            placeholder="e.g. IoT Smart Irrigation System or E-commerce Web App"
          />
        </label>

        <label>
          Category
          <select name="category" defaultValue="web">
            {CATEGORIES.map((cat) => (
              <option key={cat.value} value={cat.value}>
                {cat.label}
              </option>
            ))}
          </select>
        </label>

        <label>
          College / University
          <input name="college" required placeholder="Your college / institution name" />
        </label>

        <label>
          Phone number
          <input
            name="phone"
            type="tel"
            inputMode="numeric"
            pattern="[6-9][0-9]{9}"
            minLength={10}
            maxLength={10}
            required
            title="Enter a valid 10-digit Indian mobile number starting with 6, 7, 8, or 9"
            placeholder="10-digit mobile number"
            onInput={handlePhoneInput}
          />
          <small className="fieldhint">10 digits, beginning with 6, 7, 8, or 9</small>
        </label>

        <label>
          Target deadline (Optional)
          <input name="deadline" type="date" />
        </label>

        <label className="wide">
          Requirements & scope
          <textarea
            name="description"
            required
            placeholder="Mention key features, tech stack preferences, reference links, or specific constraints…"
          />
        </label>

        {error && <div className="error wide">{error}</div>}

        <button type="submit" disabled={submitting}>
          {submitting ? 'Submitting request…' : 'Send project request →'}
        </button>
      </form>
    </section>
  );
}
