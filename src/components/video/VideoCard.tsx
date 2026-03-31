import React from 'react';
import { Play, Youtube } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { type VideoItem } from "../type";

interface Props {
  video: VideoItem;
  onOpen: (url: string) => void;
}

export const VideoCard: React.FC<Props> = ({ video, onOpen }) => (
  <Card
    onClick={() => onOpen(video.url)}
    className="group cursor-pointer overflow-hidden hover:border-primary/50 transition"
  >
    <CardContent className="p-0">
      <div className="relative aspect-video">
        <img src={video.thumbnail} alt={video.title} className="w-full h-full object-cover" />
        <div className="absolute inset-0 flex items-center justify-center bg-black/40 opacity-0 group-hover:opacity-100 transition">
          <div className="h-14 w-14 flex items-center justify-center rounded-full bg-red-600">
            <Play className="text-white fill-white ml-1" />
          </div>
        </div>
        <div className="absolute bottom-2 right-2 text-xs bg-black/80 px-2 py-1 rounded text-white">
          {video.duration}
        </div>
      </div>
      <div className="p-4">
        <p className="text-xs text-muted-foreground">{video.date}</p>
        <h3 className="font-semibold text-sm mt-1">{video.title}</h3>
        <p className="text-xs text-muted-foreground">{video.subtitle}</p>
        <div className="flex justify-end mt-2">
          <Youtube className="h-4 w-4 text-red-500" />
        </div>
      </div>
    </CardContent>
  </Card>
);