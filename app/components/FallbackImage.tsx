"use client";

import { useState } from "react";
import Image, { ImageProps } from "next/image";

interface FallbackImageProps extends Omit<ImageProps, "onError"> {
  fallbackSrc?: string;
  initials?: string;
  isAvatar?: boolean;
}

export default function FallbackImage({
  src,
  fallbackSrc = "/assets/default-avatar.svg",
  alt = "Image",
  initials,
  isAvatar = false,
  className = "",
  ...props
}: FallbackImageProps) {
  const [hasError, setHasError] = useState(false);

  // If no source or src is empty
  const effectiveSrc = !src || typeof src !== "string" || src.trim() === "" ? fallbackSrc : (hasError ? fallbackSrc : src);

  if (hasError && initials && isAvatar) {
    return (
      <div
        className={`flex items-center justify-center font-bold text-white bg-gradient-to-br from-[#4285f4] to-[#0f9d58] select-none ${className}`}
        aria-label={alt}
      >
        <span>{initials.slice(0, 2).toUpperCase()}</span>
      </div>
    );
  }

  return (
    <Image
      src={effectiveSrc}
      alt={alt}
      className={className}
      onError={() => {
        if (!hasError) setHasError(true);
      }}
      {...props}
    />
  );
}
