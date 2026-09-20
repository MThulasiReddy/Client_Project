import React from 'react';

export function Header({ user, currentView, onNavigate, onLogout }) {
  const initial = user?.name ? user.name.slice(0, 1).toUpperCase() : 'U';

  return (
    <header>
      <a className="logo" onClick={() => onNavigate('projects')}>
        <span>◉</span> College Circuit
      </a>

      <nav className="mainnav">
        <button
          className={currentView === 'projects' ? 'active' : ''}
          onClick={() => onNavigate('projects')}
        >
          My Projects
        </button>

        <button className="requestnav" onClick={() => onNavigate('new')}>
          + New Request
        </button>

        {user?.is_staff && (
          <button
            className={currentView === 'admin' ? 'active' : ''}
            onClick={() => onNavigate('admin')}
          >
            Admin Workspace
          </button>
        )}
      </nav>

      <div className="user">
        <span className="user-avatar">{initial}</span>
        <b>{user?.name}</b>
        <button className="logout" onClick={onLogout} title="Sign out of your account">
          Log out
        </button>
      </div>
    </header>
  );
}
