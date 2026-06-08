import React, { useState, useEffect } from 'react';
import { motion } from 'motion/react';
import { GitCommit, AlertCircle, Loader2 } from 'lucide-react';

interface ContributionDay {
  date: string;
  count: number;
}

interface ContributionWeek {
  days: ContributionDay[];
  total: number;
  week: number;
}

interface ContributionGraphProps {
  repoSource: string; // format "owner/repo"
  githubToken?: string;
}

// GitHub api returns last 52 weeks of commit activity
export const ContributionGraph: React.FC<ContributionGraphProps> = ({ repoSource, githubToken }) => {
  const [data, setData] = useState<ContributionWeek[] | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let mounted = true;

    const fetchActivity = async () => {
      setIsLoading(true);
      setError(null);
      
      let responseStatus = 0;
      try {
        const headers: Record<string, string> = {
          'Accept': 'application/vnd.github.v3+json'
        };
        if (githubToken) {
          headers['Authorization'] = `Bearer ${githubToken.trim()}`;
        }

        const response = await fetch(`https://api.github.com/repos/${repoSource}/stats/commit_activity`, { headers });
        responseStatus = response.status;
        
        if (response.status === 202) {
          // GitHub is computing the stats. Wait a bit and retry (just a simple backoff here)
          setTimeout(() => {
            if (mounted) fetchActivity();
          }, 4000);
          return;
        }

        if (!response.ok) {
          throw new Error(`Failed to fetch activity (${response.status})`);
        }

        const result: any[] = await response.json();
        
        if (mounted && Array.isArray(result) && result.length > 0) {
          // GitHub returns an array. Format mapping
          // days element: Array of 7 integers (Sunday to Saturday)
          const formattedData: ContributionWeek[] = result.map(week => {
            const startTimestamp = week.week * 1000;
            return {
              total: week.total,
              week: week.week,
              days: week.days.map((count: number, idx: number) => {
                const date = new Date(startTimestamp + idx * 86400000);
                return { count, date: date.toISOString().split('T')[0] };
              })
            };
          });
          
          setData(formattedData);
        } else if (mounted) {
          setData([]);
        }
      } catch (err: any) {
        if (mounted) {
          setError(err.message || 'Error fetching stats');
        }
      } finally {
        if (mounted && responseStatus !== 202) {
          setIsLoading(false);
        }
      }
    };

    if (repoSource) {
      fetchActivity();
    }

    return () => {
      mounted = false;
    };
  }, [repoSource, githubToken]);

  // Color mapping matching UI (sky-400 theme)
  const getColor = (count: number) => {
    if (count === 0) return 'bg-slate-800/40 rounded-[2px]';
    if (count < 3) return 'bg-sky-900 rounded-[2px]';
    if (count < 7) return 'bg-sky-700 rounded-[2px]';
    if (count < 12) return 'bg-sky-500 rounded-[2px]';
    return 'bg-sky-400 rounded-[2px]';
  };

  const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
  
  // Try to generate month labels safely aligned over columns
  const monthLabels = data ? data.map((week, i) => {
    const date = new Date(week.week * 1000);
    // Find if this is the first week in the dataset for this month
    if (i === 0) return months[date.getMonth()];
    
    const prevDate = new Date(data[i-1].week * 1000);
    if (date.getMonth() !== prevDate.getMonth()) {
      return months[date.getMonth()];
    }
    return '';
  }) : [];

  return (
    <div className="flex flex-col space-y-3">
      {isLoading ? (
        <div className="flex items-center justify-center p-8 text-slate-500 border border-slate-800/50 rounded-lg bg-slate-900/30">
          <Loader2 className="w-5 h-5 animate-spin mr-3 text-sky-400" />
          <span className="text-sm font-medium">Computing repository statistics...</span>
        </div>
      ) : error ? (
        <div className="flex items-center p-4 border border-red-500/20 bg-red-500/10 rounded-lg text-red-400 text-sm">
          <AlertCircle className="w-4 h-4 mr-2" />
          {error}
        </div>
      ) : data ? (
        <div className="p-4 sm:p-6 border border-slate-800/80 bg-slate-950 rounded-lg overflow-x-auto select-none scrollbar-thin scrollbar-thumb-slate-700 scrollbar-track-transparent">
          <div className="min-w-max mb-6 flex justify-between items-center pr-2">
            <h4 className="text-white text-sm font-semibold flex items-center gap-2">
              <GitCommit size={16} className="text-sky-400" />
              Commit Activity Canvas
              <span className="font-mono text-xs font-normal text-slate-500 ml-2 bg-slate-900 border border-slate-700 px-2 flex justify-center items-center py-0.5 rounded-md">{repoSource}</span>
            </h4>
            <div className="text-xs text-slate-500 font-medium">
               Last Year • <span className="text-white">{data.reduce((acc, curr) => acc + curr.total, 0).toLocaleString()} Commits</span>
            </div>
          </div>
          
          <div className="flex flex-col min-w-max">
            {/* Months Label Axis */}
            <div className="flex mb-2 pl-9 h-4 relative text-[10px] text-slate-400">
              {monthLabels.map((month, i) => (
                month ? (
                  <span key={i} className="absolute font-medium" style={{ left: `${(i * 15) + 36}px`, top: 0 }}>
                    {month}
                  </span>
                ) : null
              ))}
            </div>
            
            <div className="flex gap-2">
              {/* Day Label Axis */}
              <div className="flex flex-col gap-[4px] text-[10px] text-slate-400 w-8 text-right font-medium">
                <span style={{ height: '11px', lineHeight: '11px' }}></span>
                <span style={{ height: '11px', lineHeight: '11px' }}>Mon</span>
                <span style={{ height: '11px', lineHeight: '11px' }}></span>
                <span style={{ height: '11px', lineHeight: '11px' }}>Wed</span>
                <span style={{ height: '11px', lineHeight: '11px' }}></span>
                <span style={{ height: '11px', lineHeight: '11px' }}>Fri</span>
                <span style={{ height: '11px', lineHeight: '11px' }}></span>
              </div>
              
              {/* Grid Layout */}
              <div className="flex gap-[4px]">
                {data.map((week, wIndex) => (
                  <div key={week.week} className="flex flex-col gap-[4px] w-[11px]">
                    {week.days.map((day, dIndex) => (
                      <motion.div
                        initial={{ opacity: 0, scale: 0.8 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ duration: 0.2, delay: (wIndex * 0.005) }}
                        key={day.date} 
                        title={`${day.count} commits on ${new Date(day.date).toDateString()}`}
                        className={`w-[11px] h-[11px] ${getColor(day.count)} cursor-crosshair transition-all hover:ring-2 hover:ring-sky-300 hover:ring-offset-1 hover:ring-offset-slate-950 z-10`}
                      />
                    ))}
                  </div>
                ))}
              </div>
            </div>

            {/* Legend & Helpers Footer */}
            <div className="flex justify-between items-center mt-5 pl-10">
              <div className="text-[10px] text-slate-500 font-medium cursor-help hover:text-slate-400 transition-colors">
                Learn how we count contributions
              </div>
              <div className="flex items-center gap-[4px] text-[10px] text-slate-500 font-medium mr-2">
                <span className="mr-1">Less</span>
                <div className="w-[11px] h-[11px] rounded-[2px] bg-slate-800/40"></div>
                <div className="w-[11px] h-[11px] rounded-[2px] bg-sky-900"></div>
                <div className="w-[11px] h-[11px] rounded-[2px] bg-sky-700"></div>
                <div className="w-[11px] h-[11px] rounded-[2px] bg-sky-500"></div>
                <div className="w-[11px] h-[11px] rounded-[2px] bg-sky-400"></div>
                <span className="ml-1">More</span>
              </div>
            </div>
          </div>

        </div>
      ) : null}
    </div>
  );
};
