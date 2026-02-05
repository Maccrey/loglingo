
import { BLOG_POSTS_PART_1 } from "./blog-data-part1";
import { BLOG_POSTS_PART_2 } from "./blog-data-part2";
import { BLOG_POSTS_PART_3 } from "./blog-data-part3";
import { BLOG_POSTS_PART_4 } from "./blog-data-part4";
import { BLOG_POSTS_PART_5 } from "./blog-data-part5";
import { BLOG_POSTS_PART_6 } from "./blog-data-part6";
import { BLOG_POSTS_PART_7 } from "./blog-data-part7";
import { BLOG_POSTS_PART_8 } from "./blog-data-part8";

const allPosts = [
  ...BLOG_POSTS_PART_1,
  ...BLOG_POSTS_PART_2,
  ...BLOG_POSTS_PART_3,
  ...BLOG_POSTS_PART_4,
  ...BLOG_POSTS_PART_5,
  ...BLOG_POSTS_PART_6,
  ...BLOG_POSTS_PART_7,
  ...BLOG_POSTS_PART_8,
];

console.log(`Checking ${allPosts.length} posts for missing images...`);


const fs = require('fs');
const path = require('path');

const publicDir = path.resolve(process.cwd(), 'public');

const missingImages: string[] = [];

allPosts.forEach(post => {
    if (!post.coverImage || post.coverImage.trim() === "") {
        missingImages.push(`${post.id} (Missing field or empty string)`);
    } else {
        // Remove leading slash if present for path joining
        const relativePath = post.coverImage.startsWith('/') ? post.coverImage.slice(1) : post.coverImage;
        const fullPath = path.join(publicDir, relativePath);
        
        if (!fs.existsSync(fullPath)) {
             missingImages.push(`${post.id} (File not found: ${post.coverImage})`);
        }
    }
});

if (missingImages.length > 0) {
    console.log("Found posts with missing images (file not found or empty):");
    missingImages.forEach(details => console.log(`- ${details}`));
} else {
    console.log("All posts have valid coverImage files.");
}

