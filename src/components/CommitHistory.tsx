import React, { useState, useEffect } from 'react';
import { motion } from 'motion/react';
import { GitCommit, Github, FileCode2, Code, ArrowRight, GitBranch, Terminal, ExternalLink, Activity, Plus, Minus, FileText } from 'lucide-react';

interface Commit {
  sha: string;
  commit: {
    author: {
      name: string;
      date: string;
    };
    message: string;
  };
  html_url: string;
  author?: {
    avatar_url: string;
    login: string;
  };
}

interface CommitDetails {
  sha: string;
  files: {
    filename: string;
    status: string;
    additions: number;
    deletions: number;
    changes: number;
    patch?: string; // Unified diff chunk
  }[];
  stats: {
    total: number;
    additions: number;
    deletions: number;
  };
}

interface CommitHistoryProps {
  repoSource: string;
  githubToken?: string;
  onClose?: () => void;
}

export const CommitHistory: React.FC<CommitHistoryProps> = ({ repoSource, githubToken, onClose }) => {
  const [commits, setCommits] = useState<Commit[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isFetchingMore, setIsFetchingMore] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  
  // Specific commit details selection
  const [selectedCommitSha, setSelectedCommitSha] = useState<string | null>(null);
  const [commitDetails, setCommitDetails] = useState<Record<string, CommitDetails>>({});
  const [loadingDetails, setLoadingDetails] = useState<Record<string, boolean>>({});

  useEffect(() => {
    let mounted = true;
    const fetchCommits = async () => {
      try {
        setIsLoading(true);
        setError(null);
        
        const headers: Record<string, string> = {
          'Accept': 'application/vnd.github.v3+json'
        };
        if (githubToken) {
          headers['Authorization'] = `Bearer ${githubToken.trim()}`;
        }
        
        // Fetch last 30 commits
        const response = await fetch(`https://api.github.com/repos/${repoSource}/commits?per_page=30&page=1`, { headers });
        if (!response.ok) {
          throw new Error(`Failed to fetch commits (${response.status})`);
        }
        
        const data = await response.json();
        if (mounted) {
          setCommits(data);
          setPage(1);
          setHasMore(data.length === 30);
        }
      } catch (err: any) {
        if (mounted) setError(err.message || 'Error occurred fetching commits');
      } finally {
        if (mounted) setIsLoading(false);
      }
    };
    
    fetchCommits();
    return () => { mounted = false; };
  }, [repoSource, githubToken]);

  const loadMoreCommits = async () => {
    if (isFetchingMore || !hasMore) return;
    
    try {
      setIsFetchingMore(true);
      const nextPage = page + 1;
      
      const headers: Record<string, string> = {
        'Accept': 'application/vnd.github.v3+json'
      };
      if (githubToken) {
        headers['Authorization'] = `Bearer ${githubToken.trim()}`;
      }
      
      const response = await fetch(`https://api.github.com/repos/${repoSource}/commits?per_page=30&page=${nextPage}`, { headers });
      if (!response.ok) {
        throw new Error(`Failed to fetch commits (${response.status})`);
      }
      
      const data = await response.json();
      setCommits(prev => [...prev, ...data]);
      setPage(nextPage);
      setHasMore(data.length === 30);
    } catch (err: any) {
      setError(err.message || 'Error occurred fetching more commits');
    } finally {
      setIsFetchingMore(false);
    }
  };

  const loadCommitDetails = async (sha: string) => {
    if (commitDetails[sha]) {
      setSelectedCommitSha(selectedCommitSha === sha ? null : sha);
      return;
    }
    
    setLoadingDetails(prev => ({ ...prev, [sha]: true }));
    setSelectedCommitSha(sha);
    
    try {
      const headers: Record<string, string> = {
          'Accept': 'application/vnd.github.v3+json'
      };
      if (githubToken) headers['Authorization'] = `Bearer ${githubToken.trim()}`;
      
      const response = await fetch(`https://api.github.com/repos/${repoSource}/commits/${sha}`, { headers });
      if (!response.ok) throw new Error('Failed to fetch commit details');
      
      const data = await response.json();
      setCommitDetails(prev => ({
        ...prev,
        [sha]: {
          sha: data.sha,
          files: data.files || [],
          stats: data.stats
        }
      }));
    } catch (err) {
      console.error(err);
    } finally {
      setLoadingDetails(prev => ({ ...prev, [sha]: false }));
    }
  };

  if (isLoading) {
    return (
      <div className="flex flex-col items-center justify-center p-12 text-slate-500 bg-slate-900/50 rounded-xl border border-slate-800">
        <Activity className="w-8 h-8 animate-spin mb-4 text-sky-400" />
        <span className="text-sm font-semibold text-slate-300">Fetching commit timeline...</span>
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-6 bg-red-500/10 border border-red-500/20 text-red-400 rounded-xl flex items-center justify-center font-medium">
        {error}
      </div>
    );
  }

  return (
    <div className="flex flex-col h-full space-y-4">
      <div className="flex items-center justify-between bg-slate-950 border border-slate-800 p-4 rounded-xl shadow-sm">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-lg bg-sky-900/50 border border-sky-400/20 flex items-center justify-center">
            <GitBranch className="text-sky-400" size={20} />
          </div>
          <div>
            <h3 className="text-white font-semibold text-sm">Commit History stream</h3>
            <div className="text-xs text-slate-400 flex items-center gap-2 mt-0.5">
              <Github size={12} /> {repoSource} <span className="opacity-50">/</span> branch: <span className="font-mono text-sky-400">main</span>
            </div>
          </div>
        </div>
        <div className="text-[10px] uppercase tracking-widest font-bold text-slate-500">
          Showing {commits.length} Commits
        </div>
      </div>

      <div className="flex-1 overflow-y-auto space-y-3 px-1 scrollbar-thin scrollbar-thumb-slate-700 scrollbar-track-transparent">
        {commits.map((commit, index) => {
          const isSelected = selectedCommitSha === commit.sha;
          const details = commitDetails[commit.sha];
          const isDetailsLoading = loadingDetails[commit.sha];

          return (
            <motion.div 
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.03 }}
              key={commit.sha} 
              className={`border transition-all rounded-xl overflow-hidden ${isSelected ? 'border-sky-500/50 bg-slate-900/80 shadow-[0_0_15px_rgba(56,189,248,0.05)]' : 'border-slate-800 bg-slate-950 hover:border-slate-600'}`}
            >
              <div 
                className="p-4 cursor-pointer flex items-start gap-4"
                onClick={() => loadCommitDetails(commit.sha)}
              >
                <div className="mt-1">
                  {commit.author?.avatar_url ? (
                    <img src={commit.author.avatar_url} alt="author" className="w-8 h-8 rounded-full border border-slate-700" />
                  ) : (
                    <div className="w-8 h-8 rounded-full bg-slate-800 border border-slate-700 flex items-center justify-center">
                      <Terminal size={14} className="text-slate-400" />
                    </div>
                  )}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between mb-1">
                    <div className="text-white font-semibold text-sm truncate pr-4">
                      {commit.commit.message.split('\n')[0]}
                    </div>
                    <div className="text-xs font-mono text-slate-500 bg-slate-900 px-2 py-0.5 rounded border border-slate-800 shrink-0">
                      {commit.sha.substring(0, 7)}
                    </div>
                  </div>
                  <div className="flex items-center text-xs text-slate-400 gap-2">
                    <span className="font-medium text-slate-300">{commit.commit.author.name}</span>
                    <span>committed on</span>
                    <span>{new Date(commit.commit.author.date).toLocaleDateString(undefined, { month: 'short', day: 'numeric', year: 'numeric' })}</span>
                  </div>
                </div>
              </div>

              {/* Expanded Diff/Code Layer */}
              {isSelected && (
                <motion.div 
                  initial={{ height: 0, opacity: 0 }}
                  animate={{ height: 'auto', opacity: 1 }}
                  className="border-t border-slate-800 bg-slate-950/30"
                >
                  {isDetailsLoading ? (
                    <div className="p-8 flex justify-center">
                      <Activity className="w-5 h-5 text-sky-400 animate-spin" />
                    </div>
                  ) : details ? (
                    <div className="p-4 space-y-4">
                      {/* Meta Statistics Row */}
                      <div className="flex items-center gap-4 text-xs">
                        <div className="flex items-center gap-1.5 text-slate-400 bg-slate-900 px-3 py-1.5 rounded-lg border border-slate-800">
                          <FileCode2 size={14} />
                          <span>{details.files.length} changed files</span>
                        </div>
                        <div className="flex items-center gap-1.5 text-emerald-400 font-medium bg-emerald-400/10 px-3 py-1.5 rounded-lg border border-emerald-400/20">
                          <Plus size={14} />
                          <span>{details.stats.additions}</span>
                        </div>
                        <div className="flex items-center gap-1.5 text-red-400 font-medium bg-red-400/10 px-3 py-1.5 rounded-lg border border-red-400/20">
                          <Minus size={14} />
                          <span>{details.stats.deletions}</span>
                        </div>
                        <a 
                          href={commit.html_url} 
                          target="_blank" 
                          referrerPolicy="no-referrer"
                          className="ml-auto flex items-center gap-1 text-sky-400 hover:text-sky-300 font-medium"
                        >
                          View on GitHub <ExternalLink size={12} />
                        </a>
                      </div>

                      {/* File Changes List */}
                      <div className="space-y-3">
                        {details.files.map((file, i) => (
                          <div key={i} className="border border-slate-800 rounded-lg overflow-hidden bg-slate-950">
                            <div className="flex items-center justify-between p-2.5 bg-slate-900 border-b border-slate-800">
                              <div className="flex items-center gap-2 max-w-[80%]">
                                <FileText size={14} className="text-slate-400 shrink-0" />
                                <span className="text-xs text-slate-300 font-mono truncate">{file.filename}</span>
                              </div>
                              <div className="flex gap-2 text-xs font-mono">
                                {file.additions > 0 && <span className="text-emerald-400">+{file.additions}</span>}
                                {file.deletions > 0 && <span className="text-red-400">-{file.deletions}</span>}
                              </div>
                            </div>
                            
                            {/* Diff viewer */}
                            {file.patch ? (
                              <div className="overflow-x-auto p-3 text-[10px] sm:text-xs font-mono leading-relaxed bg-[#0d1117] text-slate-300">
                                <pre>
                                  {file.patch.split('\n').map((line, lIdx) => {
                                    let lineClass = "px-2 rounded-sm ";
                                    if (line.startsWith('+')) lineClass += "bg-emerald-500/20 text-emerald-300";
                                    else if (line.startsWith('-')) lineClass += "bg-red-500/20 text-red-300";
                                    else if (line.startsWith('@@')) lineClass += "text-sky-400 bg-sky-500/10 py-0.5 my-0.5 inline-block";
                                    
                                    return (
                                      <div key={lIdx} className={lineClass}>
                                        {line === '' ? ' ' : line}
                                      </div>
                                    )
                                  })}
                                </pre>
                              </div>
                            ) : (
                              <div className="p-3 text-xs text-slate-500 italic bg-[#0d1117] text-center">
                                Binary file or large diff hidden
                              </div>
                            )}
                          </div>
                        ))}
                      </div>
                    </div>
                  ) : null}
                </motion.div>
              )}
            </motion.div>
          );
        })}
        
        {hasMore && (
          <div className="pt-2 pb-6 flex justify-center">
            <button
              onClick={loadMoreCommits}
              disabled={isFetchingMore}
              className="flex items-center gap-2 px-6 py-2.5 rounded-full text-xs font-semibold bg-slate-900 text-slate-300 border border-slate-700 hover:bg-slate-800 hover:text-white transition-all disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isFetchingMore ? (
                <>
                  <Activity size={14} className="animate-spin text-sky-400" />
                  Loading past commits...
                </>
              ) : (
                <>
                  <GitBranch size={14} className="text-sky-400" />
                  See older commits
                </>
              )}
            </button>
          </div>
        )}
      </div>
    </div>
  );
};
