import React from 'react';
import { Activity } from 'lucide-react';
import { CodebaseVisualizer } from './CodebaseVisualizer';
import { RepoSummary } from './RepoSummary';
import { ContributionGraph } from './ContributionGraph';
import { VelocityMetrics } from './VelocityMetrics';
import { ContributorNetwork } from './ContributorNetwork';
import { LoadedFile } from '../types';

interface MetricsDashboardProps {
  loadedFiles: LoadedFile[];
  checklistFilteredFiles: LoadedFile[];
  activeLayers: string[];
  githubToken: string;
}

export const MetricsDashboard: React.FC<MetricsDashboardProps> = ({
  loadedFiles,
  checklistFilteredFiles,
  activeLayers,
  githubToken
}) => {
  if (loadedFiles.length === 0 && activeLayers.length === 0) return null;

  return (
    <>
      {loadedFiles.length > 0 && (
        <div className="border border-slate-800 bg-slate-900/50 rounded-xl p-4 sm:p-6 space-y-4 shadow-sm text-left">
          <div className="flex items-center gap-2 font-sans border-b border-slate-700/50 pb-4 mt-2">
            <Activity size={18} className="text-sky-400" />
            <span className="text-base text-white font-semibold">
              Codebase Topology Visualization
            </span>
          </div>
          <CodebaseVisualizer files={checklistFilteredFiles} />
        </div>
      )}

      {activeLayers.length > 0 && (
        <div className="space-y-6">
          {activeLayers.map((layer) => (
            <div key={layer} className="space-y-6">
              <RepoSummary repoSource={layer} githubToken={githubToken} />

              <ContributionGraph 
                repoSource={layer} 
                githubToken={githubToken} 
              />
              
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <VelocityMetrics repoSource={layer} githubToken={githubToken} />
                <ContributorNetwork repoSource={layer} githubToken={githubToken} />
              </div>
            </div>
          ))}
        </div>
      )}
    </>
  );
};
