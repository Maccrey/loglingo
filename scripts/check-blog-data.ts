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

async function checkBlogData() {
  console.log('🔍 Checking blog data in Firestore...\n');
  
  const postsRef = db.collection('posts');
  const snapshot = await postsRef.get();
  
  console.log(`📊 Total posts in Firestore: ${snapshot.size}\n`);
  
  // Check pronunciation-mistakes post
  const pronunciationDoc = await postsRef.doc('pronunciation-mistakes').get();
  
  if (!pronunciationDoc.exists) {
    console.log('❌ pronunciation-mistakes post not found!');
    return;
  }
  
  const data = pronunciationDoc.data();
  console.log('✅ pronunciation-mistakes post found!');
  console.log('\n📝 Available languages in title:');
  console.log(Object.keys(data?.title || {}));
  
  console.log('\n📝 Available languages in content:');
  console.log(Object.keys(data?.content || {}));
  
  console.log('\n🇯🇵 Japanese title:', data?.title?.ja?.substring(0, 100));
  console.log('\n🇯🇵 Japanese content length:', data?.content?.ja?.length || 0);
  console.log('🇰🇷 Korean content length:', data?.content?.ko?.length || 0);
  console.log('🇬🇧 English content length:', data?.content?.en?.length || 0);
}

checkBlogData().catch(console.error);
