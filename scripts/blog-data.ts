
import { BlogPost } from "../src/domain/blog";
import { BLOG_POSTS_PART_1 } from "./blog-data-part1";
import { BLOG_POSTS_PART_2 } from "./blog-data-part2";
import { BLOG_POSTS_PART_3 } from "./blog-data-part3";
import { BLOG_POSTS_PART_4 } from "./blog-data-part4";
import { BLOG_POSTS_PART_5 } from "./blog-data-part5";
import { BLOG_POSTS_PART_6 } from "./blog-data-part6";

export const BLOG_POSTS: Partial<BlogPost>[] = [
  ...BLOG_POSTS_PART_1,
  ...BLOG_POSTS_PART_2,
  ...BLOG_POSTS_PART_3,
  ...BLOG_POSTS_PART_4,
  ...BLOG_POSTS_PART_5,
  ...BLOG_POSTS_PART_6,
];
