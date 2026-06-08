import fs from 'fs';
import path from 'path';
import { logInfo, logError, logSuccess } from './logger.js';
import { getIgnorePatterns, readDirectory, copyToClipboard } from './fs-utils.js';
import { generateOutput } from './formatters.js';

export const handlePack = async (targetDir, options) => {
  const fullPath = path.resolve(targetDir);
  if (!fs.existsSync(fullPath)) {
    logError(`Directory not found: ${fullPath}`);
    process.exit(1);
  }

  logInfo(`Packing directory: ${fullPath}`);
  const ignorePatterns = getIgnorePatterns(fullPath);
  const files = readDirectory(fullPath, ignorePatterns);
  
  logInfo(`Processed ${files.length} valid source files.`);
  const output = generateOutput(fullPath, files, options.format, options.wrapper, options.preset);

  let outputHandled = false;
  if (options.out) {
    fs.writeFileSync(options.out, output, 'utf8');
    logSuccess(`Saved payload to ${options.out}`);
    outputHandled = true;
  }
  
  if (options.clipboard) {
    const success = await copyToClipboard(output);
    if (success) {
      logSuccess(`Copied context to clipboard!`);
    }
    outputHandled = true;
  }

  if (!outputHandled) {
    console.log(output);
  }
};
