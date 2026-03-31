import {VideoCard} from "../video/VideoCard";
import { videos } from "../data/videoData";

export default function VideoList() {
  return (
    <div className="grid md:grid-cols-3 gap-4">
      {videos.map((video) => (
        <VideoCard key={video.id} video={video} onOpen={function (url: string): void {
          throw new Error("Function not implemented.");
        } } />
      ))}
    </div>
  );
}