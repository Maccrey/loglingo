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

async function deleteDuplicatePosts() {
  console.log('🗑️  Deleting duplicate posts with wrong IDs...\n');
  
  const duplicateIds = ['media-learning', 'realistic-goals', 'pronunciation-matters'];
  
  for (const id of duplicateIds) {
    console.log(`Deleting: ${id}`);
    await db.collection('posts').doc(id).delete();
    console.log(`✅ Deleted: ${id}\n`);
  }
  
  console.log('✅ All duplicate posts deleted successfully!');
  console.log('\nRemaining correct posts:');
  console.log('- learning-via-netflix (18 languages)');
  console.log('- smart-goals-language (18 languages)');
  console.log('- pronunciation-mistakes (18 languages)');
}

deleteDuplicatePosts().catch(console.error);
