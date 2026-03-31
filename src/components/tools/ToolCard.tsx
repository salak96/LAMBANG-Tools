import { ExternalLink } from "lucide-react";

export default function ToolCard({ tool }: any) {
  return (
    <a href={tool.url} target="_blank">
      <div className="border rounded-xl overflow-hidden hover:shadow-lg transition">
        <img
          src={tool.thumbnail}
          className="h-40 w-full object-cover"
        />

        <div className="p-3">
          <h3 className="font-semibold">{tool.title}</h3>
          <p className="text-sm text-muted-foreground">
            {tool.deskripsi}
          </p>

          <div className="flex items-center gap-2 mt-2 text-blue-500 text-sm">
            <ExternalLink size={14} /> Buka
          </div>
        </div>
      </div>
    </a>
  );
}