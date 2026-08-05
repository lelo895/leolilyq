import React, { useEffect } from 'react';
import Loader from './components/Loader.jsx';
import Navigation from './components/Navigation.jsx';
import SplashScreen from './components/SplashScreen.jsx';
import Notebook from './components/Notebook.jsx';
import DetailsModal from './components/DetailsModal.jsx';
import KineticDots from './components/KineticDots.jsx';
import { initVanillaApp } from '../js/main.js';

export default function App() {
  useEffect(() => {
    // Run the existing vanilla logic once the React app mounts
    initVanillaApp();
  }, []);

  return (
    <>
      <KineticDots radius={100} strength={1.5} style={{ zIndex: -1000 }} />
      <Loader />
      <Navigation />
      <main>
        <SplashScreen />
        <Notebook />
        <DetailsModal />
      </main>
      <div className="copyright-footer">
        &copy; 2026 Leo Li, All rights reserved
      </div>
    </>
  );
}

