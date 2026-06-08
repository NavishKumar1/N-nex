const fs = require('fs');
const path = require('path');

function replaceRecursively(dir) {
  const files = fs.readdirSync(dir);
  for (const file of files) {
    const fullPath = path.join(dir, file);
    if (fs.statSync(fullPath).isDirectory()) {
      replaceRecursively(fullPath);
    } else if (fullPath.endsWith('.tsx') || fullPath.endsWith('.ts')) {
      let content = fs.readFileSync(fullPath, 'utf8');
      if (content.includes('[#020617]')) {
        content = content.replace(/background: '\n?\s*linear-gradient\([^)]*\[#020617\][^)]*\)/g, match => match); // Don't replace inside gradients if they exist
        content = content.replace(/\[#020617\]/g, 'slate-950');
        fs.writeFileSync(fullPath, content);
      }
      
      // Let's also replace other hex strings
      let content2 = fs.readFileSync(fullPath, 'utf8');
      content2 = content2.replace(/\[#38bdf8\]/g, 'sky-400');
      content2 = content2.replace(/\[#c084fc\]/g, 'purple-400');
      content2 = content2.replace(/\[#e879f9\]/g, 'fuchsia-400');
      content2 = content2.replace(/\[#10b981\]/g, 'emerald-500');
      content2 = content2.replace(/\[#0ea5e9\]/g, 'sky-500');
      content2 = content2.replace(/\[#a855f7\]/g, 'purple-500');
      fs.writeFileSync(fullPath, content2);
    }
  }
}

replaceRecursively('src');
