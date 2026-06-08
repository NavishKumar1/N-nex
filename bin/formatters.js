import fs from 'fs';
import path from 'path';
import { PROMPT_PRESETS } from './constants.js';

export const buildTreeString = (files, baseDir) => {
  // simple visual tree
  let treeStr = '';
  const paths = files.map(f => path.relative(baseDir, f));
  for (const p of paths) {
    treeStr += `|-- ${p}\n`;
  }
  return treeStr;
};

export const applyWrapper = (text, wrapperType, presetKey) => {
  const preset = PROMPT_PRESETS[presetKey] || PROMPT_PRESETS.NONE;
  if (wrapperType === 'chat') {
    return `The following text contains a structured repository matrix map and core source code components. Please ingest this layout completely into your active memory context buffer. Do not reply or analyze yet. Simply confirm with 'SYSTEM LAYERS SYNCHRONIZED' if you understand the codebase architecture.\n\n${preset.text}${text}`;
  }
  return preset.text + text;
};

export const generateOutput = (baseDir, files, format, wrapperType, presetKey) => {
  if (format === 'json') {
    const outputFiles = [];
    let fullText = '';
    
    for (const file of files) {
      const relativePath = path.relative(baseDir, file);
      try {
        const content = fs.readFileSync(file, 'utf8');
        if (content.indexOf('\0') !== -1) continue;
        outputFiles.push({ path: relativePath, charLength: content.length });
        fullText += `## File: ${relativePath}\n\`\`\`\n${content}\n\`\`\`\n\n`;
      } catch (e) {
        // ignore
      }
    }
    const finalPayload = applyWrapper(fullText, wrapperType, presetKey);

    const jsonStructure = {
      meta: {
        app: "N-NEX CLI",
        presetDirective: (PROMPT_PRESETS[presetKey] || PROMPT_PRESETS.NONE).text,
        fileCount: outputFiles.length,
        characterCount: finalPayload.length,
        compiledAt: new Date().toISOString()
      },
      payload: finalPayload,
      files: outputFiles
    };

    return JSON.stringify(jsonStructure, null, 2);
  }

  let text = '';
  if (format === 'md') {
    text += `# N-NEX Export: ${path.basename(path.resolve(baseDir))}\n\n`;
    const tree = buildTreeString(files, baseDir);
    text += `## Repository Directory Blueprint\n\`\`\`\n${tree}\`\`\`\n\n## Code File Manifest\n\n`;
  } else {
    // txt
    text += `=== N-NEX Export: ${path.basename(path.resolve(baseDir))} ===\n\n`;
  }

  for (const file of files) {
    const ext = path.extname(file).replace('.', '') || 'txt';
    const relativePath = path.relative(baseDir, file);
    try {
      const content = fs.readFileSync(file, 'utf8');
      
      if (content.indexOf('\0') !== -1) {
          text += format === 'md' 
            ? `## File: ${relativePath}\n*(Binary or unreadable file ignored)*\n\n`
            : `File: ${relativePath}\n(Binary format ignored)\n\n`;
          continue;
      }
      
      if (format === 'md') {
        text += `## File: ${relativePath}\n\`\`\`${ext}\n${content}\n\`\`\`\n\n`;
      } else {
        text += `--- ${relativePath} ---\n${content}\n\n`;
      }
    } catch (e) {
      if (format === 'md') {
        text += `## File: ${relativePath}\n*(Error reading file)*\n\n`;
      }
    }
  }

  return applyWrapper(text, wrapperType, presetKey);
};

export const generateRemoteOutput = async (zip, format, wrapperType, presetKey, owner, repo, ignorePatterns) => {
  // We'll mimic the generateOutput logic but for zip entries
  if (format === 'json') {
    const outputFiles = [];
    let fullText = '';
    
    for (const [filename, fileData] of Object.entries(zip.files)) {
      if (!fileData.dir && !ignorePatterns.some(pattern => filename.includes(pattern))) {
        const content = await fileData.async("string");
        if (content.indexOf('\0') !== -1) continue;
        const cleanPath = filename.substring(filename.indexOf('/') + 1);
        outputFiles.push({ path: cleanPath, charLength: content.length });
        fullText += `## File: ${cleanPath}\n\`\`\`\n${content}\n\`\`\`\n\n`;
      }
    }
    const finalPayload = applyWrapper(fullText, wrapperType, presetKey);

    const jsonStructure = {
      meta: {
        app: "N-NEX CLI",
        presetDirective: (PROMPT_PRESETS[presetKey] || PROMPT_PRESETS.NONE).text,
        fileCount: outputFiles.length,
        characterCount: finalPayload.length,
        compiledAt: new Date().toISOString()
      },
      payload: finalPayload,
      files: outputFiles
    };

    return JSON.stringify(jsonStructure, null, 2);
  }

  let text = '';
  if (format === 'md') {
    text += `# N-NEX Export: ${owner}/${repo} (Remote)\n\n`;
  } else {
    // txt
    text += `=== N-NEX Export: ${owner}/${repo} (Remote) ===\n\n`;
  }

  for (const [filename, fileData] of Object.entries(zip.files)) {
    if (!fileData.dir && !ignorePatterns.some(pattern => filename.includes(pattern))) {
        const content = await fileData.async("string");
        
        if (content.indexOf('\0') !== -1) continue;
        
        const ext = path.extname(filename).replace('.', '') || 'txt';
        const cleanPath = filename.substring(filename.indexOf('/') + 1);
        
        if (format === 'md') {
          text += `## File: ${cleanPath}\n\`\`\`${ext}\n${content}\n\`\`\`\n\n`;
        } else {
          text += `--- ${cleanPath} ---\n${content}\n\n`;
        }
    }
  }

  return applyWrapper(text, wrapperType, presetKey);
};
