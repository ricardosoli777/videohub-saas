import React from 'react';

interface VideoEmbedProps {
  url: string;
  title: string;
  embedCode?: string;
  embedWidth?: string;
  embedHeight?: string;
}

export default function VideoEmbed({ url, title, embedCode, embedWidth = '100%', embedHeight = '400px' }: VideoEmbedProps) {
  // Se há código embed personalizado, usar ele
  if (embedCode && embedCode.trim()) {
    // Aplicar dimensões personalizadas no container
    const containerStyle = {
      width: embedWidth,
      height: embedHeight,
      minHeight: embedHeight
    };

    return (
      <div className="relative" style={containerStyle}>
        <div 
          className="video-embed-container"
          style={{ width: '100%', height: '100%' }}
          dangerouslySetInnerHTML={{ __html: embedCode }}
        />
      </div>
    );
  }

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

    // Verificar se já é uma URL de embed ou iframe
    if (url.includes('embed') || url.includes('player')) {
      return url;
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
        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; microphone"
        allowFullScreen
      />
    </div>
  );
}