import React, { useState } from 'react';
import LandingPage from './pages/LandingPage';
import Workspace from './pages/Workspace';
import { Docs } from './pages/Docs';
import { PrivacyPolicy } from './pages/PrivacyPolicy';
import { TermsOfUse } from './pages/TermsOfUse';

export default function App() {
  const [currentView, setCurrentView] = useState<'landing' | 'workspace' | 'docs' | 'privacy' | 'terms'>('landing');
  
  if (currentView === 'landing') {
    return (
      <LandingPage 
        onEnter={() => setCurrentView('workspace')} 
        onPrivacy={() => setCurrentView('privacy')}
        onTerms={() => setCurrentView('terms')}
      />
    );
  }
  
  if (currentView === 'docs') {
    return <Docs onBack={() => setCurrentView('landing')} />;
  }

  if (currentView === 'privacy') {
    return <PrivacyPolicy onBack={() => setCurrentView('landing')} />;
  }

  if (currentView === 'terms') {
    return <TermsOfUse onBack={() => setCurrentView('landing')} />;
  }
  
  return <Workspace onBackToLanding={() => setCurrentView('landing')} />;
}

