import React, { useState, useEffect } from 'react';
import { Joyride, CallBackProps, STATUS, Step } from 'react-joyride';

export function QuickStartTour() {
  const [run, setRun] = useState(false);

  useEffect(() => {
    // Check if the user has already seen the tour
    const hasSeenTour = localStorage.getItem('n-nex-quickstart-tour-completed');
    if (!hasSeenTour) {
      setRun(true);
    }
  }, []);

  const steps: Step[] = [
    {
      target: '#tour-step-1-local',
      content: 'Click here to load a local folder securely from your machine.',
      disableBeacon: true,
      title: 'Import Local Repository',
      placement: 'bottom',
    },
    {
      target: '#tour-step-2-github',
      content: 'Or, paste any public GitHub repository URL directly. N-nex will instantly analyze the tree.',
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

  const handleJoyrideCallback = (data: CallBackProps) => {
    const { status } = data;
    const finishedStatuses: string[] = [STATUS.FINISHED, STATUS.SKIPPED];

    if (finishedStatuses.includes(status)) {
      setRun(false);
      localStorage.setItem('n-nex-quickstart-tour-completed', 'true');
    }
  };

  return (
    <Joyride
      callback={handleJoyrideCallback}
      continuous={true}
      run={run}
      scrollToFirstStep={true}
      showProgress={true}
      showSkipButton={true}
      steps={steps}
      styles={{
        options: {
          arrowColor: '#0B0B0C',
          backgroundColor: '#0B0B0C',
          textColor: '#e4e4e7',
          primaryColor: '#ffffff', // Stark white like N-nex primary buttons
          overlayColor: 'rgba(0, 0, 0, 0.85)',
        },
        tooltip: {
          borderRadius: '0px', // N-nex uses harsh corners often
          padding: '24px',
          border: '1px solid #18181b', // zinc-900
        },
        tooltipContainer: {
          textAlign: 'left' as const,
        },
        tooltipTitle: {
          fontSize: '14px',
          fontWeight: '900',
          textTransform: 'uppercase',
          letterSpacing: '0.05em',
          marginBottom: '8px',
          fontFamily: 'monospace',
          color: '#ffffff',
        },
        tooltipContent: {
          fontSize: '12px',
          lineHeight: '1.6',
          fontFamily: 'monospace',
          color: '#a1a1aa'
        },
        buttonNext: {
          borderRadius: '0px',
          fontSize: '11px',
          fontWeight: 'bold',
          padding: '8px 16px',
          textTransform: 'uppercase',
          letterSpacing: '0.05em',
          backgroundColor: '#ffffff',
          color: '#000000',
        },
        buttonBack: {
          marginRight: '12px',
          color: '#71717a',
          fontSize: '11px',
          fontWeight: 'bold',
          textTransform: 'uppercase',
        },
        buttonSkip: {
          color: '#ef4444', // red-500 equivalent if you look at their reset
          fontSize: '11px',
          fontWeight: 'bold',
          textTransform: 'uppercase',
        }
      }}
    />
  );
}
