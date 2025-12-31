const fs = require('fs');
const path = require('path');

const dir = path.join(__dirname, 'messages');
// Exclude 'en' from the target list as it is the master
const languages = ['ar', 'bn', 'de', 'es', 'fr', 'hi', 'id', 'ja', 'ko', 'ne', 'pt', 'ru', 'th', 'tr', 'ur', 'vi', 'zh'];
const masterPath = path.join(dir, 'en.json');

if (!fs.existsSync(masterPath)) {
  console.error('Error: en.json (master) not found.');
  process.exit(1);
}

const masterContent = JSON.parse(fs.readFileSync(masterPath, 'utf8'));

/**
 * Recursively syncs target object to match master object structure.
 * - Adds missing keys from master.
 * - Removes extra keys not in master.
 * - Sorts keys to match master order.
 */
function syncObjects(master, target, langCode) {
  const result = {};

  // 1. Iterate over keys in Master to build Result
  for (const key of Object.keys(master)) {
    const masterValue = master[key];
    const targetValue = target[key];

    if (typeof masterValue === 'object' && masterValue !== null && !Array.isArray(masterValue)) {
      // Nested object
      if (typeof targetValue === 'object' && targetValue !== null && !Array.isArray(targetValue)) {
         // Recursively sync
         result[key] = syncObjects(masterValue, targetValue, langCode);
      } else {
         // Target is missing this object or is mismatch type -> Recreate structure from master
         // For missing values, we can't easily translate, so we use the Master(English) value as placeholder
         // OR we just assume empty object and recurse if we want to preserve structure?
         // Better: Use Master value as fallback for the whole subtree, but that effectively overwrites.
         // Let's create a deep copy of master value for the missing part.
         console.log(`[${langCode}] Missing/Mismatch object at key '${key}'. filling with defaults.`);
         result[key] = masterValue; // This copies the English content strictly
         // Ideally we might want to flag this, but for now we fill gaps.
      }
    } else {
      // Leaf value (string, number, array if treated as value)
      if (targetValue !== undefined) {
        // Keep existing translation
        result[key] = targetValue;
      } else {
        // Missing key -> Add Master value
        console.log(`[${langCode}] Missing key '${key}'. Adding English default.`);
        result[key] = masterValue;
      }
    }
  }

  // Note: We ignored keys in Target that are NOT in Master (implicitly deleted by only iterating Master keys)
  
  // Checking for deleted keys for logging purposes
  const masterKeys = new Set(Object.keys(master));
  for (const key of Object.keys(target)) {
    if (!masterKeys.has(key)) {
      console.log(`[${langCode}] Removing extra key '${key}'`);
    }
  }

  return result;
}

languages.forEach(lang => {
  const filePath = path.join(dir, `${lang}.json`);
  if (fs.existsSync(filePath)) {
    try {
      const targetContent = JSON.parse(fs.readFileSync(filePath, 'utf8'));
      const syncedContent = syncObjects(masterContent, targetContent, lang);
      
      fs.writeFileSync(filePath, JSON.stringify(syncedContent, null, 2), 'utf8');
      console.log(`Synced ${lang}.json`);
    } catch (e) {
      console.error(`Error syncing ${lang}.json:`, e);
    }
  } else {
    console.warn(`File not found: ${lang}.json`);
  }
});
