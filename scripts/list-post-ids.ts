import { initializeApp, cert, getApps } from 'firebase-admin/app';
import { getFirestore } from 'firebase-admin/firestore';
import * as path from 'path';
import * as fs from 'fs';

const serviceAccountPath = path.join(process.cwd(), 'service-account.json');

if (!fs.existsSync(serviceAccountPath)) {
  console.error('❌ service-account.json not found');
  process.exit(1);
}

if (getApps().length === 0) {
  initializeApp({
    credential: cert(serviceAccountPath)
  });
}

const db = getFirestore();

async function listAllPostIds() {
  console.log('📋 Listing all post IDs in Firestore...\n');
  
  const postsRef = db.collection('posts');
  const snapshot = await postsRef.get();
  
  const ids = snapshot.docs.map(doc => doc.id).sort();
  
  console.log(`Total posts: ${ids.length}\n`);
  console.log('Post IDs:');
  ids.forEach((id, index) => {
    console.log(`${index + 1}. ${id}`);
  });
  
  // Check for problematic IDs
  const problematicIds = ['media-learning', 'realistic-goals', 'pronunciation-matters'];
  console.log('\n🔍 Checking for problematic IDs:');
  problematicIds.forEach(id => {
    if (ids.includes(id)) {
      console.log(`❌ Found: ${id}`);
    } else {
      console.log(`✅ Not found: ${id}`);
    }
  });
}

listAllPostIds().catch(console.error);
