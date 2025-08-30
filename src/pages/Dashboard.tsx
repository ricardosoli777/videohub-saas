import React, { useState } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { useVideos } from '../contexts/VideoContext';
import Header from '../components/Header';
import VideoCard from '../components/VideoCard';
import VideoModal from '../components/VideoModal';
import { Video as VideoType } from '../contexts/VideoContext';
import { Plus, Search, Filter, Clock } from 'lucide-react';

export default function Dashboard() {
  const { user } = useAuth();
  const { getActiveVideos, loading } = useVideos();
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedVideo, setSelectedVideo] = useState<VideoType | null>(null);
  const [showModal, setShowModal] = useState(false);

  const activeVideos = getActiveVideos();
  const filteredVideos = activeVideos.filter(video =>
    video.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    video.description.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleVideoClick = (video: VideoType) => {
    setSelectedVideo(video);
    setShowModal(true);
  };

  const getExpiryInfo = (expiryDate?: string) => {
    if (!expiryDate) return null;
    
    const now = new Date();
    const expiry = new Date(expiryDate);
    const diffTime = expiry.getTime() - now.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    
    if (diffDays <= 0) return { text: 'Expirado', color: 'text-red-400' };
    if (diffDays === 1) return { text: 'Expira hoje', color: 'text-orange-400' };
    if (diffDays <= 3) return { text: `Expira em ${diffDays} dias`, color: 'text-yellow-400' };
    return { text: `Expira em ${diffDays} dias`, color: 'text-green-400' };
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen">
      <Header />
      
      <main className="container mx-auto px-4 py-8">
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-white mb-2">
            Bem-vindo, {user?.email.split('@')[0]}!
          </h1>
          <p className="text-gray-300 text-lg">
            Descubra conteúdos exclusivos em nossa plataforma
          </p>
        </div>

        <div className="mb-8 flex flex-col sm:flex-row gap-4">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
            <input
              type="text"
              placeholder="Buscar vídeos..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-3 bg-white/10 border border-white/20 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
            />
          </div>
          
          <button className="flex items-center gap-2 px-6 py-3 bg-white/10 border border-white/20 rounded-lg text-white hover:bg-white/20 transition-all">
            <Filter className="h-5 w-5" />
            Filtros
          </button>
        </div>

        <div className="mb-6 flex items-center justify-between">
          <h2 className="text-2xl font-semibold text-white">
            Vídeos Disponíveis ({filteredVideos.length})
          </h2>
          
          {user?.role === 'admin' && (
            <button
              onClick={() => setShowModal(true)}
              className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-blue-500 to-purple-600 text-white rounded-lg hover:from-blue-600 hover:to-purple-700 transition-all transform hover:scale-105"
            >
              <Plus className="h-5 w-5" />
              Novo Vídeo
            </button>
          )}
        </div>

        {filteredVideos.length === 0 ? (
          <div className="text-center py-16">
            <div className="bg-white/5 rounded-full p-6 w-24 h-24 mx-auto mb-4 flex items-center justify-center">
              <Video className="h-12 w-12 text-gray-400" />
            </div>
            <h3 className="text-xl font-semibold text-white mb-2">
              {searchTerm ? 'Nenhum vídeo encontrado' : 'Nenhum vídeo disponível'}
            </h3>
            <p className="text-gray-400">
              {searchTerm 
                ? 'Tente buscar por outros termos' 
                : 'Novos vídeos serão adicionados em breve'
              }
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {filteredVideos.map((video) => {
              const expiryInfo = getExpiryInfo(video.expiry_date);
              return (
                <div key={video.id} className="relative group">
                  <VideoCard 
                    video={video} 
                    onClick={() => handleVideoClick(video)} 
                  />
                  {expiryInfo && (
                    <div className="absolute top-3 right-3 bg-black/70 backdrop-blur-sm rounded-full px-2 py-1 flex items-center gap-1">
                      <Clock className="h-3 w-3 text-gray-300" />
                      <span className={`text-xs font-medium ${expiryInfo.color}`}>
                        {expiryInfo.text}
                      </span>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        )}
      </main>

      <VideoModal
        video={selectedVideo}
        isOpen={showModal}
        onClose={() => {
          setShowModal(false);
          setSelectedVideo(null);
        }}
      />
    </div>
  );
}