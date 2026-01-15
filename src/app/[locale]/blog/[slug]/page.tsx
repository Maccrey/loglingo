import { BlogRepository } from "@/infrastructure/firebase/blog-repository";
import { Link } from "@/i18n/routing";
import { getTranslations } from "next-intl/server";
import { notFound } from "next/navigation";
import Image from "next/image";
import { Calendar, User, ArrowLeft, Share2 } from "lucide-react";
import { Metadata } from "next";
import { BlogCoverImage } from "@/components/blog/BlogCoverImage";

type Props = {
  params: Promise<{ locale: string; slug: string }>;
};

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale, slug } = await params;
  const post = await BlogRepository.getPostBySlug(slug);

  if (!post) {
    return {
      title: 'Post Not Found',
    };
  }

  const title = post.title[locale] || post.title['en'] || Object.values(post.title)[0];
  const excerpt = post.excerpt[locale] || post.excerpt['en'] || Object.values(post.excerpt)[0];

  return {
    title,
    description: excerpt,
    openGraph: {
      title,
      description: excerpt,
      images: post.coverImage ? [post.coverImage] : [],
    },
  };
}

export default async function BlogDetailPage({ params }: Props) {
  const { locale, slug } = await params;
  const t = await getTranslations({ locale, namespace: 'blog' });
  const post = await BlogRepository.getPostBySlug(slug);

  if (!post) {
    notFound();
  }

  const title = post.title[locale] || post.title['en'] || Object.values(post.title)[0];
  const content = post.content[locale] || post.content['en'] || Object.values(post.content)[0];

  return (
    <article className="max-w-3xl mx-auto space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
      {/* Back Link */}
      <Link 
        href="/blog" 
        className="inline-flex items-center text-sm text-muted-foreground hover:text-primary transition-colors"
      >
        <ArrowLeft className="w-4 h-4 mr-1" />
        {t('back_to_list')}
      </Link>

      {/* Header */}
      <header className="space-y-6">
        <h1 className="text-3xl md:text-5xl font-bold leading-tight">
          {title}
        </h1>

        <div className="flex items-center justify-between border-y border-white/10 py-4">
          <div className="flex items-center gap-4 text-sm text-muted-foreground">
            <span className="flex items-center gap-1">
              <Calendar className="w-4 h-4" />
              {new Date(post.createdAt).toLocaleDateString(locale, { dateStyle: 'long' })}
            </span>
            <span className="flex items-center gap-1">
              <User className="w-4 h-4" />
              {post.author}
            </span>
          </div>
          {/* Share button placeholder */}
          <button className="p-2 rounded-full hover:bg-white/10 transition-colors text-muted-foreground hover:text-primary">
            <Share2 className="w-4 h-4" />
          </button>
        </div>
      </header>

      {/* Cover Image */}
      <div className="relative w-full h-[300px] md:h-[400px] rounded-2xl overflow-hidden glass-border">
        <BlogCoverImage
          src={post.coverImage}
          alt={title}
          fill
          className="object-cover"
          priority
        />
      </div>

      {/* Content */}
      <div 
        className="prose prose-invert prose-lg max-w-none 
        prose-headings:font-bold prose-headings:text-white/90 
        prose-p:text-white/80 prose-p:leading-relaxed
        prose-strong:text-primary prose-strong:font-semibold
        prose-a:text-primary prose-a:no-underline hover:prose-a:underline
        prose-li:text-white/80
        prose-img:rounded-xl prose-img:glass-border"
        dangerouslySetInnerHTML={{ __html: content }}
      />

      {/* Tags */}
      <div className="pt-8 border-t border-white/10">
        <div className="flex flex-wrap gap-2">
            {post.tags.map(tag => (
                <span key={tag} className="text-sm px-3 py-1 rounded-full bg-white/5 hover:bg-white/10 border border-white/10 transition-colors">
                    #{tag}
                </span>
            ))}
        </div>
      </div>
    </article>
  );
}
