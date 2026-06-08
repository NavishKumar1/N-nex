import fs from 'fs';
import path from 'path';
import { execSync } from 'child_process';
import { DEFAULT_IGNORE_PATTERNS } from './constants.js';
import { logWarning } from './logger.js';

export const getIgnorePatterns = (dirPath) => {
  const ignorePatterns = [...DEFAULT_IGNORE_PATTERNS];
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

export const isIgnored = (filePath, ignorePatterns) => {
  return ignorePatterns.some(pattern => filePath.includes(pattern));
};

export const readDirectory = (dir, ignorePatterns, fileList = []) => {
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

export const copyToClipboard = async (text) => {
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
    logWarning('Could not copy to clipboard (requires pbcopy/xclip/clip).');
    return false;
  }
  return false;
};
