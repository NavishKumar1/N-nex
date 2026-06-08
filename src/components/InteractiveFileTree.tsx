import React, { useMemo, useState } from 'react';
import { ChevronRight, ChevronDown, Folder, FolderOpen, File, Check } from 'lucide-react';
import { LoadedFile } from '../types';

interface FileNode {
  type: 'file';
  name: string;
  file: LoadedFile;
  key: string;
  tokens: number;
}

interface DirNode {
  type: 'dir';
  name: string;
  path: string;
  children: Record<string, TreeNode>;
  tokens: number;
  allFileKeys: string[];
}

type TreeNode = FileNode | DirNode;

interface InteractiveFileTreeProps {
  files: LoadedFile[];
  uncheckedFiles: Set<string>;
  onToggleFile: (fileKey: string, checked: boolean) => void;
  onToggleDirectory: (fileKeys: string[], checked: boolean) => void;
  searchQuery: string;
}

const FileTreeNode = ({ 
  node, 
  uncheckedFiles, 
  onToggleFile, 
  onToggleDirectory,
  depth = 0,
  defaultExpanded = false
}: { 
  node: TreeNode;
  uncheckedFiles: Set<string>;
  onToggleFile: (key: string, checked: boolean) => void;
  onToggleDirectory: (keys: string[], checked: boolean) => void;
  depth?: number;
  defaultExpanded?: boolean;
}) => {
  const [isExpanded, setIsExpanded] = useState(defaultExpanded || depth < 1);

  if (node.type === 'file') {
    const isChecked = !uncheckedFiles.has(node.key);
    return (
      <div className="flex items-center justify-between hover:bg-slate-800/40 transition-colors py-1.5 px-2 rounded-md group" style={{ paddingLeft: `${depth * 16 + 8}px` }}>
        <div className="flex items-center gap-2 max-w-[80%]">
          <button 
            type="button"
            role="checkbox"
            aria-checked={isChecked}
            onClick={() => onToggleFile(node.key, !isChecked)}
            className={`w-3.5 h-3.5 border transition-colors flex items-center justify-center rounded-[3px] shrink-0 ${
              isChecked 
                ? 'border-sky-400 bg-sky-400 text-slate-950' 
                : 'border-slate-600 bg-transparent group-hover:border-slate-400'
            }`}
          >
            {isChecked && <Check size={10} strokeWidth={3} />}
          </button>
          <File size={14} className="text-slate-500 shrink-0" />
          <span className={`truncate text-sm ${isChecked ? 'text-slate-300' : 'text-slate-500 line-through'}`}>
            {node.name}
          </span>
        </div>
        <span className={`text-[10px] font-mono shrink-0 ${isChecked ? 'text-slate-500' : 'text-slate-600'}`}>
          {node.tokens.toLocaleString()} t
        </span>
      </div>
    );
  }

  // Directory handling
  const allChecked = node.allFileKeys.every(k => !uncheckedFiles.has(k));
  const someChecked = !allChecked && node.allFileKeys.some(k => !uncheckedFiles.has(k));
  
  const entries = Object.values(node.children).sort((a, b) => {
    // Directories first
    if (a.type === 'dir' && b.type === 'file') return -1;
    if (a.type === 'file' && b.type === 'dir') return 1;
    return a.name.localeCompare(b.name);
  });

  return (
    <div className="flex flex-col">
      <div className="flex items-center justify-between hover:bg-slate-800/40 transition-colors py-1.5 px-2 rounded-md group" style={{ paddingLeft: `${depth * 16 + 8}px` }}>
        <div className="flex items-center gap-2 max-w-[80%]">
          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              onToggleDirectory(node.allFileKeys, !allChecked);
            }}
            className={`w-3.5 h-3.5 border transition-colors flex items-center justify-center rounded-[3px] shrink-0 ${
              allChecked 
                ? 'border-sky-400 bg-sky-400 text-slate-950' 
                : someChecked
                  ? 'border-sky-400 bg-sky-400/30'
                  : 'border-slate-600 bg-transparent group-hover:border-slate-400'
            }`}
          >
            {allChecked && <Check size={10} strokeWidth={3} />}
            {someChecked && !allChecked && <div className="w-1.5 h-1.5 bg-sky-400 rounded-[1px]" />}
          </button>
          
          <button 
            type="button"
            className="flex items-center gap-1.5 hover:text-white text-slate-300 truncate text-sm transition-colors w-full text-left"
            onClick={() => setIsExpanded(!isExpanded)}
          >
            {isExpanded ? <ChevronDown size={14} className="text-slate-500 shrink-0" /> : <ChevronRight size={14} className="text-slate-500 shrink-0" />}
            {isExpanded ? <FolderOpen size={14} className="text-sky-400 shrink-0" /> : <Folder size={14} className="text-sky-400 shrink-0" />}
            <span className="truncate font-medium">{node.name}</span>
          </button>
        </div>
        <span className="text-[10px] font-mono text-slate-600 shrink-0">
          {node.tokens.toLocaleString()} t
        </span>
      </div>

      {isExpanded && (
        <div className="flex flex-col">
          {entries.map(child => (
            <FileTreeNode 
              key={child.type === 'file' ? child.key : child.path} 
              node={child}
              uncheckedFiles={uncheckedFiles}
              onToggleFile={onToggleFile}
              onToggleDirectory={onToggleDirectory}
              depth={depth + 1}
              defaultExpanded={defaultExpanded}
            />
          ))}
        </div>
      )}
    </div>
  );
};

export const InteractiveFileTree: React.FC<InteractiveFileTreeProps> = ({
  files,
  uncheckedFiles,
  onToggleFile,
  onToggleDirectory,
  searchQuery
}) => {
  const tree = useMemo(() => {
    const root: Record<string, DirNode> = {}; // source layer is root

    files.forEach(file => {
      const fileKey = `${file.source}:${file.path}`;
      const tokens = file.tokens || 0;
      
      if (!root[file.source]) {
        root[file.source] = {
          type: 'dir',
          name: file.source,
          path: file.source,
          children: {},
          tokens: 0,
          allFileKeys: []
        };
      }
      
      let currentDir = root[file.source];
      currentDir.tokens += tokens;
      currentDir.allFileKeys.push(fileKey);

      const parts = file.path.split('/');
      const fileName = parts.pop()!;
      let currentPath = file.source;

      for (const part of parts) {
        currentPath += `/${part}`;
        if (!currentDir.children[part]) {
          currentDir.children[part] = {
            type: 'dir',
            name: part,
            path: currentPath,
            children: {},
            tokens: 0,
            allFileKeys: []
          };
        }
        currentDir = currentDir.children[part] as DirNode;
        currentDir.tokens += tokens;
        currentDir.allFileKeys.push(fileKey);
      }

      currentDir.children[fileName] = {
        type: 'file',
        name: fileName,
        file,
        key: fileKey,
        tokens
      };
    });

    return root;
  }, [files]);

  if (files.length === 0) {
    return (
      <div className="py-8 text-center text-slate-500 font-medium text-xs">
        No matched files in active search filter views.
      </div>
    );
  }

  const isSearching = searchQuery.trim().length > 0;

  return (
    <div className="flex flex-col font-sans">
      {Object.values(tree).map(sourceRoot => (
        <div key={sourceRoot.path} className="mb-2 last:mb-0">
          <div className="px-2 py-1.5 bg-slate-900 border-b border-slate-800 text-[10px] font-bold tracking-widest text-sky-400 uppercase rounded-t-md">
            LAYER // {sourceRoot.name}
          </div>
          <div className="py-1">
            {Object.values(sourceRoot.children)
              .sort((a, b) => {
                if (a.type === 'dir' && b.type === 'file') return -1;
                if (a.type === 'file' && b.type === 'dir') return 1;
                return a.name.localeCompare(b.name);
              })
              .map(child => (
                <FileTreeNode 
                  key={child.type === 'file' ? child.key : child.path} 
                  node={child}
                  uncheckedFiles={uncheckedFiles}
                  onToggleFile={onToggleFile}
                  onToggleDirectory={onToggleDirectory}
                  depth={0}
                  defaultExpanded={isSearching}
                />
              ))
            }
          </div>
        </div>
      ))}
    </div>
  );
};
