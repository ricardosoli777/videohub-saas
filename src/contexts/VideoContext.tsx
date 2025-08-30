import React, { createContext, useContext, useState, useEffect } from 'react';

export interface Video {
  id: string;
  title: string;
  description: string;
  url: string;
  thumbnail: string;
  duration: number;
  expiry_date?: string;
  is_active: boolean;
  created_at: string;
  created_by: string;
}

interface VideoContextType {
  videos: Video[];
  loading: boolean;
  addVideo: (video: Omit<Video, 'id' | 'created_at'>) => void;
  updateVideo: (id: string, updates: Partial<Video>) => void;
  deleteVideo: (id: string) => void;
  getActiveVideos: () => Video[];
}

const VideoContext = createContext<VideoContextType | undefined>(undefined);

export function useVideos() {
  const context = useContext(VideoContext);
  if (context === undefined) {
    throw new Error('useVideos must be used within a VideoProvider');
  }
  return context;
}

export function VideoProvider({ children }: { children: React.ReactNode }) {
  const [videos, setVideos] = useState<Video[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Carregar vídeos mockados
    const mockVideos: Video[] = [
      {
        id: '1',
        title: 'Introdução ao React',
        description: 'Aprenda os conceitos básicos do React',
        url: 'https://www.youtube.com/watch?v=w7ejDZ8SWv8',
        thumbnail: 'https://images.pexels.com/photos/270404/pexels-photo-270404.jpeg?auto=compress&cs=tinysrgb&w=300',
        duration: 1800,
        expiry_date: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString(),
        is_active: true,
        created_at: new Date().toISOString(),
        created_by: '1',
      },
      {
        id: '2',
        title: 'Docker para Iniciantes',
        description: 'Containerização com Docker',
        url: 'https://www.youtube.com/watch?v=fqMOX6JJhGo',
        thumbnail: 'https://images.pexels.com/photos/574071/pexels-photo-574071.jpeg?auto=compress&cs=tinysrgb&w=300',
        duration: 2400,
        is_active: true,
        created_at: new Date().toISOString(),
        created_by: '1',
      },
      {
        id: '3',
        title: 'TypeScript Avançado',
        description: 'Conceitos avançados de TypeScript',
        url: 'https://www.youtube.com/watch?v=ahCwqrYpIuM',
        thumbnail: 'https://images.pexels.com/photos/11035380/pexels-photo-11035380.jpeg?auto=compress&cs=tinysrgb&w=300',
        duration: 3600,
        expiry_date: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000).toISOString(),
        is_active: true,
        created_at: new Date().toISOString(),
        created_by: '1',
      },
    ];
    
    setVideos(mockVideos);
    setLoading(false);
  }, []);

  const addVideo = (videoData: Omit<Video, 'id' | 'created_at'>) => {
    const newVideo: Video = {
      ...videoData,
      id: Date.now().toString(),
      created_at: new Date().toISOString(),
    };
    setVideos(prev => [...prev, newVideo]);
  };

  const updateVideo = (id: string, updates: Partial<Video>) => {
    setVideos(prev => 
      prev.map(video => 
        video.id === id ? { ...video, ...updates } : video
      )
    );
  };

  const deleteVideo = (id: string) => {
    setVideos(prev => prev.filter(video => video.id !== id));
  };

  const getActiveVideos = () => {
    const now = new Date();
    return videos.filter(video => {
      if (!video.is_active) return false;
      if (!video.expiry_date) return true;
      return new Date(video.expiry_date) > now;
    });
  };

  return (
    <VideoContext.Provider value={{
      videos,
      loading,
      addVideo,
      updateVideo,
      deleteVideo,
      getActiveVideos,
    }}>
      {children}
    </VideoContext.Provider>
  );
}