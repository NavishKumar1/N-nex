import React, { useState, useEffect } from 'react';
import { AreaChart, Area, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid } from 'recharts';
import { Activity, Clock, Target } from 'lucide-react';

interface VelocityMetricsProps {
  repoSource: string;
  githubToken?: string;
}

export const VelocityMetrics: React.FC<VelocityMetricsProps> = ({ repoSource, githubToken }) => {
  const [data, setData] = useState<{name: string, commits: number}[]>([]);
  const [stats, setStats] = useState({ total: 0, peak: 0, avg: 0 });
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    let mounted = true;
    const fetchActivity = async () => {
      try {
        const headers: Record<string, string> = {
          'Accept': 'application/vnd.github.v3+json'
        };
        if (githubToken) {
          headers['Authorization'] = `Bearer ${githubToken.trim()}`;
        }

        const response = await fetch(`https://api.github.com/repos/${repoSource}/stats/commit_activity`, { headers });
        if (response.status === 202) {
          setTimeout(() => { if (mounted) fetchActivity(); }, 2000);
          return;
        }

        const result: any[] = await response.json();
        
        if (mounted && Array.isArray(result)) {
          const chartData = result.map(week => {
            const date = new Date(week.week * 1000);
            return {
              name: date.toLocaleDateString(undefined, { month: 'short' }),
              commits: week.total,
              fullDate: date.toLocaleDateString()
            };
          });
          
          let total = 0;
          let peak = 0;
          chartData.forEach(d => {
            total += d.commits;
            if (d.commits > peak) peak = d.commits;
          });
          
          setStats({ total, peak, avg: Math.round(total / (chartData.length || 1)) });
          setData(chartData);
        }
      } catch (err) {
        console.error(err);
      } finally {
        if (mounted) setIsLoading(false);
      }
    };

    if (repoSource) fetchActivity();
    return () => { mounted = false; };
  }, [repoSource, githubToken]);

  if (isLoading) {
    return <div className="h-48 flex items-center justify-center text-slate-500 animate-pulse bg-slate-900 rounded-xl">Loading metrics...</div>;
  }

  return (
    <div className="bg-slate-950 border border-slate-800 rounded-xl p-5 shadow-sm space-y-5">
      <div className="flex items-center justify-between">
        <h3 className="text-white font-semibold text-sm flex items-center gap-2">
          <Activity size={16} className="text-fuchsia-400" />
          Commit Velocity Metrics
        </h3>
      </div>
      
      <div className="flex items-center gap-6 pb-2">
        <div className="space-y-1">
          <div className="text-xs text-slate-500 uppercase tracking-wider font-semibold">Annual Pace</div>
          <div className="text-2xl text-white font-mono">{stats.total}</div>
        </div>
        <div className="space-y-1">
          <div className="text-xs text-slate-500 uppercase tracking-wider font-semibold">Peak Week</div>
          <div className="text-2xl text-fuchsia-400 font-mono">{stats.peak}</div>
        </div>
        <div className="space-y-1">
          <div className="text-xs text-slate-500 uppercase tracking-wider font-semibold">Wkly Avg</div>
          <div className="text-2xl text-sky-400 font-mono">{stats.avg}</div>
        </div>
      </div>

      <div className="h-[180px] w-full mt-4">
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart data={data} margin={{ top: 10, right: 0, left: -20, bottom: 0 }}>
            <defs>
              <linearGradient id="colorCommits" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#c026d3" stopOpacity={0.3}/>
                <stop offset="95%" stopColor="#c026d3" stopOpacity={0}/>
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" vertical={false} />
            <XAxis 
              dataKey="name" 
              stroke="#475569" 
              fontSize={10} 
              tickLine={false} 
              axisLine={false}
              interval="preserveStartEnd"
            />
            <YAxis 
              stroke="#475569" 
              fontSize={10} 
              tickLine={false} 
              axisLine={false} 
            />
            <Tooltip 
              contentStyle={{ backgroundColor: '#020617', borderColor: '#1e293b', fontSize: '12px' }}
              itemStyle={{ color: '#e2e8f0' }}
              labelStyle={{ color: '#94a3b8', marginBottom: '4px' }}
            />
            <Area 
              type="monotone" 
              dataKey="commits" 
              stroke="#e879f9" 
              strokeWidth={2}
              fillOpacity={1} 
              fill="url(#colorCommits)" 
            />
          </AreaChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};
