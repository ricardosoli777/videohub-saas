import React, { useEffect } from 'react';
import { Video as VideoType } from '../contexts/VideoContext';
import VideoForm from './VideoForm';
import VideoEmbed from './VideoEmbed';
import { X } from 'lucide-react';

interface VideoModalProps {
  video: VideoType | null;
  isOpen: boolean;
  onClose: () => void;
  isEdit?: boolean;
}

export default function VideoModal({ video, isOpen, onClose, isEdit = false }: VideoModalProps) {
  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };

    if (isOpen) {
      document.addEventListener('keydown', handleEscape);
      document.body.style.overflow = 'hidden';
    }

    return () => {
      document.removeEventListener('keydown', handleEscape);
      document.body.style.overflow = 'unset';
    };
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      <div 
        className="absolute inset-0 bg-black/80 backdrop-blur-sm"
        onClick={onClose}
      />
      
      <div className="relative w-full max-w-4xl mx-4 max-h-[90vh] overflow-y-auto">
        <div className="bg-white/10 backdrop-blur-lg rounded-2xl border border-white/20 shadow-2xl">
          <div className="flex items-center justify-between p-6 border-b border-white/20">
            <h2 className="text-2xl font-bold text-white">
              {isEdit ? 'Editar Vídeo' : video ? video.title : 'Novo Vídeo'}
            </h2>
            <button
              onClick={onClose}
              className="p-2 hover:bg-white/10 rounded-lg transition-colors"
            >
              <X className="h-6 w-6 text-gray-300" />
            </button>
          </div>
          
          <div className="p-6">
            {isEdit || !video ? (
              <VideoForm video={video} onClose={onClose} />
            ) : (
              <div className="space-y-6">
                <VideoEmbed 
                  url={video.url} 
                  title={video.title} 
                  embedCode={video.embed_code}
                  embedWidth={video.embed_width}
                  embedHeight={video.embed_height}
                />
                <div>
                  <h3 className="text-xl font-semibold text-white mb-3">{video.title}</h3>
                  <p className="text-gray-300 leading-relaxed">{video.description}</p>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}