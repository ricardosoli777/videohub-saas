import React, { useState } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { useVideos } from '../contexts/VideoContext';
import Header from '../components/Header';
import VideoForm from '../components/VideoForm';
import VideoTable from '../components/VideoTable';
import { Video as VideoType } from '../contexts/VideoContext';
import { Plus, Users, Video, BarChart3, Settings } from 'lucide-react';

export default function AdminPanel() {
  const { user } = useAuth();
  const { videos } = useVideos();
  const [activeTab, setActiveTab] = useState<'videos' | 'users' | 'analytics'>('videos');
  const [showVideoForm, setShowVideoForm] = useState(false);
  const [editingVideo, setEditingVideo] = useState<VideoType | null>(null);

  if (user?.role !== 'admin') {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-white mb-4">Acesso Negado</h1>
          <p className="text-gray-300">Você não tem permissão para acessar esta página.</p>
        </div>
      </div>
    );
  }

  const activeVideos = videos.filter(v => v.is_active).length;
  const expiredVideos = videos.filter(v => {
    if (!v.expiry_date) return false;
    return new Date(v.expiry_date) < new Date();
  }).length;

  const handleEditVideo = (video: VideoType) => {
    setEditingVideo(video);
    setShowVideoForm(true);
  };

  const handleCloseForm = () => {
    setShowVideoForm(false);
    setEditingVideo(null);
  };

  const tabs = [
    { id: 'videos', label: 'Vídeos', icon: Video },
    { id: 'users', label: 'Usuários', icon: Users },
    { id: 'analytics', label: 'Analytics', icon: BarChart3 },
  ] as const;

  return (
    <div className="min-h-screen">
      <Header />
      
      <main className="container mx-auto px-4 py-8">
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-white mb-2">Painel Administrativo</h1>
          <p className="text-gray-300 text-lg">Gerencie conteúdos e usuários da plataforma</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <div className="bg-white/10 backdrop-blur-lg rounded-xl p-6 border border-white/20">
            <div className="flex items-center justify-between mb-4">
              <div className="bg-green-500/20 p-3 rounded-lg">
                <Video className="h-6 w-6 text-green-400" />
              </div>
              <span className="text-2xl font-bold text-white">{activeVideos}</span>
            </div>
            <h3 className="text-lg font-semibold text-white mb-1">Vídeos Ativos</h3>
            <p className="text-gray-400 text-sm">Conteúdos disponíveis</p>
          </div>

          <div className="bg-white/10 backdrop-blur-lg rounded-xl p-6 border border-white/20">
            <div className="flex items-center justify-between mb-4">
              <div className="bg-blue-500/20 p-3 rounded-lg">
                <Users className="h-6 w-6 text-blue-400" />
              </div>
              <span className="text-2xl font-bold text-white">24</span>
            </div>
            <h3 className="text-lg font-semibold text-white mb-1">Usuários</h3>
            <p className="text-gray-400 text-sm">Membros ativos</p>
          </div>

          <div className="bg-white/10 backdrop-blur-lg rounded-xl p-6 border border-white/20">
            <div className="flex items-center justify-between mb-4">
              <div className="bg-orange-500/20 p-3 rounded-lg">
                <BarChart3 className="h-6 w-6 text-orange-400" />
              </div>
              <span className="text-2xl font-bold text-white">{expiredVideos}</span>
            </div>
            <h3 className="text-lg font-semibold text-white mb-1">Expirados</h3>
            <p className="text-gray-400 text-sm">Conteúdos vencidos</p>
          </div>
        </div>

        <div className="bg-white/10 backdrop-blur-lg rounded-xl border border-white/20 overflow-hidden">
          <div className="border-b border-white/20">
            <nav className="flex">
              {tabs.map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`flex items-center gap-2 px-6 py-4 font-medium transition-all ${
                    activeTab === tab.id
                      ? 'text-blue-400 border-b-2 border-blue-400 bg-blue-500/10'
                      : 'text-gray-300 hover:text-white hover:bg-white/5'
                  }`}
                >
                  <tab.icon className="h-5 w-5" />
                  {tab.label}
                </button>
              ))}
            </nav>
          </div>

          <div className="p-6">
            {activeTab === 'videos' && (
              <div>
                <div className="flex justify-between items-center mb-6">
                  <h2 className="text-2xl font-semibold text-white">Gerenciar Vídeos</h2>
                  <button
                    onClick={() => setShowVideoForm(true)}
                    className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-blue-500 to-purple-600 text-white rounded-lg hover:from-blue-600 hover:to-purple-700 transition-all transform hover:scale-105"
                  >
                    <Plus className="h-5 w-5" />
                    Adicionar Vídeo
                  </button>
                </div>
                <VideoTable onEdit={handleEditVideo} />
              </div>
            )}

            {activeTab === 'users' && (
              <div>
                <h2 className="text-2xl font-semibold text-white mb-6">Gerenciar Usuários</h2>
                <div className="bg-white/5 rounded-lg p-8 text-center">
                  <Users className="h-16 w-16 text-gray-400 mx-auto mb-4" />
                  <p className="text-gray-300">Funcionalidade de gerenciamento de usuários</p>
                  <p className="text-gray-400 text-sm mt-2">Em desenvolvimento</p>
                </div>
              </div>
            )}

            {activeTab === 'analytics' && (
              <div>
                <h2 className="text-2xl font-semibold text-white mb-6">Analytics</h2>
                <div className="bg-white/5 rounded-lg p-8 text-center">
                  <BarChart3 className="h-16 w-16 text-gray-400 mx-auto mb-4" />
                  <p className="text-gray-300">Dashboard de analytics e relatórios</p>
                  <p className="text-gray-400 text-sm mt-2">Em desenvolvimento</p>
                </div>
              </div>
            )}
          </div>
        </div>
      </main>

      <VideoModal
        video={editingVideo}
        isOpen={showVideoForm}
        onClose={handleCloseForm}
        isEdit={!!editingVideo}
      />
    </div>
  );
}