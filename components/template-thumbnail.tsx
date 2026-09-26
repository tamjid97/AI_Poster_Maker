'use client';

import { useEffect, useState } from 'react';

interface TemplateThumbnailProps {
  thumbnailUrl: string;
  title: string;
  className?: string;
}

export function TemplateThumbnail({ thumbnailUrl, title, className = '' }: TemplateThumbnailProps) {
  const [svgContent, setSvgContent] = useState<string>('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  useEffect(() => {
    const loadSvg = async () => {
      try {
        setLoading(true);
        const response = await fetch(thumbnailUrl);
        if (!response.ok) {
          throw new Error('Failed to load SVG');
        }
        const svgText = await response.text();
        setSvgContent(svgText);
        setError(false);
      } catch (err) {
        console.error('Failed to load SVG thumbnail:', err);
        setError(true);
      } finally {
        setLoading(false);
      }
    };

    loadSvg();
  }, [thumbnailUrl]);

  if (loading) {
    return (
      <div className={`flex items-center justify-center bg-muted ${className}`}>
        <div className="h-8 w-8 animate-spin rounded-full border-2 border-primary border-t-transparent" />
      </div>
    );
  }

  if (error) {
    return (
      <div className={`flex items-center justify-center bg-muted ${className}`}>
        <span className="text-xs text-muted-foreground">Preview unavailable</span>
      </div>
    );
  }

  return (
    <div className={`overflow-hidden ${className}`} dangerouslySetInnerHTML={{ __html: svgContent }} />
  );
}