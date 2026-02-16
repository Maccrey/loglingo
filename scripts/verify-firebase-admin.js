const fs = require('fs');
const path = require('path');
const admin = require('firebase-admin');

// Simple .env parser since dotenv might not be installed
function loadEnv() {
  try {
    const envPath = path.resolve(__dirname, '../.env');
    if (!fs.existsSync(envPath)) {
      console.error('❌ .env file not found at:', envPath);
      return {};
    }
    const envContent = fs.readFileSync(envPath, 'utf8');
    const env = {};
    envContent.split('\n').forEach(line => {
      const match = line.match(/^([^=]+)=(.*)$/);
      if (match) {
        let value = match[2].trim();
        // Remove surrounding quotes if present
        if ((value.startsWith('"') && value.endsWith('"')) || (value.startsWith("'") && value.endsWith("'"))) {
          value = value.slice(1, -1);
        }
        env[match[1]] = value;
      }
    });
    return env;
  } catch (e) {
    console.error('❌ Failed to load .env:', e);
    return {};
  }
}

async function verify() {
  console.log("🔍 Verifying Firebase Admin SDK Configuration...");
  const env = loadEnv();

  const projectId = env.NEXT_PUBLIC_FIREBASE_PROJECT_ID;
  const clientEmail = env.SERVICE_FIREBASE_CLIENT_EMAIL || env.FIREBASE_CLIENT_EMAIL;
  let privateKey = env.SERVICE_FIREBASE_PRIVATE_KEY || env.FIREBASE_PRIVATE_KEY;

  console.log(`- Project ID: ${projectId ? '✅ Found' : '❌ Missing'}`);
  console.log(`- Client Email: ${clientEmail ? '✅ Found' : '❌ Missing'}`);
  
  if (!privateKey) {
    console.error(`- Private Key: ❌ Missing (Checked SERVICE_FIREBASE_PRIVATE_KEY and FIREBASE_PRIVATE_KEY)`);
    process.exit(1);
  }

  console.log(`- Private Key: ✅ Found (Length: ${privateKey.length})`);

  // Emulate logic from src/infrastructure/firebase/admin.ts
  if (privateKey) {
    // Check if it contains literal \n characters that need replacement
    if (privateKey.includes('\\n')) {
         console.log("  ℹ️  Private key contains literal '\\n', applying replacement.");
    }
    privateKey = privateKey.replace(/\\n/g, "\n");
  }

  // Check header/footer
  if (!privateKey.includes('-----BEGIN PRIVATE KEY-----')) {
    console.error('  ❌ Private Key missing header "-----BEGIN PRIVATE KEY-----"');
  }
  if (!privateKey.includes('-----END PRIVATE KEY-----')) {
     console.error('  ❌ Private Key missing footer "-----END PRIVATE KEY-----"');
  }

  try {
    console.log("🔄 Attempting to initialize Firebase Admin app...");
    admin.initializeApp({
      credential: admin.credential.cert({
        projectId,
        clientEmail,
        privateKey,
      }),
    });
    console.log("✅ Firebase Admin SDK initialized successfully!");
  } catch (error) {
    console.error("❌ Firebase Admin SDK Initialization Failed:");
    console.error(error.message);
    // Provide specific hints based on error
    if (error.message.includes('PEM')) {
        console.log("\n💡 HINT: The Private Key format seems invalid. Ensure it is a valid PEM format.");
    }
  }
}

verify();
