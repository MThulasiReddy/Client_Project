import React, { useCallback, useEffect, useMemo, useState } from 'react';
import { placementApi } from '../../services/api';
import { CompanyLinkCard } from './CompanyLinkCard';
import { AddEditCompanyModal } from './AddEditCompanyModal';

const DEPARTMENTS = [
  { id: 'all', label: 'All Depts' },
  { id: 'cse', label: 'CSE', full: 'Computer Science' },
  { id: 'ece', label: 'ECE', full: 'Electronics & Communication' },
  { id: 'it', label: 'IT', full: 'Information Technology' },
  { id: 'eee', label: 'EEE', full: 'Electrical & Electronics' },
];

export function ApplyDailyView({ user }) {
  const isAdmin = Boolean(user?.is_staff);
  const [selectedDept, setSelectedDept] = useState('all');
  const [companies, setCompanies] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [filterApplied, setFilterApplied] = useState('all'); // 'all', 'applied', 'not_applied'
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingCompany, setEditingCompany] = useState(null);
  const [errorNotice, setErrorNotice] = useState(null);

  const loadCompanies = useCallback(async () => {
    try {
      setLoading(true);
      const data = await placementApi.list(selectedDept === 'all' ? '' : selectedDept, searchQuery);
      setCompanies(data);
    } catch (err) {
      console.error('Failed to load companies:', err);
      setErrorNotice('Could not load placement company links. Please try again.');
    } finally {
      setLoading(false);
    }
  }, [selectedDept, searchQuery]);

  useEffect(() => {
    loadCompanies();
  }, [loadCompanies]);

  async function handleSaveCompany(formData, id) {
    if (id) {
      await placementApi.update(id, formData);
    } else {
      await placementApi.create(formData);
    }
    await loadCompanies();
  }

  async function handleDeleteCompany(id, companyName) {
    const confirmed = window.confirm(`Are you sure you want to delete the placement link for "${companyName}"?`);
    if (!confirmed) return;

    try {
      await placementApi.delete(id);
      setCompanies((prev) => prev.filter((c) => c.id !== id));
    } catch (err) {
      alert('Failed to delete company link: ' + (err.message || 'Unknown error'));
    }
  }

  async function handleToggleApply(id) {
    // Optimistic UI update
    setCompanies((prev) =>
      prev.map((c) =>
        c.id === id ? { ...c, has_applied: !c.has_applied } : c
      )
    );

    try {
      const res = await placementApi.toggleApplied(id);
      setCompanies((prev) =>
        prev.map((c) => (c.id === id ? res.company : c))
      );
    } catch (err) {
      console.error('Failed to toggle applied status:', err);
      // Revert on error
      loadCompanies();
    }
  }

  async function handleTrackClick(id) {
    // Optimistic click count increment
    setCompanies((prev) =>
      prev.map((c) =>
        c.id === id ? { ...c, click_count: (c.click_count || 0) + 1 } : c
      )
    );

    try {
      const res = await placementApi.trackClick(id);
      setCompanies((prev) =>
        prev.map((c) => (c.id === id ? res.company : c))
      );
    } catch (err) {
      console.error('Failed to record link click:', err);
    }
  }

  // Filtered by applied filter on client side
  const displayedCompanies = useMemo(() => {
    return companies.filter((c) => {
      if (filterApplied === 'applied') return c.has_applied;
      if (filterApplied === 'not_applied') return !c.has_applied;
      return true;
    });
  }, [companies, filterApplied]);

  // Department counts
  const deptCounts = useMemo(() => {
    const counts = { all: companies.length, cse: 0, ece: 0, it: 0, eee: 0 };
    companies.forEach((c) => {
      const d = c.department?.toLowerCase();
      if (counts[d] !== undefined) counts[d]++;
    });
    return counts;
  }, [companies]);

  const appliedCount = useMemo(() => {
    return companies.filter((c) => c.has_applied).length;
  }, [companies]);

  return (
    <div className="apply-daily-container">
      <div className="apply-daily-header-row">
        <div>
          <p className="eyebrow">CAREERS & PLACEMENTS</p>
          <h1 style={{ font: '700 clamp(32px, 4vw, 42px) var(--font-serif)', margin: '4px 0' }}>
            Apply Daily 💼
          </h1>
          <p style={{ color: 'var(--color-text-subtle)', margin: '4px 0 0 0' }}>
            {isAdmin
              ? 'Manage and publish department-wise placement applications and hiring drives.'
              : 'Browse department-specific company application links and track your submissions.'}
          </p>
        </div>

        <div className="apply-daily-stats">
          {!isAdmin && (
            <span className="stat-pill success">
              ✓ {appliedCount} marked as applied
            </span>
          )}
          <span className="stat-pill">
            🎯 {companies.length} hiring opportunities
          </span>

          {isAdmin && (
            <button
              type="button"
              className="btn-add-company"
              onClick={() => {
                setEditingCompany(null);
                setIsModalOpen(true);
              }}
            >
              ＋ Add Company Link
            </button>
          )}
        </div>
      </div>

      {/* Department Tabs Navigation */}
      <div className="dept-nav-wrapper">
        {DEPARTMENTS.map((dept) => (
          <button
            key={dept.id}
            type="button"
            className={`dept-tab-btn ${selectedDept === dept.id ? 'active' : ''}`}
            onClick={() => setSelectedDept(dept.id)}
          >
            <span>{dept.label}</span>
            {selectedDept === 'all' && dept.id !== 'all' && (
              <span className="dept-badge">{deptCounts[dept.id] || 0}</span>
            )}
            {selectedDept === dept.id && (
              <span className="dept-badge">{dept.id === 'all' ? companies.length : deptCounts[dept.id] || 0}</span>
            )}
          </button>
        ))}
      </div>

      {/* Search & Filter Toolbar */}
      <div className="apply-toolbar">
        <div className="apply-search-box">
          <span className="apply-search-icon">🔍</span>
          <input
            type="text"
            placeholder="Search by company, role, or location…"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>

        {!isAdmin && (
          <div className="apply-filters-group">
            <button
              type="button"
              className={`filter-chip ${filterApplied === 'all' ? 'active' : ''}`}
              onClick={() => setFilterApplied('all')}
            >
              All Links
            </button>
            <button
              type="button"
              className={`filter-chip ${filterApplied === 'applied' ? 'active' : ''}`}
              onClick={() => setFilterApplied('applied')}
            >
              ✓ Applied ({appliedCount})
            </button>
            <button
              type="button"
              className={`filter-chip ${filterApplied === 'not_applied' ? 'active' : ''}`}
              onClick={() => setFilterApplied('not_applied')}
            >
              Pending ({companies.length - appliedCount})
            </button>
          </div>
        )}
      </div>

      {errorNotice && (
        <div style={{ padding: '14px', background: '#fee2e2', color: '#991b1b', borderRadius: '8px', marginBottom: '20px' }}>
          {errorNotice}
        </div>
      )}

      {/* Company Link Cards Grid */}
      {loading ? (
        <div className="empty" style={{ padding: '60px 20px', textAlign: 'center' }}>
          <p>Loading company applying links…</p>
        </div>
      ) : displayedCompanies.length > 0 ? (
        <div className="company-grid">
          {displayedCompanies.map((company) => (
            <CompanyLinkCard
              key={company.id}
              company={company}
              isAdmin={isAdmin}
              onEdit={(comp) => {
                setEditingCompany(comp);
                setIsModalOpen(true);
              }}
              onDelete={handleDeleteCompany}
              onToggleApply={handleToggleApply}
              onTrackClick={handleTrackClick}
            />
          ))}
        </div>
      ) : (
        <div className="apply-empty-box">
          <div className="apply-empty-icon">🏢</div>
          <h3>No Placement Companies Listed Yet</h3>
          <p>
            {searchQuery
              ? `No companies matching "${searchQuery}" in ${selectedDept.toUpperCase()}.`
              : isAdmin
              ? `There are no placement company links posted for ${selectedDept === 'all' ? 'any department' : selectedDept.toUpperCase()} yet. Click below to add the first opportunity.`
              : `Check back soon! Placement opportunities for ${selectedDept === 'all' ? 'your department' : selectedDept.toUpperCase()} will be posted here as soon as they open.`}
          </p>
          {isAdmin && (
            <button
              type="button"
              className="btn-add-company"
              onClick={() => {
                setEditingCompany({
                  department: selectedDept === 'all' ? 'cse' : selectedDept,
                  company_name: '',
                  role_title: '',
                  job_type: 'Full-time',
                  apply_link: '',
                  deadline: '',
                  batch_eligibility: '',
                  salary_or_stipend: '',
                  location: '',
                  description: '',
                });
                setIsModalOpen(true);
              }}
            >
              ＋ Add First Company Link
            </button>
          )}
        </div>
      )}

      {/* Admin Add/Edit Modal */}
      {isModalOpen && (
        <AddEditCompanyModal
          isOpen={isModalOpen}
          onClose={() => {
            setIsModalOpen(false);
            setEditingCompany(null);
          }}
          initialData={editingCompany}
          onSaved={handleSaveCompany}
        />
      )}
    </div>
  );
}
