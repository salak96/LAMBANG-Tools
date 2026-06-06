import { ExternalLink } from "lucide-react";

interface ToolProps {
  tool: {
    url: string;
    thumbnail: string;
    title: string;
    deskripsi: string;
  };
  onOpen: (url: string) => void;
}

export const ToolCard = ({ tool, onOpen }: ToolProps) => {
  return (
    <div
      onClick={() => onOpen(tool.url)}
      className="block cursor-pointer"
    >
      <div className="border rounded-xl overflow-hidden hover:shadow-lg transition bg-card">
        <img
          src={tool.thumbnail}
          alt={tool.title}
          className="h-40 w-full object-cover"
        />

        <div className="p-3">
          <h3 className="font-semibold line-clamp-1">{tool.title}</h3>
          <p className="text-sm text-muted-foreground line-clamp-2 mt-1">
            {tool.deskripsi}
          </p>

          <div className="flex items-center gap-2 mt-3 text-blue-500 text-sm font-medium">
            <ExternalLink size={14} /> 
            <span>Buka Akses</span>
          </div>
        </div>
      </div>
    </div>
  );
};