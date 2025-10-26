'use client';

import Image from 'next/image';
import { useState, useEffect } from 'react';

interface AvatarProps {
  src?: string | null;
  alt: string;
  size?: 'sm' | 'md' | 'lg' | 'xl';
  className?: string;
}

const sizeClasses = {
  sm: 'w-8 h-8 text-xs',
  md: 'w-12 h-12 text-base',
  lg: 'w-20 h-20 text-2xl',
  xl: 'w-30 h-30 text-4xl',
};

export function Avatar({ src, alt, size = 'md', className = '' }: AvatarProps) {
  const [imageError, setImageError] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  
  // Reset states when src changes
  useEffect(() => {
    if (src) {
      setIsLoading(true);
      setImageError(false);
    } else {
      setIsLoading(false);
      setImageError(true);
    }
  }, [src]);
  
  // Get initials from alt text (username or name)
  const getInitials = (name: string) => {
    if (!name) return '?';
    
    const parts = name.trim().split(/\s+/);
    if (parts.length >= 2) {
      // First letter of first name + first letter of last name
      return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase();
    }
    // If only one word, use first two letters
    return name.substring(0, 2).toUpperCase();
  };

  const initials = getInitials(alt);
  const sizeClass = sizeClasses[size];

  // Generate a color based on the username for consistent avatar colors
  const getAvatarColor = (name: string) => {
    const colors = [
      'bg-red-500',
      'bg-blue-500',
      'bg-green-500',
      'bg-yellow-500',
      'bg-purple-500',
      'bg-pink-500',
      'bg-indigo-500',
      'bg-orange-500',
    ];
    
    let hash = 0;
    for (let i = 0; i < name.length; i++) {
      hash = name.charCodeAt(i) + ((hash << 5) - hash);
    }
    return colors[Math.abs(hash) % colors.length];
  };

  const avatarBgColor = getAvatarColor(alt);

  if (!src || imageError) {
    return (
      <div
        className={`${sizeClass} ${avatarBgColor} rounded-full flex items-center justify-center text-white font-bold ${className}`}
      >
        {initials}
      </div>
    );
  }

  return (
    <div className="relative">
      <Image
        src={src}
        alt={alt}
        width={size === 'sm' ? 32 : size === 'md' ? 48 : size === 'lg' ? 80 : 120}
        height={size === 'sm' ? 32 : size === 'md' ? 48 : size === 'lg' ? 80 : 120}
        className={`rounded-full ${className}`}
        onError={() => {
          setImageError(true);
          setIsLoading(false);
        }}
        onLoad={() => setIsLoading(false)}
        unoptimized={true}
      />
      {isLoading && (
        <div
          className={`absolute inset-0 ${sizeClass} ${avatarBgColor} rounded-full flex items-center justify-center text-white font-bold`}
        >
          {initials}
        </div>
      )}
    </div>
  );
}

