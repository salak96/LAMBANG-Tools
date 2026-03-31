import VideoCard from "./VideoCard";
import { videos } from "../../data/videos";

export default function VideoList() {
  return (
    <div className="grid md:grid-cols-3 gap-4">
      {videos.map((video) => (
        <VideoCard key={video.id} video={video} />
      ))}
    </div>
  );
}