'use client';

import { useState } from 'react';
import Image, { ImageProps } from 'next/image';

interface BlogCoverImageProps extends Omit<ImageProps, 'src'> {
  src?: string | null;
  defaultSrc?: string;
}

const DEFAULT_BLOG_COVER = '/images/default-blog-cover.png';

export function BlogCoverImage({ 
  src, 
  defaultSrc = DEFAULT_BLOG_COVER, 
  alt, 
  ...props 
}: BlogCoverImageProps) {
  const [error, setError] = useState(false);
  
  const imageSrc = error || !src ? defaultSrc : src;
  const isExternal = imageSrc.startsWith('http');

  return (
    <Image
      key={src} 
      src={imageSrc}
      alt={alt}
      onError={() => setError(true)}
      unoptimized={isExternal} // Disable optimization for external images in Firebase Hosting
      {...props}
    />
  );
}
