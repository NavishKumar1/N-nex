import React, { useState, useEffect } from 'react';
import { Joyride, STATUS } from 'react-joyride';

export function QuickStartTour() {
  const [run, setRun] = useState(false);

  useEffect(() => {
    // Check if the user has already seen the tour
    const hasSeenTour = localStorage.getItem('n-nex-quickstart-tour-completed');
    if (!hasSeenTour) {
      setRun(true);
    }
  }, []);

  const steps: any[] = [
    {
      target: '#tour-step-2-github',
      content: 'Paste any public GitHub repository URL directly. Workspace will instantly analyze the tree.',
      disableBeacon: true,
      title: 'Remote Repository Fetch',
      placement: 'bottom',
    },
    {
      target: '#tour-step-3-compile',
      content: 'Once ready, overwrite your active matrix buffers. This efficiently loads all raw source files.',
      title: 'Compile Matrix',
      placement: 'top',
    },
    {
      target: '#tour-step-4-preset',
      content: 'Select an AI prompt preset to prepend instructions for the compiled context.',
      title: 'Prompt Engineer Context',
      placement: 'top',
    },
  ];

  const handleJoyrideCallback = (data: any) => {
    const { status } = data;
    const finishedStatuses: string[] = [STATUS.FINISHED, STATUS.SKIPPED];

    if (finishedStatuses.includes(status)) {
      setRun(false);
      localStorage.setItem('n-nex-quickstart-tour-completed', 'true');
    }
  };

  const JoyrideAny = Joyride as any;

  return (
    <JoyrideAny
      callback={handleJoyrideCallback}
      continuous={true}
      run={run}
      scrollToFirstStep={true}
      showProgress={true}
      showSkipButton={true}
      steps={steps}
      styles={({
        options: {
          arrowColor: '#0f172a', // slate-900
          backgroundColor: '#0f172a', 
          textColor: '#f8fafc', // slate-50
          primaryColor: '#38bdf8', // sky-400
          overlayColor: 'rgba(2, 6, 23, 0.85)', // slate-950 with opacity
        },
        tooltip: {
          borderRadius: '12px',
          padding: '24px',
          border: '1px solid #1e293b', // slate-800
        },
        tooltipContainer: {
          textAlign: 'left' as const,
        },
        tooltipTitle: {
          fontSize: '15px',
          fontWeight: '700',
          textTransform: 'none',
          letterSpacing: '0',
          marginBottom: '8px',
          fontFamily: 'Space Grotesk, sans-serif',
          color: '#ffffff',
        },
        tooltipContent: {
          fontSize: '13px',
          lineHeight: '1.6',
          fontFamily: 'Inter, sans-serif',
          color: '#94a3b8' // slate-400
        },
        buttonNext: {
          borderRadius: '6px',
          fontSize: '12px',
          fontWeight: '600',
          padding: '8px 16px',
          textTransform: 'none',
          letterSpacing: '0',
          backgroundColor: '#38bdf8', // sky-400
          color: '#020617', // slate-950
        },
        buttonBack: {
          marginRight: '12px',
          color: '#94a3b8',
          fontSize: '12px',
          fontWeight: '500',
          textTransform: 'none',
        },
        buttonSkip: {
          color: '#94a3b8',
          fontSize: '12px',
          fontWeight: '500',
          textTransform: 'none',
        }
      }) as any}
    />
  );
}
