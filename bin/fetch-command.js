import fs from 'fs';
import JSZip from 'jszip';
import { logInfo, logError, logSuccess } from './logger.js';
import { fetchUrl } from './github.js';
import { generateRemoteOutput } from './formatters.js';
import { copyToClipboard } from './fs-utils.js';
import { DEFAULT_IGNORE_PATTERNS } from './constants.js';

export const handleFetch = async (targetRepo, options) => {
  logInfo(`Resolving repository: ${targetRepo}...`);
  let repoUrl = targetRepo;
  if (!repoUrl.startsWith('http')) repoUrl = 'https://' + repoUrl;
  const match = repoUrl.match(/github.com\/([^\/]+)\/([^\/]+)/);
  
  if (!match) {
      logError('Invalid GitHub URL');
      process.exit(1);
  }
  
  let owner = match[1];
  let repo = match[2];
  repo = repo.replace(/\..*/, ''); // remove .git
  
  const apiUrl = `https://api.github.com/repos/${owner}/${repo}`;
  
  try {
     const res = await fetchUrl(apiUrl, options.token);
     if (res.statusCode !== 200) {
        logError(`Repository not found or access denied. HTTP ${res.statusCode}`);
        process.exit(1);
     }
     const repoData = JSON.parse(res.body.toString());
     const defaultBranch = repoData.default_branch;
     
     logInfo(`Found repo: ${owner}/${repo} (branch: ${defaultBranch})`);
     logInfo('Fetching source tree archive...');
     
     const archiveUrl = `https://github.com/${owner}/${repo}/archive/refs/heads/${defaultBranch}.zip`;
     const archiveRes = await fetchUrl(archiveUrl, options.token);
     
     if (archiveRes.statusCode !== 200) {
         logError('Failed to fetch repository archive.');
         process.exit(1);
     }
     
     logInfo('Extracting & parsing AST map...');
     const zip = await JSZip.loadAsync(archiveRes.body);
     const output = await generateRemoteOutput(
       zip, 
       options.format, 
       options.wrapper, 
       options.preset, 
       owner, 
       repo, 
       DEFAULT_IGNORE_PATTERNS
     );
     
     let outputHandled = false;
     if (options.out) {
       fs.writeFileSync(options.out, output, 'utf8');
       logSuccess(`Saved compiled context to ${options.out}`);
       outputHandled = true;
     }
     if (options.clipboard) {
       await copyToClipboard(output);
       logSuccess(`Copied compiled context to clipboard!`);
       outputHandled = true;
     }
     
     if (!outputHandled) {
       console.log(output);
     }
  } catch(err) {
     logError(err.message);
  }
};
