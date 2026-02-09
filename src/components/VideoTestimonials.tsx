import { Card, CardContent } from "@/components/ui/card";
import { useState } from "react";
import Icon from "@/components/ui/icon";

interface VideoTestimonial {
  id: number;
  clientName: string;
  description: string;
  videoUrl: string;
  videoType: 'upload' | 'youtube' | 'link';
}

const VideoTestimonials = () => {
  const [videos, setVideos] = useState<VideoTestimonial[]>([
    {
      id: 1,
      clientName: "Клиент 1",
      description: "Разблокировка за 3 дня",
      videoUrl: "",
      videoType: 'upload'
    },
    {
      id: 2,
      clientName: "Клиент 2",
      description: "Разблокировка за 5 дней",
      videoUrl: "",
      videoType: 'upload'
    },
    {
      id: 3,
      clientName: "Клиент 3",
      description: "Разблокировка за 2 дня",
      videoUrl: "",
      videoType: 'upload'
    }
  ]);

  const [editMode, setEditMode] = useState(false);
  const [editingId, setEditingId] = useState<number | null>(null);
  const [editForm, setEditForm] = useState({
    clientName: "",
    description: "",
    videoUrl: "",
    videoType: 'upload' as 'upload' | 'youtube' | 'link'
  });

  const getYouTubeEmbedUrl = (url: string) => {
    const regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|&v=)([^#&?]*).*/;
    const match = url.match(regExp);
    return match && match[2].length === 11
      ? `https://www.youtube.com/embed/${match[2]}`
      : url;
  };

  const handleEdit = (video: VideoTestimonial) => {
    setEditingId(video.id);
    setEditForm({
      clientName: video.clientName,
      description: video.description,
      videoUrl: video.videoUrl,
      videoType: video.videoType
    });
  };

  const handleSave = () => {
    if (editingId) {
      setVideos(videos.map(v => 
        v.id === editingId 
          ? { ...v, ...editForm }
          : v
      ));
      setEditingId(null);
    }
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>, id: number) => {
    const file = e.target.files?.[0];
    if (file) {
      const url = URL.createObjectURL(file);
      setVideos(videos.map(v => 
        v.id === id 
          ? { ...v, videoUrl: url, videoType: 'upload' as const }
          : v
      ));
    }
  };

  return (
    <div className="max-w-5xl mx-auto animate-on-scroll opacity-0 translate-y-8">
      <div className="flex justify-between items-center mb-8 md:mb-12">
        <h2 className="text-2xl md:text-4xl font-bold">Видео отзывы наших клиентов</h2>
        <button
          onClick={() => setEditMode(!editMode)}
          className="text-sm text-primary hover:text-primary/80 flex items-center gap-2"
        >
          <Icon name={editMode ? "X" : "Edit"} size={16} />
          {editMode ? "Готово" : "Редактировать"}
        </button>
      </div>
      
      <div className="grid md:grid-cols-3 gap-6">
        {videos.map((video) => (
          <Card key={video.id} className="hover:shadow-xl transition-shadow duration-300">
            <CardContent className="p-0">
              <div className="aspect-[9/16] bg-muted flex items-center justify-center rounded-t-lg overflow-hidden relative">
                {editingId === video.id ? (
                  <div className="absolute inset-0 p-4 bg-white z-10 overflow-y-auto">
                    <div className="space-y-3">
                      <div>
                        <label className="text-xs font-semibold block mb-1">Имя клиента</label>
                        <input
                          type="text"
                          value={editForm.clientName}
                          onChange={(e) => setEditForm({...editForm, clientName: e.target.value})}
                          className="w-full px-2 py-1 border rounded text-sm"
                          placeholder="Имя клиента"
                        />
                      </div>
                      
                      <div>
                        <label className="text-xs font-semibold block mb-1">Описание</label>
                        <input
                          type="text"
                          value={editForm.description}
                          onChange={(e) => setEditForm({...editForm, description: e.target.value})}
                          className="w-full px-2 py-1 border rounded text-sm"
                          placeholder="Описание"
                        />
                      </div>

                      <div>
                        <label className="text-xs font-semibold block mb-1">Тип видео</label>
                        <select
                          value={editForm.videoType}
                          onChange={(e) => setEditForm({...editForm, videoType: e.target.value as 'upload' | 'youtube' | 'link'})}
                          className="w-full px-2 py-1 border rounded text-sm"
                        >
                          <option value="upload">Загрузить файл</option>
                          <option value="youtube">YouTube ссылка</option>
                          <option value="link">Прямая ссылка</option>
                        </select>
                      </div>

                      {editForm.videoType === 'upload' ? (
                        <div>
                          <label className="text-xs font-semibold block mb-1">Загрузить видео</label>
                          <input
                            type="file"
                            accept="video/*"
                            onChange={(e) => handleFileUpload(e, video.id)}
                            className="w-full text-xs"
                          />
                        </div>
                      ) : (
                        <div>
                          <label className="text-xs font-semibold block mb-1">
                            {editForm.videoType === 'youtube' ? 'YouTube URL' : 'Ссылка на видео'}
                          </label>
                          <input
                            type="text"
                            value={editForm.videoUrl}
                            onChange={(e) => setEditForm({...editForm, videoUrl: e.target.value})}
                            className="w-full px-2 py-1 border rounded text-sm"
                            placeholder={editForm.videoType === 'youtube' ? 'https://youtube.com/watch?v=...' : 'https://...'}
                          />
                        </div>
                      )}

                      <button
                        onClick={handleSave}
                        className="w-full bg-primary text-white py-2 rounded text-sm hover:bg-primary/90"
                      >
                        Сохранить
                      </button>
                    </div>
                  </div>
                ) : video.videoUrl ? (
                  video.videoType === 'youtube' ? (
                    <iframe
                      src={getYouTubeEmbedUrl(video.videoUrl)}
                      className="w-full h-full"
                      allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                      allowFullScreen
                    />
                  ) : (
                    <video
                      src={video.videoUrl}
                      controls
                      className="w-full h-full object-cover"
                    />
                  )
                ) : (
                  <div className="text-center p-6">
                    <div className="text-4xl mb-3">🎥</div>
                    <p className="text-sm text-muted-foreground">Место для видео {video.id}</p>
                    {editMode && (
                      <button
                        onClick={() => handleEdit(video)}
                        className="mt-3 text-xs text-primary hover:underline"
                      >
                        Добавить видео
                      </button>
                    )}
                  </div>
                )}
              </div>
              
              <div className="p-4 relative">
                <p className="text-sm font-semibold">{video.clientName}</p>
                <p className="text-xs text-muted-foreground mt-1">{video.description}</p>
                
                {editMode && video.videoUrl && (
                  <button
                    onClick={() => handleEdit(video)}
                    className="absolute top-2 right-2 text-primary hover:text-primary/80"
                  >
                    <Icon name="Edit" size={14} />
                  </button>
                )}
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
};

export default VideoTestimonials;