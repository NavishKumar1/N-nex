import React, { useState, useEffect } from 'react';
import { BookOpen, Star, GitFork, Eye, Activity } from 'lucide-react';
import Markdown from 'react-markdown';

interface RepoSummaryProps {
  repoSource: string;
  githubToken?: string;
}

export const RepoSummary: React.FC<RepoSummaryProps> = ({ repoSource, githubToken }) => {
  const [repoData, setRepoData] = useState<any>(null);
  const [readme, setReadme] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    let mounted = true;
    const fetchRepoInfo = async () => {
      if (!repoSource || repoSource.includes('local-workspace')) {
        setIsLoading(false);
        return;
      }

      try {
        const headers: Record<string, string> = { 'Accept': 'application/vnd.github.v3+json' };
        if (githubToken) {
          headers['Authorization'] = `Bearer ${githubToken.trim()}`;
        }

        // Fetch Repo Stats
        const repoRes = await fetch(`https://api.github.com/repos/${repoSource}`, { headers });
        if (repoRes.ok) {
          const data = await repoRes.json();
          if (mounted) setRepoData(data);
        }

        // Fetch Readme
        const readmeRes = await fetch(`https://api.github.com/repos/${repoSource}/readme`, { headers });
        if (readmeRes.ok) {
          const readmeData = await readmeRes.json();
          const b64 = readmeData.content.replace(/\n/g, '');
          const decoded = decodeURIComponent(escape(window.atob(b64)));
          // Only take first 500 chars to avoid massive readomes cluttering overview
          const truncated = decoded.length > 500 ? decoded.substring(0, 500) + '...' : decoded;
          if (mounted) setReadme(truncated);
        }
      } catch (err) {
        console.error("Failed to fetch repo info", err);
      } finally {
        if (mounted) setIsLoading(false);
      }
    };

    fetchRepoInfo();
    return () => { mounted = false; };
  }, [repoSource, githubToken]);

  if (isLoading) {
    return (
      <div className="h-32 flex items-center justify-center text-slate-500 animate-pulse bg-slate-900/50 rounded-xl border border-slate-800">
        Loading overview...
      </div>
    );
  }

  if (!repoData) return null;

  return (
    <div className="bg-slate-900/50 border border-slate-800 rounded-xl p-6 shadow-sm mb-6 flex flex-col md:flex-row gap-6">
      <div className="flex-1 space-y-4">
        <div className="space-y-1">
          <h2 className="text-xl font-bold text-white flex items-center gap-2">
            <BookOpen size={20} className="text-sky-400" />
            {repoData.full_name}
          </h2>
          {repoData.description && (
            <p className="text-sm text-slate-400 leading-relaxed">
              {repoData.description}
            </p>
          )}
        </div>

        <div className="flex flex-wrap items-center gap-4 text-xs font-mono font-medium text-slate-300">
          <div className="flex items-center gap-1.5 bg-slate-950 px-3 py-1.5 rounded-lg border border-slate-800">
            <Star size={14} className="text-yellow-400" />
            {repoData.stargazers_count.toLocaleString()} Stars
          </div>
          <div className="flex items-center gap-1.5 bg-slate-950 px-3 py-1.5 rounded-lg border border-slate-800">
            <GitFork size={14} className="text-emerald-400" />
            {repoData.forks_count.toLocaleString()} Forks
          </div>
          <div className="flex items-center gap-1.5 bg-slate-950 px-3 py-1.5 rounded-lg border border-slate-800">
            <Eye size={14} className="text-indigo-400" />
            {repoData.subscribers_count.toLocaleString()} Watchers
          </div>
          {repoData.language && (
            <div className="flex items-center gap-1.5 bg-slate-950 px-3 py-1.5 rounded-lg border border-slate-800">
              <Activity size={14} className="text-fuchsia-400" />
              {repoData.language}
            </div>
          )}
        </div>
      </div>
      
      {readme && (
        <div className="flex-1 bg-slate-950 border border-slate-800/80 rounded-lg p-4 overflow-hidden relative">
          <div className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-2 border-b border-slate-800 pb-2">README Fragment</div>
          <div className="text-xs text-slate-400 leading-relaxed font-sans prose prose-invert max-w-none prose-p:my-1 prose-headings:my-2 prose-h1:text-sm prose-h2:text-sm prose-h3:text-sm">
            <Markdown>{readme}</Markdown>
          </div>
          <div className="absolute bottom-0 left-0 right-0 h-16 bg-gradient-to-t from-slate-950 to-transparent pointer-events-none"></div>
        </div>
      )}
    </div>
  );
};
