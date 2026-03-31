import { Card, CardContent } from "@/components/ui/card";
import { Play } from "lucide-react";

export default function VideoCard({ video }: any) {
  return (
    <Card className="overflow-hidden hover:shadow-lg transition">
      <img
        src={video.thumbnail}
        className="w-full h-40 object-cover"
      />

      <CardContent className="p-4">
        <h3 className="font-semibold">{video.title}</h3>
        <p className="text-sm text-muted-foreground">
          {video.subtitle}
        </p>

        <div className="flex justify-between text-xs mt-2">
          <span>{video.date}</span>
          <span>{video.duration}</span>
        </div>

        <a
          href={video.url}
          target="_blank"
          className="flex items-center gap-2 mt-3 text-blue-500"
        >
          <Play size={16} /> Tonton
        </a>
      </CardContent>
    </Card>
  );
}