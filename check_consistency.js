const fs = require('fs');
const path = require('path');

const dir = path.join(__dirname, 'messages');
const languages = ['ar', 'bn', 'de', 'es', 'fr', 'hi', 'id', 'ja', 'ko', 'ne', 'pt', 'ru', 'th', 'tr', 'ur', 'vi', 'zh']; // All except en
const masterLang = 'en';

const masterPath = path.join(dir, `${masterLang}.json`);
if (!fs.existsSync(masterPath)) {
  console.error('Master language file (en.json) not found!');
  process.exit(1);
}

const masterContent = JSON.parse(fs.readFileSync(masterPath, 'utf8'));

// Helper to flatten object keys
function flattenKeys(obj, prefix = '') {
  let keys = [];
  for (const k in obj) {
    if (typeof obj[k] === 'object' && obj[k] !== null && !Array.isArray(obj[k])) {
      keys = keys.concat(flattenKeys(obj[k], prefix + k + '.'));
    } else {
      keys.push(prefix + k);
    }
  }
  return keys;
}

const masterKeys = new Set(flattenKeys(masterContent));
const report = {};

languages.forEach(lang => {
  const filePath = path.join(dir, `${lang}.json`);
  if (fs.existsSync(filePath)) {
    const content = JSON.parse(fs.readFileSync(filePath, 'utf8'));
    const langKeys = new Set(flattenKeys(content));
    
    const missing = [];
    masterKeys.forEach(k => {
      if (!langKeys.has(k)) {
        missing.push(k);
      }
    });
    
    if (missing.length > 0) {
      report[lang] = missing;
    }
  } else {
    console.log(`Warning: ${lang}.json not found.`);
  }
});

console.log(JSON.stringify(report, null, 2));
