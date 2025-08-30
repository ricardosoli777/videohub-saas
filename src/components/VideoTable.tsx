import React from 'react';
import { useVideos } from '../contexts/VideoContext';
import { Video as VideoType } from '../contexts/VideoContext';
import { Edit, Trash2, Clock, CheckCircle, XCircle } from 'lucide-react';

interface VideoTableProps {
  onEdit: (video: VideoType) => void;
}

export default function VideoTable({ onEdit }: VideoTableProps) {
  const { videos, deleteVideo } = useVideos();

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('pt-BR');
  };

  const formatDuration = (seconds: number) => {
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    return hours > 0 ? `${hours}h ${minutes}m` : `${minutes}m`;
  };

  const getStatusInfo = (video: VideoType) => {
    if (!video.is_active) {
      return { text: 'Inativo', color: 'text-red-400', icon: XCircle };
    }
    
    if (video.expiry_date && new Date(video.expiry_date) < new Date()) {
      return { text: 'Expirado', color: 'text-orange-400', icon: Clock };
    }
    
    return { text: 'Ativo', color: 'text-green-400', icon: CheckCircle };
  };

  const handleDelete = (id: string) => {
    if (window.confirm('Tem certeza que deseja excluir este vídeo?')) {
      deleteVideo(id);
    }
  };

  return (
    <div className="overflow-x-auto">
      <table className="w-full">
        <thead>
          <tr className="border-b border-white/20">
            <th className="text-left py-4 px-4 text-gray-300 font-semibold">Vídeo</th>
            <th className="text-left py-4 px-4 text-gray-300 font-semibold">Status</th>
            <th className="text-left py-4 px-4 text-gray-300 font-semibold">Duração</th>
            <th className="text-left py-4 px-4 text-gray-300 font-semibold">Criado</th>
            <th className="text-left py-4 px-4 text-gray-300 font-semibold">Expira</th>
            <th className="text-left py-4 px-4 text-gray-300 font-semibold">Ações</th>
          </tr>
        </thead>
        <tbody>
          {videos.map((video) => {
            const statusInfo = getStatusInfo(video);
            const StatusIcon = statusInfo.icon;
            
            return (
              <tr key={video.id} className="border-b border-white/10 hover:bg-white/5 transition-colors">
                <td className="py-4 px-4">
                  <div className="flex items-center gap-3">
                    <img
                      src={video.thumbnail}
                      alt={video.title}
                      className="w-16 h-10 rounded object-cover"
                    />
                    <div>
                      <h4 className="text-white font-medium">{video.title}</h4>
                      <p className="text-gray-400 text-sm truncate max-w-xs">
                        {video.description}
                      </p>
                    </div>
                  </div>
                </td>
                <td className="py-4 px-4">
                  <div className={`flex items-center gap-2 ${statusInfo.color}`}>
                    <StatusIcon className="h-4 w-4" />
                    <span className="text-sm font-medium">{statusInfo.text}</span>
                  </div>
                </td>
                <td className="py-4 px-4 text-gray-300">
                  {formatDuration(video.duration)}
                </td>
                <td className="py-4 px-4 text-gray-300">
                  {formatDate(video.created_at)}
                </td>
                <td className="py-4 px-4 text-gray-300">
                  {video.expiry_date ? formatDate(video.expiry_date) : '—'}
                </td>
                <td className="py-4 px-4">
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => onEdit(video)}
                      className="p-2 bg-blue-500/20 border border-blue-500/30 rounded-lg text-blue-300 hover:bg-blue-500/30 transition-all"
                    >
                      <Edit className="h-4 w-4" />
                    </button>
                    <button
                      onClick={() => handleDelete(video.id)}
                      className="p-2 bg-red-500/20 border border-red-500/30 rounded-lg text-red-300 hover:bg-red-500/30 transition-all"
                    >
                      <Trash2 className="h-4 w-4" />
                    </button>
                  </div>
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>

      {videos.length === 0 && (
        <div className="text-center py-12">
          <Video className="h-16 w-16 text-gray-400 mx-auto mb-4" />
          <h3 className="text-xl font-semibold text-white mb-2">Nenhum vídeo cadastrado</h3>
          <p className="text-gray-400">Adicione seu primeiro vídeo para começar</p>
        </div>
      )}
    </div>
  );
}