import { BlogRepository } from "@/infrastructure/firebase/blog-repository";
import { Link } from "@/i18n/routing";
import { useTranslations } from "next-intl";
import { getTranslations } from "next-intl/server";
import Image from "next/image";
import { Calendar, User } from "lucide-react";
import { BlogCoverImage } from "@/components/blog/BlogCoverImage";

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: 'blog' });
  return {
    title: t('title'),
    description: t('subtitle'),
  };
}

export default async function BlogListPage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: 'blog' });
  const allPosts = await BlogRepository.getPosts();

  // Sort posts by createdAt to ensure consistent order between server and client
  const posts = allPosts.sort((a, b) => {
    const dateA = new Date(a.createdAt).getTime();
    const dateB = new Date(b.createdAt).getTime();
    return dateB - dateA; // Most recent first
  });

  // Force a cleaner render structure to avoid hydration mismatches
  const hasPosts = Array.isArray(posts) && posts.length > 0;

  return (
    <div className="space-y-8">
      <div className="text-center space-y-4">
        <h1 className="text-4xl font-bold bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
          {t('title')}
        </h1>
        <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
          {t('subtitle')}
        </p>
      </div>

      <div className="min-h-[200px]">
        {!hasPosts ? (
          <div className="text-center py-20 text-muted-foreground glass-panel rounded-2xl mx-auto max-w-md">
            <p>{t('no_posts')}</p>
          </div>
        ) : (
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {posts.map((post) => {
              const title = post.title?.[locale] || post.title?.['en'] || 'Untitled';
              const excerpt = post.excerpt?.[locale] || post.excerpt?.['en'] || '';

              return (
                <Link 
                  key={post.id} 
                  href={`/blog/${post.id}`}
                  className="group block"
                >
                  <div className="glass-panel h-full overflow-hidden rounded-2xl transition-transform duration-300 hover:scale-[1.02] hover:bg-white/10">
                    <div className="relative h-48 w-full overflow-hidden">
                      <BlogCoverImage
                        src={post.coverImage}
                        alt={title}
                        fill
                        className="object-cover transition-transform duration-500 group-hover:scale-110"
                      />
                    </div>
                    
                    <div className="p-6 space-y-4">
                      <div className="flex items-center gap-4 text-xs text-muted-foreground" suppressHydrationWarning>
                        <span className="flex items-center gap-1">
                          <Calendar className="w-3 h-3" />
                          <span>
                            {new Date(post.createdAt).toLocaleDateString(locale, {
                              year: 'numeric',
                              month: 'long',
                              day: 'numeric'
                            })}
                          </span>
                        </span>
                        <span className="flex items-center gap-1">
                          <User className="w-3 h-3" />
                          {post.author}
                        </span>
                      </div>

                      <h2 className="text-xl font-bold line-clamp-2 group-hover:text-primary transition-colors">
                        {title}
                      </h2>
                      
                      <p className="text-sm text-muted-foreground line-clamp-3">
                        {excerpt}
                      </p>

                      <div className="flex flex-wrap gap-2 pt-2">
                          {post.tags?.map(tag => (
                              <span key={tag} className="text-[10px] px-2 py-1 rounded-full bg-primary/10 text-primary border border-primary/20">
                                  #{tag}
                              </span>
                          ))}
                      </div>
                    </div>
                  </div>
                </Link>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
