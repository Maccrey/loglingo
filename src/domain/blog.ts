export interface BlogPost {
  id: string; // Slug (e.g., 'why-keep-diary')
  title: Record<string, string>; // { ko: '...', en: '...' }
  content: Record<string, string>; // HTML or Markdown content
  excerpt: Record<string, string>; // Short summary for list view
  coverImage: string; // URL of the cover image
  author: string; // e.g., "Dr. Lingua"
  tags: string[];
  published: boolean;
  createdAt: Date;
  updatedAt: Date;
}

export interface BlogFilter {
  tag?: string;
  locale?: string;
}
