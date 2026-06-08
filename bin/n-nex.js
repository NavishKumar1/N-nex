#!/usr/bin/env node

import fs from 'fs';
import path from 'path';
import { execSync } from 'child_process';
import https from 'https';
import JSZip from 'jszip'; // Make sure jszip is installed or use fallback

const args = process.argv.slice(2);
const command = args[0];

const logInfo = (msg) => console.log(`\x1b[36m[N-NEX]\x1b[0m ${msg}`);
const logSuccess = (msg) => console.log(`\x1b[32m[SUCCESS]\x1b[0m ${msg}`);
const logError = (msg) => console.error(`\x1b[31m[ERROR]\x1b[0m ${msg}`);

const getIgnorePatterns = (dirPath) => {
  const ignorePatterns = ['.git', 'node_modules', 'dist', 'build', '.next', '.DS_Store', '.npm'];
  try {
    const nNexConfigPath = path.join(dirPath, 'n-nex.config.json');
    if (fs.existsSync(nNexConfigPath)) {
      const config = JSON.parse(fs.readFileSync(nNexConfigPath, 'utf8'));
      if (config.ignorePatterns) {
        ignorePatterns.push(...config.ignorePatterns.map(p => p.replace(/\/\*$/, '').replace(/\*\/$/, '').replace(/\*\*/g, '').replace(/^\//, '').replace(/\/$/, '')));
      }
    }
  } catch (e) {
    // Ignore config parse errors
  }
  return ignorePatterns;
};

const isIgnored = (filePath, ignorePatterns) => {
  return ignorePatterns.some(pattern => filePath.includes(pattern));
};

const readDirectory = (dir, ignorePatterns, fileList = []) => {
  const files = fs.readdirSync(dir);
  for (const file of files) {
    const filePath = path.join(dir, file);
    if (!isIgnored(filePath, ignorePatterns)) {
      if (fs.statSync(filePath).isDirectory()) {
        readDirectory(filePath, ignorePatterns, fileList);
      } else {
        fileList.push(filePath);
      }
    }
  }
  return fileList;
};

const generateMarkdown = (baseDir, files) => {
  let md = `# N-NEX Export: ${path.basename(path.resolve(baseDir))}\n\n`;
  for (const file of files) {
    const ext = path.extname(file).replace('.', '') || 'txt';
    const relativePath = path.relative(baseDir, file);
    try {
      const content = fs.readFileSync(file, 'utf8');
      
      // Simple binary check by looking for null bytes
      if (content.indexOf('\0') !== -1) {
          md += `## File: ${relativePath}\n*(Binary or unreadable file ignored)*\n\n`;
          continue;
      }
      
      md += `## File: ${relativePath}\n\`\`\`${ext}\n${content}\n\`\`\`\n\n`;
    } catch (e) {
      md += `## File: ${relativePath}\n*(Error reading file)*\n\n`;
    }
  }
  return md;
};

const copyToClipboard = async (text) => {
  try {
    const platform = process.platform;
    if (platform === 'darwin') {
      execSync('pbcopy', { input: text });
      return true;
    } else if (platform === 'linux') {
      execSync('xclip -selection clipboard', { input: text });
      return true;
    } else if (platform === 'win32') {
      execSync('clip', { input: text });
      return true;
    }
  } catch (e) {
    console.warn('\x1b[33m[WARN]\x1b[0m Could not copy to clipboard (requires pbcopy/xclip/clip).');
    return false;
  }
  return false;
};

const fetchUrl = (url) => new Promise((resolve, reject) => {
  https.get(url, { headers: { 'User-Agent': 'N-NEX-CLI' } }, (res) => {
    
    if (res.statusCode >= 300 && res.statusCode < 400 && res.headers.location) {
        return fetchUrl(res.headers.location).then(resolve).catch(reject);
    }
    
    let data = [];
    res.on('data', (chunk) => data.push(chunk));
    res.on('end', () => resolve({ statusCode: res.statusCode, body: Buffer.concat(data) }));
  }).on('error', reject);
});

const generateRemoteMarkdown = async (buffer, owner, repo) => {
    let md = `# N-NEX Export: ${owner}/${repo} (Remote)\n\n`;
    const zip = await JSZip.loadAsync(buffer);
    const ignorePatterns = ['.git', 'node_modules', 'dist', 'build', '.png', '.jpg', '.jpeg', '.gif', '.svg', '.mp4', '.mp3', '.ttf', '.woff', '.woff2'];
    
    for (const [filename, fileData] of Object.entries(zip.files)) {
        if (!fileData.dir && !isIgnored(filename, ignorePatterns)) {
            const content = await fileData.async("string");
            
            if (content.indexOf('\0') !== -1) continue;
            
            const ext = path.extname(filename).replace('.', '') || 'txt';
            // remove root folder
            const cleanPath = filename.substring(filename.indexOf('/') + 1);
            md += `## File: ${cleanPath}\n\`\`\`${ext}\n${content}\n\`\`\`\n\n`;
        }
    }
    return md;
};

async function main() {
  if (!command || command === 'help') {
    console.log(`
Usage: n-nex <command> [options]

Commands:
  pack <dir>      Pack a local directory into an LLM-ready markdown format.
                  Options:
                    --out <file.md>   Save to file
                    --clipboard       Copy to clipboard

  fetch <url>     Fetch a remote GitHub repository and print or save it.
                  Options:
                    --out <file.md>   Save to file
                    --clipboard       Copy to clipboard

Examples:
  n-nex pack ./src/ --clipboard
  n-nex fetch github.com/user/repo --out context.md
`);
    process.exit(0);
  }

  if (command === 'pack') {
    const targetDir = args[1] && !args[1].startsWith('--') ? args[1] : '.';
    const outIndex = args.indexOf('--out');
    const outPath = outIndex > -1 ? args[outIndex + 1] : null;
    const toClipboard = args.includes('--clipboard');

    const fullPath = path.resolve(targetDir);
    if (!fs.existsSync(fullPath)) {
      logError(`Directory not found: ${fullPath}`);
      process.exit(1);
    }

    logInfo(`Packing directory: ${fullPath}`);
    const ignorePatterns = getIgnorePatterns(fullPath);
    const files = readDirectory(fullPath, ignorePatterns);
    
    logInfo(`Processed ${files.length} valid source files.`);
    const markdown = generateMarkdown(fullPath, files);

    let outputHandled = false;
    if (outPath) {
      fs.writeFileSync(outPath, markdown, 'utf8');
      logSuccess(`Saved AST payload to ${outPath}`);
      outputHandled = true;
    }
    
    if (toClipboard) {
      const success = await copyToClipboard(markdown);
      if (success) {
        logSuccess(`Copied context to clipboard!`);
      }
      outputHandled = true;
    }

    if (!outputHandled) {
      console.log(markdown);
    }
  } 
  else if (command === 'fetch') {
    let targetRepo = args[1] && !args[1].startsWith('--') ? args[1] : null;
    if (!targetRepo) {
      logError(`Please provide a repository (e.g., github.com/user/repo)`);
      process.exit(1);
    }
    
    const outIndex = args.indexOf('--out');
    const outPath = outIndex > -1 ? args[outIndex + 1] : null;
    const toClipboard = args.includes('--clipboard');

    logInfo(`Resolving repository: ${targetRepo}...`);
    if (!targetRepo.startsWith('http')) targetRepo = 'https://' + targetRepo;
    const match = targetRepo.match(/github.com\/([^\/]+)\/([^\/]+)/);
    
    if (!match) {
        logError('Invalid GitHub URL');
        process.exit(1);
    }
    
    let owner = match[1];
    let repo = match[2];
    repo = repo.replace(/\..*/, ''); // remove .git
    
    const apiUrl = `https://api.github.com/repos/${owner}/${repo}`;
    
    try {
       const res = await fetchUrl(apiUrl);
       if (res.statusCode !== 200) {
          logError(`Repository not found or access denied.`);
          process.exit(1);
       }
       const repoData = JSON.parse(res.body.toString());
       const defaultBranch = repoData.default_branch;
       
       logInfo(`Found repo: ${owner}/${repo} (branch: ${defaultBranch})`);
       logInfo('Fetching source tree archive...');
       
       const archiveUrl = `https://github.com/${owner}/${repo}/archive/refs/heads/${defaultBranch}.zip`;
       const archiveRes = await fetchUrl(archiveUrl);
       
       if (archiveRes.statusCode !== 200) {
           logError('Failed to fetch repository archive.');
           process.exit(1);
       }
       
       logInfo('Extracting & parsing AST map...');
       const markdown = await generateRemoteMarkdown(archiveRes.body, owner, repo);
       
       let outputHandled = false;
       if (outPath) {
         fs.writeFileSync(outPath, markdown, 'utf8');
         logSuccess(`Saved compiled context to ${outPath}`);
         outputHandled = true;
       }
       if (toClipboard) {
         await copyToClipboard(markdown);
         logSuccess(`Copied compiled context to clipboard!`);
         outputHandled = true;
       }
       
       if (!outputHandled) {
         console.log(markdown);
       }
    } catch(err) {
       logError(err.message);
    }
  } else {
    logError(`Unknown command: ${command}`);
  }
}

main();
