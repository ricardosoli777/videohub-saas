import React, { useState, useEffect } from 'react';
import { useVideos } from '../contexts/VideoContext';
import { useAuth } from '../contexts/AuthContext';
import { Video as VideoType } from '../contexts/VideoContext';
import { Save, Calendar, Link as LinkIcon, FileText, Image } from 'lucide-react';

interface VideoFormProps {
  video?: VideoType | null;
  onClose: () => void;
}

export default function VideoForm({ video, onClose }: VideoFormProps) {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [url, setUrl] = useState('');
  const [thumbnail, setThumbnail] = useState('');
  const [duration, setDuration] = useState(0);
  const [expiryDate, setExpiryDate] = useState('');
  const [isActive, setIsActive] = useState(true);
  const [loading, setLoading] = useState(false);

  const { addVideo, updateVideo } = useVideos();
  const { user } = useAuth();

  useEffect(() => {
    if (video) {
      setTitle(video.title);
      setDescription(video.description);
      setUrl(video.url);
      setThumbnail(video.thumbnail);
      setDuration(video.duration);
      setExpiryDate(video.expiry_date ? video.expiry_date.split('T')[0] : '');
      setIsActive(video.is_active);
    }
  }, [video]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    const videoData = {
      title,
      description,
      url,
      thumbnail: thumbnail || 'https://images.pexels.com/photos/270404/pexels-photo-270404.jpeg?auto=compress&cs=tinysrgb&w=300',
      duration,
      expiry_date: expiryDate || undefined,
      is_active: isActive,
      created_by: user!.id,
    };

    try {
      if (video) {
        updateVideo(video.id, videoData);
      } else {
        addVideo(videoData);
      }
      onClose();
    } catch (error) {
      console.error('Erro ao salvar vídeo:', error);
    } finally {
      setLoading(false);
    }
  };

  const formatDurationInput = (seconds: number) => {
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    const secs = seconds % 60;
    return `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  const parseDurationInput = (timeString: string) => {
    const parts = timeString.split(':').map(Number);
    if (parts.length === 3) {
      return parts[0] * 3600 + parts[1] * 60 + parts[2];
    }
    return 0;
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <label className="block text-sm font-medium text-gray-300 mb-2">
            <FileText className="inline h-4 w-4 mr-2" />
            Título *
          </label>
          <input
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
            placeholder="Título do vídeo"
            required
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-300 mb-2">
            <LinkIcon className="inline h-4 w-4 mr-2" />
            URL do Vídeo *
          </label>
          <input
            type="url"
            value={url}
            onChange={(e) => setUrl(e.target.value)}
            className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
            placeholder="https://youtube.com/watch?v=..."
            required
          />
        </div>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-300 mb-2">
          <FileText className="inline h-4 w-4 mr-2" />
          Descrição
        </label>
        <textarea
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          rows={4}
          className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all resize-none"
          placeholder="Descrição do vídeo..."
        />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <label className="block text-sm font-medium text-gray-300 mb-2">
            <Image className="inline h-4 w-4 mr-2" />
            URL da Thumbnail
          </label>
          <input
            type="url"
            value={thumbnail}
            onChange={(e) => setThumbnail(e.target.value)}
            className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
            placeholder="https://exemplo.com/imagem.jpg"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-300 mb-2">
            Duração (HH:MM:SS)
          </label>
          <input
            type="text"
            value={formatDurationInput(duration)}
            onChange={(e) => setDuration(parseDurationInput(e.target.value))}
            className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
            placeholder="00:30:00"
          />
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <label className="block text-sm font-medium text-gray-300 mb-2">
            <Calendar className="inline h-4 w-4 mr-2" />
            Data de Expiração
          </label>
          <input
            type="date"
            value={expiryDate}
            onChange={(e) => setExpiryDate(e.target.value)}
            className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
          />
          <p className="text-xs text-gray-400 mt-1">Deixe vazio para nunca expirar</p>
        </div>

        <div className="flex items-end">
          <label className="flex items-center gap-3 cursor-pointer">
            <input
              type="checkbox"
              checked={isActive}
              onChange={(e) => setIsActive(e.target.checked)}
              className="w-5 h-5 text-blue-500 bg-white/10 border-white/20 rounded focus:ring-blue-500 focus:ring-2"
            />
            <span className="text-white font-medium">Vídeo ativo</span>
          </label>
        </div>
      </div>

      <div className="flex gap-4 pt-6 border-t border-white/20">
        <button
          type="button"
          onClick={onClose}
          className="flex-1 px-6 py-3 bg-white/10 border border-white/20 text-white rounded-lg hover:bg-white/20 transition-all"
        >
          Cancelar
        </button>
        <button
          type="submit"
          disabled={loading}
          className="flex-1 flex items-center justify-center gap-2 px-6 py-3 bg-gradient-to-r from-blue-500 to-purple-600 text-white rounded-lg hover:from-blue-600 hover:to-purple-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all transform hover:scale-[1.02]"
        >
          <Save className="h-5 w-5" />
          {loading ? 'Salvando...' : video ? 'Atualizar' : 'Salvar'}
        </button>
      </div>
    </form>
  );
}