const fs = require('fs');
const path = require('path');

const targetDir = '/Users/chloe/WebsiteEventAdmin/src/app/admin';

function replaceInFile(filePath) {
  let content = fs.readFileSync(filePath, 'utf8');
  let original = content;

  // Xử lý text
  content = content.replace(/text-\[\#FFFFFF\]/g, 'text-admin-text');
  // text-white nhưng không phải text-white/50 hay name
  content = content.replace(/(?<!-|\w)text-white(?![\/\w])/g, 'text-admin-text');
  content = content.replace(/text-\[\#8A8F98\]/g, 'text-admin-text-muted');

  // Xử lý background Card
  content = content.replace(/bg-\[\#0D0716\](\/\d+)?/g, 'bg-admin-panel$1');
  
  // Xử lý background Main
  content = content.replace(/bg-\[\#060010\](\/\d+)?/g, 'bg-admin-bg$1');
  
  // Xử lý border
  content = content.replace(/border-\[\#4F1F76\](\/\d+)?/g, 'border-admin-border');

  if (content !== original) {
    fs.writeFileSync(filePath, content, 'utf8');
    console.log('Updated:', filePath);
  }
}

function processDir(dir) {
  const files = fs.readdirSync(dir);
  for (const file of files) {
    const fullPath = path.join(dir, file);
    if (fs.statSync(fullPath).isDirectory()) {
      processDir(fullPath);
    } else if (fullPath.endsWith('.tsx') || fullPath.endsWith('.ts')) {
      replaceInFile(fullPath);
    }
  }
}

processDir(targetDir);
console.log('Done!');
