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
  
  // If src changes, reset error state
  if (src && error) {
    // This is a render-time state update (safe in React if conditional)
    // But since we can't easily check "previous src", better to use useEffect or key.
    // Given the simple usage in a list where items might be reused or not, 
    // let's use a standard useEffect or just rely on the parent key.
  }

  return (
    <Image
       // Force remount if src changes to reset error state automatically specific to that src
      key={src} 
      src={error || !src ? defaultSrc : src}
      alt={alt}
      onError={() => setError(true)}
      {...props}
    />
  );
}
