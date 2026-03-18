const fs = require('fs');
const path = require('path');
const https = require('https');

const envPath = path.join(__dirname, '.env');
const envContent = fs.readFileSync(envPath, 'utf8');
const apiKeyMatch = envContent.match(/GROK_API_KEY=(.*)/);
const apiKey = apiKeyMatch ? apiKeyMatch[1].trim() : process.env.GROK_API_KEY;

let modelMatch = envContent.match(/GROK_MODEL=(.*)/);
let model = modelMatch ? modelMatch[1].trim() : 'grok-4-1-fast-non-reasoning';

if (!apiKey) {
  console.error("GROK_API_KEY not found in .env");
  process.exit(1);
}

const languages = ['ar', 'bn', 'de', 'es', 'fr', 'hi', 'id', 'ja', 'ko', 'ne', 'pt', 'ru', 'th', 'tr', 'ur', 'vi', 'zh'];
const enData = JSON.parse(fs.readFileSync(path.join(__dirname, 'messages', 'en.json'), 'utf8'));

const sectionsToTranslate = ['about', 'terms', 'privacy', 'contact'];

async function fetchTranslation(prompt) {
  return new Promise((resolve, reject) => {
    const data = JSON.stringify({
      model: model,
      messages: [
        { role: "system", content: "You are a professional translator. Only output the translated JSON object cleanly without markdown code blocks, explanations, or any extra text." },
        { role: "user", content: prompt }
      ],
      temperature: 0.1
    });

    const options = {
      hostname: 'api.x.ai',
      path: '/v1/chat/completions',
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${apiKey}`,
        'Content-Length': Buffer.byteLength(data)
      }
    };

    const req = https.request(options, (res) => {
      let responseBody = '';
      res.on('data', (chunk) => responseBody += chunk);
      res.on('end', () => {
        try {
          const json = JSON.parse(responseBody);
          if (json.choices && json.choices.length > 0) {
            let content = json.choices[0].message.content.trim();
            // remove markdown wrapping if present
            if (content.startsWith('```json')) {
              content = content.substring(7);
            }
            if (content.startsWith('```')) {
              content = content.substring(3);
            }
            if (content.endsWith('```')) {
              content = content.substring(0, content.length - 3);
            }
            resolve(JSON.parse(content.trim()));
          } else {
            console.error("Unexpected response:", responseBody);
            resolve(null);
          }
        } catch (e) {
          console.error("Error parsing response:", e);
          console.error("Raw response:", responseBody);
          resolve(null);
        }
      });
    });

    req.on('error', (e) => reject(e));
    req.write(data);
    req.end();
  });
}

async function main() {
  const sourceObject = {};
  for (const section of sectionsToTranslate) {
    sourceObject[section] = enData[section];
  }

  for (const lang of languages) {
    console.log(`Translating to ${lang}...`);
    
    // For Korean, we already know what to use for some of it, but let's translate all of it to be safe
    // Actually, we should preserve the Korean formatting. Let's just translate it all.
    
    const prompt = `Translate the following JSON object's values into the language with code '${lang}'. Keep the JSON keys exactly the same. Do not translate email addresses ("01071630214@gmail.com"). Return ONLY valid JSON and nothing else.\n\n${JSON.stringify(sourceObject, null, 2)}`;
    
    const translatedObj = await fetchTranslation(prompt);
    
    if (translatedObj) {
      const filePath = path.join(__dirname, 'messages', `${lang}.json`);
      if (fs.existsSync(filePath)) {
        const targetData = JSON.parse(fs.readFileSync(filePath, 'utf8'));
        
        for (const section of sectionsToTranslate) {
          targetData[section] = translatedObj[section] || targetData[section];
        }
        
        fs.writeFileSync(filePath, JSON.stringify(targetData, null, 2), 'utf8');
        console.log(`✅ Successfully updated ${lang}.json`);
      } else {
        console.warn(`File not found: ${filePath}`);
      }
    } else {
      console.error(`❌ Failed to translate ${lang}.json`);
    }
    
    // Slight pause to avoid rate limits
    await new Promise(r => setTimeout(r, 1000));
  }
}

main().catch(console.error);
