import React from 'react';
import { Video as VideoType } from '../contexts/VideoContext';
import { Play, Clock } from 'lucide-react';

interface VideoCardProps {
  video: VideoType;
  onClick: () => void;
}

export default function VideoCard({ video, onClick }: VideoCardProps) {
  const formatDuration = (seconds: number) => {
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    return hours > 0 ? `${hours}:${minutes.toString().padStart(2, '0')}` : `${minutes}:${(seconds % 60).toString().padStart(2, '0')}`;
  };

  return (
    <div 
      onClick={onClick}
      className="group cursor-pointer bg-white/10 backdrop-blur-lg rounded-xl overflow-hidden border border-white/20 hover:border-white/40 transition-all duration-300 transform hover:scale-[1.02] hover:shadow-2xl"
    >
      <div className="relative aspect-video overflow-hidden">
        <img
          src={video.thumbnail}
          alt={video.title}
          className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
        />
        <div className="absolute inset-0 bg-black/20 group-hover:bg-black/40 transition-all duration-300" />
        
        <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300">
          <div className="bg-white/20 backdrop-blur-sm rounded-full p-4">
            <Play className="h-8 w-8 text-white fill-white" />
          </div>
        </div>
        
        <div className="absolute bottom-2 right-2 bg-black/70 backdrop-blur-sm rounded px-2 py-1">
          <span className="text-white text-xs font-medium">
            {formatDuration(video.duration)}
          </span>
        </div>
      </div>
      
      <div className="p-4">
        <h3 className="text-white font-semibold text-lg mb-2 line-clamp-2 group-hover:text-blue-300 transition-colors">
          {video.title}
        </h3>
        <p className="text-gray-400 text-sm line-clamp-2 mb-3">
          {video.description}
        </p>
        
        <div className="flex items-center justify-between text-xs text-gray-500">
          <span>{new Date(video.created_at).toLocaleDateString('pt-BR')}</span>
          {video.expiry_date && (
            <div className="flex items-center gap-1">
              <Clock className="h-3 w-3" />
              <span>Expira {new Date(video.expiry_date).toLocaleDateString('pt-BR')}</span>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}