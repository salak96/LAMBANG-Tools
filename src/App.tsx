import { useState, useEffect } from "react";
import { Routes, Route, useNavigate } from "react-router-dom";
import { Video, Shield, LogOut } from "lucide-react";
import { Badge } from "./components/ui/badge";
import { Button } from "./components/ui/button";
import Footer from "./components/layout/Footer";
import { VideoCard } from "./components/video/VideoCard";
import { ToolCard } from "./components/tools/ToolCard";
import { AuthProvider, useAuth } from "./context/AuthContext";
import { LoginModal } from "./components/auth/LoginModal";
import { AdminPanel } from "./pages/AdminPanel";

const API = import.meta.env.VITE_API_URL;

interface VideoItem {
  id: number; title: string; subtitle: string; date: string; thumbnail: string; duration: string; url: string; category: string;
}
interface LinkItem { title: string; deskripsi: string; url: string; thumbnail: string; }
interface ToolGroup { name: string; description: string; color?: string; links: LinkItem[]; }

function HomePage() {
  const { user, logout, pendingUrl, setPendingUrl } = useAuth();
  const navigate = useNavigate();
  const [loginOpen, setLoginOpen] = useState(false);
  const [videos, setVideos] = useState<VideoItem[]>([]);
  const [tools, setTools] = useState<ToolGroup[]>([]);

  useEffect(() => {
    fetch(`${API}/videos`).then(r => r.json()).then((data: any[]) => {
      setVideos(data.map(v => ({
        id: v.id, title: v.title, subtitle: v.subtitle || "",
        date: v.date || "", thumbnail: v.thumbnail || "",
        duration: v.duration || "", url: v.url, category: v.category || "",
      })));
    }).catch(() => {});
    fetch(`${API}/tools/groups`).then(r => r.json()).then((data: any[]) => {
      setTools(data.map((g: any) => ({
        name: g.name, description: g.description || "",
        color: g.color,
        links: (g.links || []).map((l: any) => ({
          title: l.title, deskripsi: l.deskripsi || "",
          url: l.url, thumbnail: l.thumbnail || "",
        })),
      })));
    }).catch(() => {});
  }, []);

  useEffect(() => {
    if (user && pendingUrl) {
      window.open(pendingUrl, "_blank");
      setPendingUrl(null);
    }
  }, [user, pendingUrl, setPendingUrl]);

  const openLink = (url: string) => {
    if (user) { window.open(url, "_blank"); }
    else { setPendingUrl(url); setLoginOpen(true); }
  };

  return (
    <div className="min-h-screen bg-[#09090b] text-zinc-100 font-sans">
      <header className="sticky top-0 z-50 border-b border-zinc-800/50 bg-black/60 backdrop-blur-md">
        <div className="max-w-6xl mx-auto px-4 py-3 flex justify-between items-center">
          <div className="flex items-center gap-3">
            <div className="h-10 w-10 bg-gradient-to-br from-purple-500 to-pink-500 rounded-lg flex items-center justify-center">
               <span className="text-white font-bold">P</span>
            </div>
            <div>
              <h1 className="text-md font-bold leading-none">Pawang Affiliate</h1>
              <p className="text-[10px] text-zinc-500 mt-1 uppercase tracking-wider">Story Produk Generator</p>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <Badge variant="outline" className="rounded-full bg-zinc-900/50 border-zinc-800 text-zinc-400 px-3 py-1 font-normal flex items-center gap-2">
              <Video className="h-3.5 w-3.5" /> {videos.length} Video
            </Badge>
            {user?.role === "admin" && (
              <Button variant="ghost" size="icon-sm" onClick={() => navigate("/adminpanel")} className="text-zinc-400 hover:text-white">
                <Shield className="h-4 w-4" />
              </Button>
            )}
            {user ? (
              <Button variant="ghost" size="icon-sm" onClick={logout} className="text-zinc-400 hover:text-white">
                <LogOut className="h-4 w-4" />
              </Button>
            ) : (
              <Button variant="outline" size="sm" onClick={() => setLoginOpen(true)} className="text-zinc-300 border-zinc-700 hover:bg-zinc-800">
                Login
              </Button>
            )}
          </div>
        </div>
      </header>

      <main className="max-w-6xl mx-auto px-4 py-12">
        <div className="text-center mb-16">
          <span className="inline-block px-4 py-1 rounded-full text-[10px] font-bold tracking-[0.2em] text-white bg-gradient-to-r from-[#9333ea] to-[#db2777] mb-8">MEMBER AREA</span>
          <h2 className="text-4xl md:text-5xl font-bold mb-6 tracking-tight text-white">Selamat Datang di Member Area</h2>
          <p className="text-zinc-400 text-lg max-w-2xl mx-auto leading-relaxed">Akses semua tutorial dan panduan untuk menggunakan Pawang Affiliate Story Produk Generator</p>
        </div>

        <div className="mb-12 border border-yellow-700/30 bg-yellow-900/10 rounded-2xl p-4 flex items-center justify-center gap-3 text-center">
          <div className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full border border-yellow-600/50 text-yellow-600 text-[10px] font-bold">!</div>
          <p className="text-yellow-600/80 text-sm font-medium tracking-wide">WAJIB TONTON semua video tutorial sebelum bertanya !!!</p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
          {videos.map((video) => (
            <VideoCard key={video.id} video={video} onOpen={openLink} />
          ))}
        </div>

        <div className="mt-24 max-w-6xl mx-auto px-0 mb-12 text-left">
          <h2 className="text-3xl font-bold text-white tracking-tight">TOOLS AI</h2>
          <div className="h-1 w-12 bg-purple-500 mt-4 mb-4 rounded-full"></div>
          <p className="text-zinc-500 text-sm max-w-md">Kumpulan tools AI terbaik untuk membantu kamu membuat konten affiliate secara otomatis dan cepat.</p>
        </div>

        <div className="max-w-6xl mx-auto">
          {tools.map((tool, index) => (
            <div key={index} className="mb-20 text-center">
              <div className="mb-10">
                <h3 className="text-xl font-bold text-white mb-2">{tool.name}</h3>
                <p className="text-zinc-500 text-sm max-w-lg mx-auto">{tool.description}</p>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 justify-center">
                {tool.links.map((link, i) => (
                  <div key={i} className="flex justify-center">
                    <div className="w-full max-w-sm text-left">
                      <ToolCard tool={link} onOpen={openLink} />
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      </main>
      <Footer />
      <LoginModal open={loginOpen} onClose={() => { setLoginOpen(false); setPendingUrl(null); }} />
    </div>
  );
}

function App() {
  return (
    <AuthProvider>
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/adminpanel" element={<AdminPanel />} />
      </Routes>
    </AuthProvider>
  );
}

export default App;
