import React from 'react';
import { createRoot } from 'react-dom/client';
import App from './src/App.jsx';
import { registerSW } from 'virtual:pwa-register';

const updateSW = registerSW({
  onNeedRefresh() {
    if (confirm("New version available. Reload?")) {
      updateSW(true);
    }
  }
});

const container = document.getElementById('react-root');
if (container) {
  const root = createRoot(container);
  root.render(<App />);
}
