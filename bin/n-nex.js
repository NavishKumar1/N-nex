#!/usr/bin/env node

import { logError } from './logger.js';
import { handlePack } from './pack-command.js';
import { handleFetch } from './fetch-command.js';

const parseArgs = (args) => {
  const options = {
    out: null,
    clipboard: false,
    format: 'md',
    wrapper: 'system',
    preset: 'NONE',
    token: null
  };
  
  let target = null;
  const command = args[0];
  let i = 1;
  
  while (i < args.length) {
    const arg = args[i];
    if (arg === '--out' && args[i+1]) { options.out = args[++i]; }
    else if (arg === '--clipboard') { options.clipboard = true; }
    else if (arg === '--format' && args[i+1]) { options.format = args[++i]; }
    else if (arg === '--wrapper' && args[i+1]) { options.wrapper = args[++i]; }
    else if (arg === '--preset' && args[i+1]) { options.preset = args[++i]; }
    else if (arg === '--token' && args[i+1]) { options.token = args[++i]; }
    else if (!arg.startsWith('--') && !target) { target = arg; }
    i++;
  }
  
  return { command, target, options };
};

const args = process.argv.slice(2);
const { command, target, options } = parseArgs(args);

if (!command || command === 'help') {
    console.log(`
Usage: n-nex <command> [options]

Commands:
  pack <dir>      Pack a local directory into an LLM-ready format.
  fetch <url>     Fetch a remote GitHub repository and print or save it.

Options:
  --out <file>      Save to file
  --clipboard       Copy to clipboard
  --format <fmt>    Format of the output (md, txt, json) [default: md]
  --wrapper <wrap>  Wrapper type (system, chat) [default: system]
  --preset <key>    Prompt preset (NONE, BUG_FINDER, REFACTOR, UNIT_TESTS) [default: NONE]
  --token <token>   GitHub Personal Access Token for remote fetches

Examples:
  n-nex pack ./src/ --clipboard --format json
  n-nex fetch github.com/user/repo --out context.md --wrapper chat --preset REFACTOR
`);
    process.exit(0);
}

if (command === 'pack') {
  handlePack(target || '.', options);
} else if (command === 'fetch') {
  if (!target) {
    logError('Please provide a repository (e.g., github.com/user/repo)');
    process.exit(1);
  }
  handleFetch(target, options);
} else {
  logError(`Unknown command: ${command}`);
}

