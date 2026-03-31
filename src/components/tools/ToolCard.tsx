import { ExternalLink } from "lucide-react";

// 1. Definisikan Interface agar tidak menggunakan 'any'
interface ToolProps {
  tool: {
    url: string;
    thumbnail: string;
    title: string;
    deskripsi: string;
  };
  onOpen?: (url: string) => void; // Optional callback jika ingin handle klik di parent
}

export const ToolCard = ({ tool }: ToolProps) => {
  return (
    <a 
      href={tool.url} 
      target="_blank" 
      rel="noopener noreferrer" // 3. Tambahkan faktor keamanan untuk tab baru
      className="block" // Agar seluruh area link bisa diklik dengan baik
    >
      <div className="border rounded-xl overflow-hidden hover:shadow-lg transition bg-card">
        <img
          src={tool.thumbnail}
          alt={tool.title} // Tambahkan alt text untuk aksesibilitas
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
    </a>
  );
};