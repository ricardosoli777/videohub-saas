import React from 'react';

interface VideoEmbedProps {
  url: string;
  title: string;
}

export default function VideoEmbed({ url, title }: VideoEmbedProps) {
  const getEmbedUrl = (url: string) => {
    // YouTube
    const youtubeRegex = /(?:youtube\.com\/watch\?v=|youtu\.be\/)([^&\n?#]+)/;
    const youtubeMatch = url.match(youtubeRegex);
    if (youtubeMatch) {
      return `https://www.youtube.com/embed/${youtubeMatch[1]}`;
    }

    // Vimeo
    const vimeoRegex = /(?:vimeo\.com\/)([0-9]+)/;
    const vimeoMatch = url.match(vimeoRegex);
    if (vimeoMatch) {
      return `https://player.vimeo.com/video/${vimeoMatch[1]}`;
    }

    // Dailymotion
    const dailymotionRegex = /(?:dailymotion\.com\/video\/)([^_]+)/;
    const dailymotionMatch = url.match(dailymotionRegex);
    if (dailymotionMatch) {
      return `https://www.dailymotion.com/embed/video/${dailymotionMatch[1]}`;
    }

    return url;
  };

  return (
    <div className="relative aspect-video w-full">
      <iframe
        src={getEmbedUrl(url)}
        title={title}
        className="w-full h-full rounded-lg"
        frameBorder="0"
        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
        allowFullScreen
      />
    </div>
  );
}