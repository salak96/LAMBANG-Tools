import { VideoCard } from "../video/VideoCard";
import { videos } from "../data/videoData";

export default function VideoList() {
  const handleOpen = (url: string) => {
    window.open(url, "_blank");
  };

  return (
    <div className="grid md:grid-cols-3 gap-4">
      {videos.map((video) => (
        <VideoCard key={video.id} video={video} onOpen={handleOpen} />
      ))}
    </div>
  );
}