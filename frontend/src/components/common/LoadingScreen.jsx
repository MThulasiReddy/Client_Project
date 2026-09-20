import React, { useEffect, useState } from 'react';

export function LoadingScreen({ message = 'Synchronizing Circuit…' }) {
  const [dots, setDots] = useState('');

  useEffect(() => {
    const interval = setInterval(() => {
      setDots((prev) => (prev.length >= 3 ? '' : prev + '.'));
    }, 400);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="loading-screen-backdrop">
      <div className="loading-container">
        <div className="circuit-orbit-wrapper">
          <div className="circuit-ring ring-outer" />
          <div className="circuit-ring ring-middle" />
          <div className="circuit-ring ring-inner" />
          <div className="circuit-core">
            <span className="circuit-emblem">◉</span>
          </div>
          <div className="circuit-pulse" />
        </div>

        <div className="loading-text-group">
          <div className="loading-brand">
            COLLEGE <span>CIRCUIT</span>
          </div>
          <p className="loading-subtitle">
            {message}
            <span className="loading-dots">{dots}</span>
          </p>
        </div>
      </div>
    </div>
  );
}
