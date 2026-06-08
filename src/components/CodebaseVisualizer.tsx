import React, { useEffect, useRef, useMemo } from 'react';
import * as d3 from 'd3';
import { LoadedFile } from '../types';

interface D3Node {
  name: string;
  children?: D3Node[];
  value?: number;
  type: 'dir' | 'file';
  path: string;
}

interface CodebaseVisualizerProps {
  files: LoadedFile[];
}

export const CodebaseVisualizer: React.FC<CodebaseVisualizerProps> = ({ files }) => {
  const svgRef = useRef<SVGSVGElement>(null);
  const wrapperRef = useRef<HTMLDivElement>(null);

  const data = useMemo(() => {
    const root: D3Node = { name: 'Workspace', path: 'Workspace', type: 'dir', children: [] };
    
    files.forEach(file => {
      // Group by layer/source first
      let currentLevel = root.children!;
      const parts = [file.source, ...file.path.split('/')];
      
      let currentPath = '';
      
      parts.forEach((part, index) => {
        const isFile = index === parts.length - 1;
        currentPath += (currentPath ? '/' : '') + part;
        
        let existingNode = currentLevel.find(n => n.name === part);
        
        if (!existingNode) {
          existingNode = {
            name: part,
            path: currentPath,
            type: isFile ? 'file' : 'dir',
            ...(isFile ? { value: file.tokens || 100 } : { children: [] })
          };
          currentLevel.push(existingNode);
        }
        
        if (!isFile) {
          currentLevel = existingNode.children!;
        }
      });
    });
    
    return root;
  }, [files]);

  useEffect(() => {
    if (!svgRef.current || !wrapperRef.current || files.length === 0) return;

    const margin = { top: 20, right: 90, bottom: 30, left: 90 };

    const svg = d3.select(svgRef.current);
    svg.selectAll("*").remove();

    const root = d3.hierarchy(data);

    // Calculate dimensions based on number of nodes and depth
    const dx = 22; // vertical spacing
    const dy = 180; // horizontal spacing between layers
    const requiredWidth = (root.height + 1) * dy;
    const width = Math.max(wrapperRef.current.clientWidth, requiredWidth + margin.left + margin.right * 2);
    
    const height = 400;
    const treeHeight = root.descendants().length * 15;
    const finalHeight = Math.max(height, treeHeight + margin.top + margin.bottom);

    const tree = d3.tree<D3Node>().nodeSize([dx, dy]);
    tree(root);

    let x0 = Infinity;
    let x1 = -x0;
    root.each(d => {
      if (d.x > x1) x1 = d.x;
      if (d.x < x0) x0 = d.x;
    });

    const g = svg.attr("viewBox", [-margin.left, x0 - margin.top, width, x1 - x0 + margin.top + margin.bottom])
                .attr("width", width)
                .attr("height", x1 - x0 + margin.top + margin.bottom)
                .append("g")
                .attr("font-family", "sans-serif")
                .attr("font-size", 10);

    const link = g.append("g")
      .attr("fill", "none")
      .attr("stroke", "#334155")
      .attr("stroke-opacity", 0.4)
      .attr("stroke-width", 1.5)
      .selectAll()
      .data(root.links())
      .join("path")
      .attr("d", d3.linkHorizontal<d3.HierarchyPointLink<D3Node>, d3.HierarchyPointNode<D3Node>>()
        .x(d => d.y)
        .y(d => d.x));

    const node = g.append("g")
      .attr("stroke-linejoin", "round")
      .attr("stroke-width", 3)
      .selectAll()
      .data(root.descendants())
      .join("g")
      .attr("transform", d => `translate(${d.y},${d.x})`);

    node.append("circle")
      .attr("fill", d => d.children ? "#38bdf8" : "#94a3b8")
      .attr("r", 3.5);

    // Background shadow/stroke for text
    node.append("text")
      .attr("dy", "0.31em")
      .attr("x", d => d.children ? -8 : 8)
      .attr("text-anchor", d => d.children ? "end" : "start")
      .text(d => d.data.name)
      .attr("stroke", "#020617")
      .attr("stroke-width", 4)
      .attr("stroke-linejoin", "round")
      .attr("fill", "none");

    // Foreground text
    node.append("text")
      .attr("dy", "0.31em")
      .attr("x", d => d.children ? -8 : 8)
      .attr("text-anchor", d => d.children ? "end" : "start")
      .text(d => d.data.name)
      .attr("fill", "#e2e8f0")
      .attr("stroke", "none")
      .style("font-weight", d => d.children ? "600" : "400");

  }, [data, files.length]);

  if (files.length === 0) return null;

  return (
    <div className="w-full bg-slate-950 border border-slate-800 rounded-lg overflow-x-auto overflow-y-auto max-h-[500px] scrollbar-thin scrollbar-thumb-slate-700 scrollbar-track-transparent" ref={wrapperRef}>
      <svg ref={svgRef} className="block text-slate-300 min-h-[300px]" />
    </div>
  );
};
