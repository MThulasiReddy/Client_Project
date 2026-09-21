import React, { useEffect, useRef, useState } from 'react';

export function Header({ user, currentView, onNavigate, onLogout }) {
  const initial = user?.name ? user.name.slice(0, 1).toUpperCase() : 'U';
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const menuRef = useRef(null);

  // Close menu when clicking outside
  useEffect(() => {
    function handleClickOutside(e) {
      if (menuRef.current && !menuRef.current.contains(e.target)) {
        setMobileMenuOpen(false);
      }
    }
    if (mobileMenuOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [mobileMenuOpen]);

  function navigate(view) {
    onNavigate(view);
    setMobileMenuOpen(false);
  }

  return (
    <header>
      <a className="logo" onClick={() => navigate(user?.is_staff ? 'admin' : 'projects')}>
        <span>◉</span> College Circuit
      </a>

      {/* Desktop nav — hidden on mobile via CSS */}
      <nav className="mainnav">
        {user?.is_staff ? (
          <>
            <button
              className={currentView === 'admin' ? 'active' : ''}
              onClick={() => navigate('admin')}
            >
              ⚙ Admin Workspace
            </button>
            <button
              className={currentView === 'apply-daily' ? 'active' : ''}
              onClick={() => navigate('apply-daily')}
            >
              💼 Apply Daily
            </button>
          </>
        ) : (
          <>
            <button
              className={currentView === 'projects' ? 'active' : ''}
              onClick={() => navigate('projects')}
            >
              My Projects
            </button>

            <button
              className={currentView === 'apply-daily' ? 'active' : ''}
              onClick={() => navigate('apply-daily')}
            >
              💼 Apply Daily
            </button>

            <button className="requestnav" onClick={() => navigate('new')}>
              + New Request
            </button>
          </>
        )}
      </nav>

      {/* Mobile nav — always visible on mobile, hidden on desktop */}
      <nav className="mobile-inline-nav">
        {user?.is_staff ? (
          <>
            <button
              className={`mobile-inline-btn${currentView === 'admin' ? ' active' : ''}`}
              onClick={() => navigate('admin')}
            >
              ⚙ Admin
            </button>
            <button
              className={`mobile-inline-btn${currentView === 'apply-daily' ? ' active' : ''}`}
              onClick={() => navigate('apply-daily')}
            >
              💼 Apply Daily
            </button>
          </>
        ) : (
          <>
            <button
              className={`mobile-inline-btn${currentView === 'projects' ? ' active' : ''}`}
              onClick={() => navigate('projects')}
            >
              📁 Projects
            </button>

            <button
              className={`mobile-inline-btn${currentView === 'apply-daily' ? ' active' : ''}`}
              onClick={() => navigate('apply-daily')}
            >
              💼 Apply Daily
            </button>

          </>
        )}
      </nav>

      <div className="user">
        {/* Avatar + name — desktop only */}
        {/* <span className="user-avatar">{initial}</span> */}
        <b className="user-name-label">{user?.name}</b>
        <button className="logout" onClick={onLogout} title="Sign out of your account">
          Log out
        </button>

        {/* Hamburger — visible only on mobile, opens profile/logout menu */}
        <button
          className="hamburger-btn"
          onClick={() => setMobileMenuOpen((prev) => !prev)}
          aria-label="Toggle account menu"
          aria-expanded={mobileMenuOpen}
        >
          <span className={`hamburger-icon ${mobileMenuOpen ? 'open' : ''}`}>
            <span />
            <span />
            <span />
          </span>
        </button>
      </div>

      {/* Mobile dropdown — profile & logout only */}
      {mobileMenuOpen && (
        <div className="mobile-menu mobile-menu-account" ref={menuRef}>
          <div className="mobile-menu-profile">
            <span className="user-avatar">{initial}</span>
            <span className="mobile-menu-username">{user?.name}</span>
          </div>

          <div className="mobile-menu-divider" />

          <button className="mobile-nav-btn logout-mobile" onClick={onLogout}>
            ↩ Log out
          </button>
        </div>
      )}
    </header>
  );
}
