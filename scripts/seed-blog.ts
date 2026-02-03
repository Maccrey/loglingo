
import admin from 'firebase-admin';
import { getFirestore, Timestamp } from 'firebase-admin/firestore';
import { BLOG_POSTS_PART_1 } from "./blog-data-part1";
import { BLOG_POSTS_PART_2 } from "./blog-data-part2";
import { BLOG_POSTS_PART_3 } from "./blog-data-part3";
import { BLOG_POSTS_PART_4 } from "./blog-data-part4";
import { BLOG_POSTS_PART_5 } from "./blog-data-part5";
import { BLOG_POSTS_PART_6 } from "./blog-data-part6";
import { BLOG_POSTS_PART_7 } from "./blog-data-part7";
import { BLOG_POSTS_PART_8 } from "./blog-data-part8";
import { loadEnvConfig } from '@next/env';

loadEnvConfig(process.cwd());

// Initialize Firebase Admin
// Checks for service-account.json first, then falls back to default credentials
if (!admin.apps.length) {
    try {
        const fs = require('fs');
        const path = require('path');
        const serviceAccountPath = path.resolve(process.cwd(), 'service-account.json');

        if (fs.existsSync(serviceAccountPath)) {
            console.log("🔑 Found service-account.json, using it for authentication...");
            const serviceAccount = require(serviceAccountPath);
            admin.initializeApp({
                credential: admin.credential.cert(serviceAccount),
                projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID
            });
        } else {
            console.log("⚠️ service-account.json not found, trying Application Default Credentials...");
            admin.initializeApp({
                credential: admin.credential.applicationDefault(),
                projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID
            });
        }
    } catch (error) {
        console.error("Failed to initialize Firebase Admin:", error);
        console.error("Please download service-account.json to project root OR run 'gcloud auth application-default login'");
        process.exit(1);
    }
}

const db = getFirestore();

async function seedBlog() {
  console.log("🌱 Starting Blog Seed (Admin Mode)...");
  
  if (!process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID) {
      console.error("❌ Missing NEXT_PUBLIC_FIREBASE_PROJECT_ID");
      process.exit(1);
  }
  console.log(`Target Project: ${process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID}`);

  // Supported Locales
  const LOCALES = ['en', 'ko', 'ja', 'zh', 'th', 'vi', 'id', 'es', 'pt', 'fr', 'de', 'tr', 'ar', 'hi', 'ru', 'bn', 'ur', 'ne'];

  const BLOG_POSTS = [
    ...BLOG_POSTS_PART_1,
    ...BLOG_POSTS_PART_2,
    ...BLOG_POSTS_PART_3,
    ...BLOG_POSTS_PART_4,
    ...BLOG_POSTS_PART_5,
    ...BLOG_POSTS_PART_6,
    ...BLOG_POSTS_PART_7,
    ...BLOG_POSTS_PART_8
  ];

  let count = 0;
  for (const post of BLOG_POSTS) {
    if (!post.id) continue;

    console.log(`Processing post: ${post.id}`);

    // Ensure all locales exist in title, excerpt, content
    // Fallback if missing (though they should be there)
    const title: any = post.title || {};
    const excerpt: any = post.excerpt || {};
    const content: any = post.content || {};

    for (const locale of LOCALES) {
        if (!title[locale]) title[locale] = title['en'] || title['ko'] || 'Untitled';
        if (!excerpt[locale]) excerpt[locale] = excerpt['en'] || excerpt['ko'] || '';
        if (!content[locale]) content[locale] = content['en'] || content['ko'] || ''; // Fallback
    }
    
    post.title = title;
    post.excerpt = excerpt;
    post.content = content;

    console.log(`Writing post to Firestore: ${post.id}`);

    // Convert Date objects to Firestore Timestamps 
    // Admin SDK usually handles Dates, but better explicit
    const data = {
        ...post,
        createdAt: post.createdAt ? Timestamp.fromDate(post.createdAt) : Timestamp.now(),
        updatedAt: post.updatedAt ? Timestamp.fromDate(post.updatedAt) : Timestamp.now(),
    };

    await db.collection("posts").doc(post.id).set(data, { merge: true });
    
    count++;
  }

  console.log(`✅ Successfully seeded ${count} blog posts.`);
  process.exit(0);
}

seedBlog().catch(console.error);
