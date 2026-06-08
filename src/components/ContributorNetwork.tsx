import React, { useEffect, useRef, useState } from 'react';
import * as d3 from 'd3';
import { Users, Activity } from 'lucide-react';

interface ContributorNetworkProps {
  repoSource: string;
  githubToken?: string;
}

interface Node extends d3.SimulationNodeDatum {
  id: string;
  group: 'author' | 'file';
  radius: number;
  name: string;
  color: string;
}

interface Link extends d3.SimulationLinkDatum<Node> {
  source: string | Node;
  target: string | Node;
  value: number;
}

export const ContributorNetwork: React.FC<ContributorNetworkProps> = ({ repoSource, githubToken }) => {
  const svgRef = useRef<SVGSVGElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let mounted = true;
    
    const fetchGraphData = async () => {
      try {
        setIsLoading(true);
        const headers: Record<string, string> = { 'Accept': 'application/vnd.github.v3+json' };
        if (githubToken) headers['Authorization'] = `Bearer ${githubToken.trim()}`;
        
        // Fetch up to 100 commits
        const res = await fetch(`https://api.github.com/repos/${repoSource}/commits?per_page=100`, { headers });
        if (!res.ok) throw new Error("Failed to fetch commit graph data");
        const commits = await res.json();
        
        // The /commits endpoint does not include files modified unless we query each commit individually.
        // Wait, yes it doesn't. /commits?per_page=100 gives list, no files array.
        // To avoid API rate limit apocalypse, we will construct a mock topological map if real files aren't easily bulk available, 
        // OR we can fetch 10-20 commits individually. Let's fetch the first 15 commits with details.
        
        // Fetch up to 30 commits with details for richer graphs
        const detailedCommits = await Promise.all(
          commits.slice(0, 30).map(async (c: any) => {
            const detailRes = await fetch(`https://api.github.com/repos/${repoSource}/commits/${c.sha}`, { headers });
            return detailRes.ok ? await detailRes.json() : null;
          })
        );
        
        if (!mounted) return;
        
        const validCommits = detailedCommits.filter(Boolean);
        
        const authorMap = new Map<string, number>();
        const fileMap = new Map<string, number>();
        const linkMap = new Map<string, number>(); // authorId-fileId -> count
        
        const getModuleCategory = (filename: string) => {
          const parts = filename.split('/');
          if (parts.length > 2 && parts[0] === 'src') return `src/${parts[1]}`;
          if (parts.length > 1) return parts[0];
          return `*.${filename.split('.').pop() || 'txt'}`;
        };

        validCommits.forEach(c => {
          const authorName = c.commit?.author?.name || 'Unknown';
          authorMap.set(authorName, (authorMap.get(authorName) || 0) + 1);
          
          if (c.files) {
            c.files.forEach((f: any) => {
              const fileGroup = getModuleCategory(f.filename);
              fileMap.set(fileGroup, (fileMap.get(fileGroup) || 0) + 1);
              
              const linkId = `${authorName}::${fileGroup}`;
              linkMap.set(linkId, (linkMap.get(linkId) || 0) + 1);
            });
          }
        });

        const nodes: Node[] = [];
        authorMap.forEach((count, name) => {
          nodes.push({ 
            id: name, name, group: 'author', 
            // Min radius 14, max radius grows logarithmically
            radius: Math.min(30, 14 + Math.log2(count + 1) * 3), 
            color: 'url(#author-grad)' 
          });
        });
        
        fileMap.forEach((count, name) => {
          nodes.push({ 
            id: name, name, group: 'file', 
            radius: Math.min(22, 6 + Math.log2(count + 1) * 2.5), 
            color: 'url(#file-grad)' 
          });
        });
        
        const links: Link[] = [];
        linkMap.forEach((count, id) => {
          const [source, target] = id.split('::');
          links.push({ source, target, value: count });
        });
        
        renderGraph(nodes, links);
        setIsLoading(false);
        
      } catch (err: any) {
        if (mounted) {
          setError(err.message);
          setIsLoading(false);
        }
      }
    };
    
    if (repoSource) fetchGraphData();
    return () => { mounted = false; };
  }, [repoSource, githubToken]);

  const renderGraph = (nodes: Node[], links: Link[]) => {
    if (!svgRef.current || !containerRef.current || nodes.length === 0) return;
    
    const width = containerRef.current.clientWidth || 600;
    const height = 400;
    
    const svg = d3.select(svgRef.current);
    svg.selectAll("*").remove();
    
    svg.attr("viewBox", [0, 0, width, height]);

    // Graph Filters and Gradients definitions
    const defs = svg.append("defs");

    const addGlow = (id: string, dev1: number, dev2: number) => {
      const filter = defs.append("filter").attr("id", id).attr("x", "-50%").attr("y", "-50%").attr("width", "200%").attr("height", "200%");
      filter.append("feGaussianBlur").attr("in", "SourceGraphic").attr("stdDeviation", dev1).attr("result", "blur1");
      if (dev2 > 0) filter.append("feGaussianBlur").attr("in", "SourceGraphic").attr("stdDeviation", dev2).attr("result", "blur2");
      const merge = filter.append("feMerge");
      if (dev2 > 0) merge.append("feMergeNode").attr("in", "blur2");
      merge.append("feMergeNode").attr("in", "blur1");
      merge.append("feMergeNode").attr("in", "SourceGraphic");
    };
    addGlow("glow-author", 4, 10);
    addGlow("glow-file", 3, 0);

    const addRadial = (id: string, c1: string, c2: string, c3: string) => {
      const grad = defs.append("radialGradient").attr("id", id).attr("cx", "30%").attr("cy", "30%").attr("r", "70%");
      grad.append("stop").attr("offset", "0%").attr("stop-color", c1);
      grad.append("stop").attr("offset", "40%").attr("stop-color", c2);
      grad.append("stop").attr("offset", "100%").attr("stop-color", c3);
    };
    addRadial("author-grad", "#fdf4ff", "#e879f9", "#86198f");
    addRadial("file-grad", "#f0f9ff", "#38bdf8", "#0369a1");
    
    // Zoom/Pan setup
    const g = svg.append("g");
    const zoom = d3.zoom<SVGSVGElement, unknown>()
      .scaleExtent([0.3, 4])
      .on("zoom", (event) => g.attr("transform", event.transform));
    svg.call(zoom as any);

    // Initial subtle animation scaling
    g.style("opacity", 0).transition().duration(1000).style("opacity", 1);
    
    const simulation = d3.forceSimulation<Node>(nodes)
      .force("link", d3.forceLink<Node, Link>(links).id(d => d.id).distance(100))
      .force("charge", d3.forceManyBody().strength(-300))
      .force("center", d3.forceCenter(width / 2, height / 2))
      .force("collide", d3.forceCollide().radius((d: any) => d.radius + 15));

    const link = g.append("g")
      .attr("stroke", "#475569")
      .attr("stroke-opacity", 0.4)
      .selectAll("line")
      .data(links)
      .join("line")
      .attr("stroke-width", d => Math.max(1, Math.sqrt(d.value) * 1.5));

    const nodeGroup = g.append("g")
      .selectAll("g")
      .data(nodes)
      .join("g")
      .attr("class", "cursor-pointer")
      .call(d3.drag<any, Node>()
        .on("start", (event, d) => {
          if (!event.active) simulation.alphaTarget(0.3).restart();
          d.fx = d.x;
          d.fy = d.y;
        })
        .on("drag", (event, d) => {
          d.fx = event.x;
          d.fy = event.y;
        })
        .on("end", (event, d) => {
          if (!event.active) simulation.alphaTarget(0);
          d.fx = null;
          d.fy = null;
        }));

    // Hover interactions
    const isConnected = (a: Node, b: Node) => {
      return a.id === b.id || links.some(l => 
        (l.source === a || (l.source as Node).id === a.id) && (l.target === b || (l.target as Node).id === b.id) || 
        (l.target === a || (l.target as Node).id === a.id) && (l.source === b || (l.source as Node).id === b.id)
      );
    };

    nodeGroup.on("mouseover", function(event, d) {
      nodeGroup.transition().duration(200).style("opacity", n => isConnected(d, n) ? 1 : 0.15);
      link.transition().duration(200)
          .style("stroke-opacity", l => (l.source as Node).id === d.id || (l.target as Node).id === d.id ? 0.8 : 0.05)
          .style("stroke", l => (l.source as Node).id === d.id || (l.target as Node).id === d.id ? (d.group === 'author' ? "#e879f9" : "#38bdf8") : "#475569");
    }).on("mouseout", function() {
      nodeGroup.transition().duration(300).style("opacity", 1);
      link.transition().duration(300).style("stroke-opacity", 0.4).style("stroke", "#475569");
    });

    nodeGroup.append("circle")
      .attr("r", d => d.radius)
      .attr("fill", d => d.color)
      .attr("filter", d => d.group === 'author' ? "url(#glow-author)" : "url(#glow-file)")
      .attr("stroke", d => d.group === 'author' ? "#fdf4ff" : "#f0f9ff")
      .attr("stroke-width", 1);

    // Label wrappers
    const labelGroup = nodeGroup.append("g").attr("transform", d => `translate(${d.radius + 8}, 0)`);
    
    // Background pill structure for text contrast
    labelGroup.append("rect")
      .attr("y", -9)
      .attr("height", 18)
      .attr("rx", 4)
      .attr("fill", "#020617")
      .attr("fill-opacity", 0.7)
      .attr("stroke", "#1e293b")
      .attr("stroke-width", 1);

    const labels = labelGroup.append("text")
      .text(d => d.name)
      .attr("y", 3)
      .attr("x", 6)
      .attr("font-size", "10px")
      .attr("font-weight", d => d.group === 'author' ? "600" : "500")
      .attr("fill", d => d.group === 'author' ? "#e879f9" : "#38bdf8")
      .style("pointer-events", "none");
      
    // Auto-size rects to text width
    labels.each(function(d: any) {
      const bbox = (this as SVGTextElement).getBBox();
      const rect = (this.parentNode as SVGGElement).querySelector("rect")!;
      rect.setAttribute("width", (bbox.width + 12).toString());
    });

    simulation.on("tick", () => {
      link
        .attr("x1", (d: any) => d.source.x)
        .attr("y1", (d: any) => d.source.y)
        .attr("x2", (d: any) => d.target.x)
        .attr("y2", (d: any) => d.target.y);

      nodeGroup.attr("transform", d => `translate(${d.x},${d.y})`);
    });
  };

  return (
    <div className="bg-slate-950 border border-slate-800 rounded-xl p-5 shadow-sm space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="text-white font-semibold text-sm flex items-center gap-2">
          <Users size={16} className="text-fuchsia-400" />
          Contributor Knowledge Galaxies
        </h3>
      </div>
      
      <div 
        ref={containerRef} 
        className="w-full h-[400px] bg-[#020617] rounded-lg border border-slate-800/50 relative overflow-hidden"
        style={{
          backgroundImage: 'radial-gradient(circle at center, rgba(30,41,59,0.5) 0%, transparent 70%), linear-gradient(rgba(255,255,255,0.02) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.02) 1px, transparent 1px)',
          backgroundSize: '100% 100%, 20px 20px, 20px 20px'
        }}
      >
        {isLoading && (
          <div className="absolute inset-0 flex flex-col items-center justify-center text-slate-500 z-10 bg-slate-950/80">
            <Activity className="w-6 h-6 animate-spin mb-3 text-fuchsia-400" />
            <span className="text-xs font-semibold">Mapping developer silos...</span>
          </div>
        )}
        {error && (
          <div className="absolute inset-0 flex items-center justify-center text-red-400 z-10 p-4 text-center text-xs">
            {error}
          </div>
        )}
        <svg ref={svgRef} className="w-full h-full text-slate-300" />
      </div>
    </div>
  );
};
