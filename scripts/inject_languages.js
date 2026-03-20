const fs = require("fs");
const path = require("path");

const locales = ['en', 'ko', 'ja', 'zh', 'th', 'vi', 'id', 'es', 'pt', 'fr', 'de', 'tr', 'ar', 'hi', 'ru', 'bn', 'ur', 'ne'];
const dir = path.join(__dirname, "../messages");

locales.forEach(target => {
  const displayNames = new Intl.DisplayNames([target], { type: 'language' });
  const result = locales.reduce((acc, code) => {
    // some locales might return the english name if missing, but typically Node 18+ ICU covers these 18
    let name = displayNames.of(code);
    // Capitalize first letter for English and others just in case
    if (name && name.length > 0) {
      name = name.charAt(0).toUpperCase() + name.slice(1);
    }
    acc[code] = name;
    return acc;
  }, {});

  const filePath = path.join(dir, `${target}.json`);
  if (fs.existsSync(filePath)) {
    const data = JSON.parse(fs.readFileSync(filePath, "utf-8"));
    if (!data.common) data.common = {};
    data.common.languages = result;
    fs.writeFileSync(filePath, JSON.stringify(data, null, 2), "utf-8");
    console.log(`Updated ${filePath}`);
  }
});
