import React, { useState } from 'react';
import LandingPage from './pages/LandingPage';
import Workspace from './pages/Workspace';

export default function App() {
  const [showLanding, setShowLanding] = useState(true);
  
  if (showLanding) {
    return <LandingPage onEnter={() => setShowLanding(false)} />;
  }
  
  return <Workspace onBackToLanding={() => setShowLanding(true)} />;
}
