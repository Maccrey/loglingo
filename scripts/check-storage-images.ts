
import admin from 'firebase-admin';
import { getStorage } from 'firebase-admin/storage';
import { loadEnvConfig } from '@next/env';

loadEnvConfig(process.cwd());

if (!admin.apps.length) {
    try {
        const fs = require('fs');
        const path = require('path');
        const serviceAccountPath = path.resolve(process.cwd(), 'service-account.json');

        if (fs.existsSync(serviceAccountPath)) {
            const serviceAccount = require(serviceAccountPath);
            admin.initializeApp({
                credential: admin.credential.cert(serviceAccount),
                storageBucket: `${process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID}.appspot.com`
            });
        } else {
            admin.initializeApp({
                credential: admin.credential.applicationDefault(),
                storageBucket: `${process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID}.appspot.com`
            });
        }
    } catch (error) {
        console.error("Failed to init admin:", error);
    }
}

async function checkStorage() {
    const bucket = getStorage().bucket();
    console.log(`Checking bucket: ${bucket.name}`);

    try {
        const [files] = await bucket.getFiles({ prefix: 'assets/blog/' });
        
        console.log("\nFound images in 'assets/blog/':");
        files.forEach(file => {
            console.log(`- ${file.name}`);
        });

        if (files.length === 0) {
             console.log("No files found in 'assets/blog/'. Checking root...");
             const [rootFiles] = await bucket.getFiles({ startOffset: 'blog' }); // loosely look for blog stuff
             rootFiles.forEach(file => console.log(`[Root] ${file.name}`));
        }

    } catch (error) {
        console.error("Error listing files:", error);
    }
}

checkStorage();
