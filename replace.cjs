const fs = require('fs');
let content = fs.readFileSync('src/pages/Workspace.tsx', 'utf8');
content = content.replace(/\[#38bdf8\]/g, 'sky-400');
content = content.replace(/\[#c084fc\]/g, 'purple-400');
content = content.replace(/\[#e879f9\]/g, 'fuchsia-400');
fs.writeFileSync('src/pages/Workspace.tsx', content);
