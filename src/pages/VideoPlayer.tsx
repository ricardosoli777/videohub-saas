import React from 'react';
import { useParams, Navigate } from 'react-router-dom';
import { useVideos } from '../contexts/VideoContext';
import Header from '../components/Header';
import VideoEmbed from '../components/VideoEmbed';
import { Clock, Calendar, User } from 'lucide-react';

export default function VideoPlayer() {
  const { id } = useParams<{ id: string }>();
  const { videos } = useVideos();
  
  const video = videos.find(v => v.id === id);
  
  if (!video) {
    return <Navigate to="/dashboard" />;
  }

  const formatDuration = (seconds: number) => {
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    return hours > 0 ? `${hours}h ${minutes}m` : `${minutes}m`;
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('pt-BR', {
      day: '2-digit',
      month: 'long',
      year: 'numeric'
    });
  };

  return (
    <div className="min-h-screen">
      <Header />
      
      <main className="container mx-auto px-4 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2">
            <div className="bg-white/10 backdrop-blur-lg rounded-xl border border-white/20 overflow-hidden">
              <VideoEmbed url={video.url} title={video.title} />
            </div>
            
            <div className="mt-6">
              <h1 className="text-3xl font-bold text-white mb-4">{video.title}</h1>
              
              <div className="flex flex-wrap items-center gap-4 mb-6 text-sm text-gray-300">
                <div className="flex items-center gap-2">
                  <Clock className="h-4 w-4" />
                  <span>{formatDuration(video.duration)}</span>
                </div>
                <div className="flex items-center gap-2">
                  <Calendar className="h-4 w-4" />
                  <span>Publicado em {formatDate(video.created_at)}</span>
                </div>
                {video.expiry_date && (
                  <div className="flex items-center gap-2">
                    <Clock className="h-4 w-4 text-orange-400" />
                    <span className="text-orange-400">
                      Expira em {formatDate(video.expiry_date)}
                    </span>
                  </div>
                )}
              </div>
              
              <div className="bg-white/5 rounded-lg p-6">
                <h3 className="text-lg font-semibold text-white mb-3">Descrição</h3>
                <p className="text-gray-300 leading-relaxed whitespace-pre-wrap">
                  {video.description}
                </p>
              </div>
            </div>
          </div>
          
          <div className="lg:col-span-1">
            <div className="bg-white/10 backdrop-blur-lg rounded-xl p-6 border border-white/20">
              <h3 className="text-lg font-semibold text-white mb-4">Informações do Vídeo</h3>
              
              <div className="space-y-4">
                <div className="flex justify-between">
                  <span className="text-gray-400">Status:</span>
                  <span className={`font-medium ${video.is_active ? 'text-green-400' : 'text-red-400'}`}>
                    {video.is_active ? 'Ativo' : 'Inativo'}
                  </span>
                </div>
                
                <div className="flex justify-between">
                  <span className="text-gray-400">Duração:</span>
                  <span className="text-white font-medium">{formatDuration(video.duration)}</span>
                </div>
                
                <div className="flex justify-between">
                  <span className="text-gray-400">Criado em:</span>
                  <span className="text-white font-medium">{formatDate(video.created_at)}</span>
                </div>
                
                {video.expiry_date && (
                  <div className="flex justify-between">
                    <span className="text-gray-400">Expira em:</span>
                    <span className="text-orange-400 font-medium">{formatDate(video.expiry_date)}</span>
                  </div>
                )}
              </div>
            </div>
            
            <div className="mt-6 bg-white/10 backdrop-blur-lg rounded-xl p-6 border border-white/20">
              <h3 className="text-lg font-semibold text-white mb-4">Compartilhar</h3>
              <div className="space-y-3">
                <button className="w-full px-4 py-2 bg-blue-500/20 border border-blue-500/30 rounded-lg text-blue-300 hover:bg-blue-500/30 transition-all">
                  Copiar Link
                </button>
                <button className="w-full px-4 py-2 bg-green-500/20 border border-green-500/30 rounded-lg text-green-300 hover:bg-green-500/30 transition-all">
                  Compartilhar por Email
                </button>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}