const fs = require('fs');
const path = require('path');

const messagesDir = path.join(process.cwd(), 'messages');
const koPath = path.join(messagesDir, 'ko.json');
const koContent = JSON.parse(fs.readFileSync(koPath, 'utf8'));

function flattenKeys(obj, prefix = '') {
  let keys = [];
  for (const key in obj) {
    if (typeof obj[key] === 'object' && obj[key] !== null) {
      keys = keys.concat(flattenKeys(obj[key], prefix + key + '.'));
    } else {
      keys.push(prefix + key);
    }
  }
  return keys;
}

const koKeys = new Set(flattenKeys(koContent));
const files = fs.readdirSync(messagesDir).filter(f => f.endsWith('.json') && f !== 'ko.json');

console.log('--- Missing Keys Report ---');
files.forEach(file => {
  const filePath = path.join(messagesDir, file);
  try {
    const content = JSON.parse(fs.readFileSync(filePath, 'utf8'));
    const keys = new Set(flattenKeys(content));
    
    const missing = [...koKeys].filter(k => !keys.has(k));
    
    if (missing.length > 0) {
      console.log(`\nMISSING IN ${file} (${missing.length} keys):`);
      missing.forEach(k => console.log(`  ${k}`));
    } else {
      console.log(`\n${file}: OK`);
    }
  } catch (e) {
    console.error(`Error parsing ${file}:`, e.message);
  }
});
