import { useState, useEffect } from "react";
import { useAuth } from "../context/AuthContext";
import { useNavigate } from "react-router-dom";
import { Pencil, Trash2, Save, X, Eye, EyeOff } from "lucide-react";

type Tab = "videos" | "tools" | "users";
const API = "http://localhost:3000/api";

interface Video {
  id: number; title: string; subtitle?: string; date?: string;
  thumbnail?: string; duration?: string; url: string; category?: string;
}
interface ToolGroup {
  id: number; name: string; description?: string; color?: string; links: ToolLink[];
}
interface ToolLink {
  id: number; title: string; deskripsi?: string; url: string; thumbnail?: string; groupId: number;
}

export function AdminPanel() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [tab, setTab] = useState<Tab>("videos");
  const [videos, setVideos] = useState<Video[]>([]);
  const [groups, setGroups] = useState<ToolGroup[]>([]);
  const [usersList, setUsersList] = useState<{ id: number; email: string; role: string; createdAt: string }[]>([]);

  // User registration form
  const [uEmail, setUEmail] = useState("");
  const [uPassword, setUPassword] = useState("");
  const [uError, setUError] = useState("");
  const [uSuccess, setUSuccess] = useState("");
  const [uEditingId, setUEditingId] = useState<number | null>(null);
  const [uEditEmail, setUEditEmail] = useState("");
  const [uEditPassword, setUEditPassword] = useState("");
  const [uEditRole, setUEditRole] = useState("user");
  const [showPassRegister, setShowPassRegister] = useState(false);
  const [showPassEdit, setShowPassEdit] = useState(false);

  // Video form
  const [vForm, setVForm] = useState<Partial<Video>>({});
  const [vEditing, setVEditing] = useState<number | null>(null);

  // Tool group form
  const [gForm, setGForm] = useState<Partial<ToolGroup>>({});
  const [gEditing, setGEditing] = useState<number | null>(null);

  // Tool link form
  const [lForm, setLForm] = useState<Partial<ToolLink>>({});
  const [lEditing, setLEditing] = useState<number | null>(null);

  const token = localStorage.getItem("token");
  const headers = { "Content-Type": "application/json", Authorization: `Bearer ${token}` };

  const fetchUsers = () => {
    fetch(`${API}/auth/users`, { headers }).then(r => r.json()).then(d => Array.isArray(d) && setUsersList(d)).catch(() => {});
  };

  useEffect(() => {
    if (!user) return;
    fetch(`${API}/videos`).then(r => r.json()).then(setVideos).catch(() => {});
    fetch(`${API}/tools/groups`).then(r => r.json()).then(setGroups).catch(() => {});
    fetchUsers();
  }, [user]);

  if (!user || user.role !== "admin") {
    return <div className="min-h-screen bg-[#09090b] flex items-center justify-center text-zinc-400">Akses ditolak</div>;
  }

  // User CRUD
  const registerUser = async () => {
    setUError(""); setUSuccess("");
    const res = await fetch(`${API}/auth/register`, {
      method: "POST", headers, body: JSON.stringify({ email: uEmail, password: uPassword }),
    });
    const data = await res.json();
    if (!res.ok) { setUError(data.error || "Gagal mendaftarkan user"); return; }
    setUSuccess(`User ${uEmail} berhasil didaftarkan`);
    setUEmail(""); setUPassword("");
    fetchUsers();
  };

  const updateUser = async () => {
    if (!uEditingId) return;
    const body: any = {};
    if (uEditEmail) body.email = uEditEmail;
    if (uEditPassword) body.password = uEditPassword;
    body.role = uEditRole;
    await fetch(`${API}/auth/users/${uEditingId}`, { method: "PUT", headers, body: JSON.stringify(body) });
    setUEditingId(null); setUEditEmail(""); setUEditPassword(""); setUEditRole("user");
    fetchUsers();
  };

  const deleteUser = async (id: number) => {
    if (!confirm("Hapus user ini?")) return;
    await fetch(`${API}/auth/users/${id}`, { method: "DELETE", headers });
    fetchUsers();
  };

  // Video CRUD
  const saveVideo = async () => {
    if (vEditing) {
      const res = await fetch(`${API}/videos/${vEditing}`, { method: "PUT", headers, body: JSON.stringify(vForm) });
      if (res.ok) {
        const updated = await res.json();
        setVideos(videos.map(v => v.id === vEditing ? updated : v));
      }
    } else {
      const res = await fetch(`${API}/videos`, { method: "POST", headers, body: JSON.stringify(vForm) });
      if (res.ok) {
        const created = await res.json();
        setVideos([...videos, created]);
      }
    }
    setVForm({}); setVEditing(null);
  };
  const deleteVideo = async (id: number) => {
    if (!confirm("Hapus video ini?")) return;
    await fetch(`${API}/videos/${id}`, { method: "DELETE", headers });
    setVideos(videos.filter(v => v.id !== id));
  };

  // Tool Group CRUD
  const saveGroup = async () => {
    if (gEditing) {
      const res = await fetch(`${API}/tools/groups/${gEditing}`, { method: "PUT", headers, body: JSON.stringify(gForm) });
      if (res.ok) {
        const updated = await res.json();
        setGroups(groups.map(g => g.id === gEditing ? { ...updated, links: g.links } : g));
      }
    } else {
      const res = await fetch(`${API}/tools/groups`, { method: "POST", headers, body: JSON.stringify(gForm) });
      if (res.ok) {
        const created = await res.json();
        setGroups([...groups, { ...created, links: [] }]);
      }
    }
    setGForm({}); setGEditing(null);
  };
  const deleteGroup = async (id: number) => {
    if (!confirm("Hapus grup tool ini beserta semua link-nya?")) return;
    await fetch(`${API}/tools/groups/${id}`, { method: "DELETE", headers });
    setGroups(groups.filter(g => g.id !== id));
  };

  // Tool Link CRUD
  const saveLink = async () => {
    if (lEditing) {
      const res = await fetch(`${API}/tools/links/${lEditing}`, { method: "PUT", headers, body: JSON.stringify(lForm) });
      if (res.ok) {
        const updated = await res.json();
        setGroups(groups.map(g => ({
          ...g, links: g.links.map(l => l.id === lEditing ? updated : l),
        })));
      }
    } else {
      const res = await fetch(`${API}/tools/links`, { method: "POST", headers, body: JSON.stringify(lForm) });
      if (res.ok) {
        const created = await res.json();
        setGroups(groups.map(g => g.id === created.groupId ? { ...g, links: [...g.links, created] } : g));
      }
    }
    setLForm({}); setLEditing(null);
  };
  const deleteLink = async (id: number) => {
    if (!confirm("Hapus link ini?")) return;
    await fetch(`${API}/tools/links/${id}`, { method: "DELETE", headers });
    setGroups(groups.map(g => ({ ...g, links: g.links.filter(l => l.id !== id) })));
  };

  return (
    <div className="min-h-screen bg-[#09090b] text-zinc-100">
      <div className="max-w-6xl mx-auto px-4 py-8">
        <div className="flex items-center justify-between mb-6">
          <h1 className="text-2xl font-bold">Admin Panel</h1>
          <div className="flex gap-3">
            <button onClick={() => navigate("/")} className="text-sm text-zinc-500 hover:text-white">Beranda</button>
            <button onClick={logout} className="text-sm text-zinc-500 hover:text-white">Logout</button>
          </div>
        </div>

        {/* Tabs */}
        <div className="flex gap-2 mb-6">
          <button onClick={() => setTab("videos")} className={`px-4 py-2 rounded-lg text-sm font-medium ${tab === "videos" ? "bg-purple-600 text-white" : "bg-zinc-800 text-zinc-400 hover:text-white"}`}>Videos</button>
          <button onClick={() => setTab("tools")} className={`px-4 py-2 rounded-lg text-sm font-medium ${tab === "tools" ? "bg-purple-600 text-white" : "bg-zinc-800 text-zinc-400 hover:text-white"}`}>Tools</button>
          <button onClick={() => setTab("users")} className={`px-4 py-2 rounded-lg text-sm font-medium ${tab === "users" ? "bg-purple-600 text-white" : "bg-zinc-800 text-zinc-400 hover:text-white"}`}>User Baru</button>
        </div>

        {tab === "videos" && (
          <>
            {/* Add/Edit Video Form */}
            <div className="bg-zinc-900 border border-zinc-800 rounded-xl p-6 mb-6">
              <h2 className="font-semibold mb-4">{vEditing ? "Edit Video" : "Tambah Video Baru"}</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="text-xs text-zinc-400 mb-1 block">Judul *</label>
                  <input placeholder="Judul video" value={vForm.title || ""} onChange={e => setVForm({...vForm, title: e.target.value})} className="w-full px-4 py-2 bg-black border border-zinc-800 rounded-lg text-zinc-100 placeholder-zinc-600" />
                </div>
                <div>
                  <label className="text-xs text-zinc-400 mb-1 block">Sub Judul</label>
                  <input placeholder="Sub judul video" value={vForm.subtitle || ""} onChange={e => setVForm({...vForm, subtitle: e.target.value})} className="w-full px-4 py-2 bg-black border border-zinc-800 rounded-lg text-zinc-100 placeholder-zinc-600" />
                </div>
                <div>
                  <label className="text-xs text-zinc-400 mb-1 block">Tanggal</label>
                  <input placeholder="DD/MM/YYYY" value={vForm.date || ""} onChange={e => setVForm({...vForm, date: e.target.value})} className="w-full px-4 py-2 bg-black border border-zinc-800 rounded-lg text-zinc-100 placeholder-zinc-600" />
                </div>
                <div>
                  <label className="text-xs text-zinc-400 mb-1 block">Thumbnail</label>
                  <input placeholder="URL gambar thumbnail" value={vForm.thumbnail || ""} onChange={e => setVForm({...vForm, thumbnail: e.target.value})} className="w-full px-4 py-2 bg-black border border-zinc-800 rounded-lg text-zinc-100 placeholder-zinc-600" />
                </div>
                <div>
                  <label className="text-xs text-zinc-400 mb-1 block">Durasi</label>
                  <input placeholder="12:34" value={vForm.duration || ""} onChange={e => setVForm({...vForm, duration: e.target.value})} className="w-full px-4 py-2 bg-black border border-zinc-800 rounded-lg text-zinc-100 placeholder-zinc-600" />
                </div>
                <div>
                  <label className="text-xs text-zinc-400 mb-1 block">URL *</label>
                  <input placeholder="https://youtube.com/..." value={vForm.url || ""} onChange={e => setVForm({...vForm, url: e.target.value})} className="w-full px-4 py-2 bg-black border border-zinc-800 rounded-lg text-zinc-100 placeholder-zinc-600" />
                </div>
                <div>
                  <label className="text-xs text-zinc-400 mb-1 block">Kategori</label>
                  <input placeholder="Tutorial Tools" value={vForm.category || ""} onChange={e => setVForm({...vForm, category: e.target.value})} className="w-full px-4 py-2 bg-black border border-zinc-800 rounded-lg text-zinc-100 placeholder-zinc-600" />
                </div>
              </div>
              <div className="flex gap-2 mt-4">
                <button onClick={saveVideo} className="px-4 py-2 bg-purple-600 rounded-lg text-sm font-medium hover:bg-purple-700 flex items-center gap-2"><Save className="h-4 w-4" /> Simpan</button>
                {vEditing && <button onClick={() => { setVForm({}); setVEditing(null); }} className="px-4 py-2 bg-zinc-700 rounded-lg text-sm font-medium hover:bg-zinc-600 flex items-center gap-2"><X className="h-4 w-4" /> Batal</button>}
              </div>
            </div>

            {/* Video List */}
            <div className="bg-zinc-900 border border-zinc-800 rounded-xl p-6">
              <h2 className="font-semibold mb-4">Daftar Video ({videos.length})</h2>
              <div className="space-y-2">
                {videos.map(v => (
                  <div key={v.id} className="flex items-center justify-between py-2 px-3 border border-zinc-800 rounded-lg">
                    <div className="flex items-center gap-3 min-w-0">
                      {v.thumbnail && <img src={v.thumbnail} alt="" className="h-10 w-16 rounded object-cover shrink-0" />}
                      <div className="min-w-0">
                        <p className="text-sm font-medium truncate">{v.title}</p>
                        <p className="text-xs text-zinc-500 truncate">{v.url}</p>
                      </div>
                    </div>
                    <div className="flex gap-2 shrink-0">
                      <button onClick={() => { setVForm(v); setVEditing(v.id); }} className="text-zinc-500 hover:text-blue-400"><Pencil className="h-4 w-4" /></button>
                      <button onClick={() => deleteVideo(v.id)} className="text-zinc-500 hover:text-red-400"><Trash2 className="h-4 w-4" /></button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </>
        )}

        {tab === "users" && (
          <>
            <div className="bg-zinc-900 border border-zinc-800 rounded-xl p-6 mb-6">
              <h2 className="font-semibold mb-4">{uEditingId ? "Edit User" : "Daftarkan User Baru"}</h2>
              {uEditingId ? (
                <div className="space-y-4">
                  <div>
                    <label className="text-xs text-zinc-400 mb-1 block">Email</label>
                    <input placeholder="user@email.com" value={uEditEmail} onChange={e => setUEditEmail(e.target.value)} className="w-full px-4 py-2 bg-black border border-zinc-800 rounded-lg text-zinc-100 placeholder-zinc-600" />
                  </div>
                  <div>
                    <label className="text-xs text-zinc-400 mb-1 block">Password (kosongkan jika tidak diubah)</label>
                    <div className="relative">
                      <input placeholder="Password baru" type={showPassEdit ? "text" : "password"} value={uEditPassword} onChange={e => setUEditPassword(e.target.value)} className="w-full px-4 py-2 pr-10 bg-black border border-zinc-800 rounded-lg text-zinc-100 placeholder-zinc-600" />
                      <button type="button" onClick={() => setShowPassEdit(!showPassEdit)} className="absolute right-3 top-1/2 -translate-y-1/2 text-zinc-500 hover:text-zinc-300">
                        {showPassEdit ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                      </button>
                    </div>
                  </div>
                  <div>
                    <label className="text-xs text-zinc-400 mb-1 block">Role</label>
                    <select value={uEditRole} onChange={e => setUEditRole(e.target.value)} className="w-full px-4 py-2 bg-black border border-zinc-800 rounded-lg text-zinc-100">
                      <option value="user">User</option>
                      <option value="admin">Admin</option>
                    </select>
                  </div>
                  <div className="flex gap-2">
                    <button onClick={updateUser} className="px-4 py-2 bg-purple-600 rounded-lg text-sm font-medium hover:bg-purple-700 flex items-center gap-2"><Save className="h-4 w-4" /> Simpan</button>
                    <button onClick={() => { setUEditingId(null); setUEditEmail(""); setUEditPassword(""); setUEditRole("user"); }} className="px-4 py-2 bg-zinc-700 rounded-lg text-sm font-medium hover:bg-zinc-600 flex items-center gap-2"><X className="h-4 w-4" /> Batal</button>
                  </div>
                </div>
              ) : (
                <>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="text-xs text-zinc-400 mb-1 block">Email</label>
                      <input placeholder="user@email.com" value={uEmail} onChange={e => setUEmail(e.target.value)} className="w-full px-4 py-2 bg-black border border-zinc-800 rounded-lg text-zinc-100 placeholder-zinc-600" />
                    </div>
                    <div>
                      <label className="text-xs text-zinc-400 mb-1 block">Password</label>
                      <div className="relative">
                        <input placeholder="Password user" type={showPassRegister ? "text" : "password"} value={uPassword} onChange={e => setUPassword(e.target.value)} className="w-full px-4 py-2 pr-10 bg-black border border-zinc-800 rounded-lg text-zinc-100 placeholder-zinc-600" />
                        <button type="button" onClick={() => setShowPassRegister(!showPassRegister)} className="absolute right-3 top-1/2 -translate-y-1/2 text-zinc-500 hover:text-zinc-300">
                          {showPassRegister ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                        </button>
                      </div>
                    </div>
                  </div>
                  {uError && <p className="text-red-500 text-sm mt-3">{uError}</p>}
                  {uSuccess && <p className="text-green-500 text-sm mt-3">{uSuccess}</p>}
                  <button onClick={registerUser} className="mt-4 px-4 py-2 bg-purple-600 rounded-lg text-sm font-medium hover:bg-purple-700 flex items-center gap-2"><Save className="h-4 w-4" /> Daftarkan</button>
                </>
              )}
            </div>

            <div className="bg-zinc-900 border border-zinc-800 rounded-xl p-6">
              <h2 className="font-semibold mb-4">Daftar User ({usersList.length})</h2>
              <div className="space-y-2">
                {usersList.map(u => (
                  <div key={u.id} className="flex justify-between items-center py-2 border-b border-zinc-800 last:border-0">
                    <div>
                      <p className="text-sm">{u.email}</p>
                      <p className="text-xs text-zinc-500">{u.role} — {new Date(u.createdAt).toLocaleDateString()}</p>
                    </div>
                    <div className="flex gap-2">
                      <button onClick={() => { setUEditingId(u.id); setUEditEmail(u.email); setUEditPassword(""); setUEditRole(u.role); }} className="text-zinc-500 hover:text-blue-400"><Pencil className="h-4 w-4" /></button>
                      <button onClick={() => deleteUser(u.id)} className="text-zinc-500 hover:text-red-400"><Trash2 className="h-4 w-4" /></button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </>
        )}

        {tab === "tools" && (
          <>
            {/* Add/Edit Tool Group Form */}
            <div className="bg-zinc-900 border border-zinc-800 rounded-xl p-6 mb-6">
              <h2 className="font-semibold mb-4">{gEditing ? "Edit Grup Tool" : "Tambah Grup Tool Baru"}</h2>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <label className="text-xs text-zinc-400 mb-1 block">Nama Grup *</label>
                  <input placeholder="Rahyan AI" value={gForm.name || ""} onChange={e => setGForm({...gForm, name: e.target.value})} className="w-full px-4 py-2 bg-black border border-zinc-800 rounded-lg text-zinc-100 placeholder-zinc-600" />
                </div>
                <div>
                  <label className="text-xs text-zinc-400 mb-1 block">Deskripsi</label>
                  <input placeholder="Deskripsi grup tool" value={gForm.description || ""} onChange={e => setGForm({...gForm, description: e.target.value})} className="w-full px-4 py-2 bg-black border border-zinc-800 rounded-lg text-zinc-100 placeholder-zinc-600" />
                </div>
                <div>
                  <label className="text-xs text-zinc-400 mb-1 block">Warna</label>
                  <input placeholder="bg-purple-600 hover:bg-purple-700" value={gForm.color || ""} onChange={e => setGForm({...gForm, color: e.target.value})} className="w-full px-4 py-2 bg-black border border-zinc-800 rounded-lg text-zinc-100 placeholder-zinc-600" />
                </div>
              </div>
              <div className="flex gap-2 mt-4">
                <button onClick={saveGroup} className="px-4 py-2 bg-purple-600 rounded-lg text-sm font-medium hover:bg-purple-700 flex items-center gap-2"><Save className="h-4 w-4" /> Simpan Grup</button>
                {gEditing && <button onClick={() => { setGForm({}); setGEditing(null); }} className="px-4 py-2 bg-zinc-700 rounded-lg text-sm font-medium hover:bg-zinc-600 flex items-center gap-2"><X className="h-4 w-4" /> Batal</button>}
              </div>
            </div>

            {/* Add Tool Link Form */}
            <div className="bg-zinc-900 border border-zinc-800 rounded-xl p-6 mb-6">
              <h2 className="font-semibold mb-4">{lEditing ? "Edit Link Tool" : "Tambah Link Tool"}</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="text-xs text-zinc-400 mb-1 block">Judul *</label>
                  <input placeholder="Generate Image to video" value={lForm.title || ""} onChange={e => setLForm({...lForm, title: e.target.value})} className="w-full px-4 py-2 bg-black border border-zinc-800 rounded-lg text-zinc-100 placeholder-zinc-600" />
                </div>
                <div>
                  <label className="text-xs text-zinc-400 mb-1 block">URL *</label>
                  <input placeholder="https://example.com/..." value={lForm.url || ""} onChange={e => setLForm({...lForm, url: e.target.value})} className="w-full px-4 py-2 bg-black border border-zinc-800 rounded-lg text-zinc-100 placeholder-zinc-600" />
                </div>
                <div>
                  <label className="text-xs text-zinc-400 mb-1 block">Deskripsi</label>
                  <input placeholder="Deskripsi tool" value={lForm.deskripsi || ""} onChange={e => setLForm({...lForm, deskripsi: e.target.value})} className="w-full px-4 py-2 bg-black border border-zinc-800 rounded-lg text-zinc-100 placeholder-zinc-600" />
                </div>
                <div>
                  <label className="text-xs text-zinc-400 mb-1 block">Thumbnail</label>
                  <input placeholder="URL gambar thumbnail" value={lForm.thumbnail || ""} onChange={e => setLForm({...lForm, thumbnail: e.target.value})} className="w-full px-4 py-2 bg-black border border-zinc-800 rounded-lg text-zinc-100 placeholder-zinc-600" />
                </div>
                <div>
                  <label className="text-xs text-zinc-400 mb-1 block">Grup *</label>
                  <select value={lForm.groupId || ""} onChange={e => setLForm({...lForm, groupId: Number(e.target.value)})} className="w-full px-4 py-2 bg-black border border-zinc-800 rounded-lg text-zinc-100">
                    <option value="" className="text-zinc-600">Pilih Grup</option>
                    {groups.map(g => <option key={g.id} value={g.id}>{g.name}</option>)}
                  </select>
                </div>
              </div>
              <div className="flex gap-2 mt-4">
                <button onClick={saveLink} className="px-4 py-2 bg-purple-600 rounded-lg text-sm font-medium hover:bg-purple-700 flex items-center gap-2"><Save className="h-4 w-4" /> Simpan Link</button>
                {lEditing && <button onClick={() => { setLForm({}); setLEditing(null); }} className="px-4 py-2 bg-zinc-700 rounded-lg text-sm font-medium hover:bg-zinc-600 flex items-center gap-2"><X className="h-4 w-4" /> Batal</button>}
              </div>
            </div>

            {/* Groups & Links List */}
            <div className="space-y-6">
              {groups.map(g => (
                <div key={g.id} className="bg-zinc-900 border border-zinc-800 rounded-xl p-6">
                  <div className="flex items-center justify-between mb-4">
                    <div>
                      <h3 className="font-semibold">{g.name}</h3>
                      {g.description && <p className="text-xs text-zinc-500">{g.description}</p>}
                    </div>
                    <div className="flex gap-2">
                      <button onClick={() => { setGForm(g); setGEditing(g.id); }} className="text-zinc-500 hover:text-blue-400"><Pencil className="h-4 w-4" /></button>
                      <button onClick={() => deleteGroup(g.id)} className="text-zinc-500 hover:text-red-400"><Trash2 className="h-4 w-4" /></button>
                    </div>
                  </div>
                  <div className="space-y-2 ml-4 border-l border-zinc-800 pl-4">
                    {g.links.map(l => (
                      <div key={l.id} className="flex items-center justify-between py-1">
                        <div className="min-w-0 flex-1">
                          <p className="text-sm truncate">{l.title}</p>
                          <p className="text-xs text-zinc-500 truncate">{l.url}</p>
                        </div>
                        <div className="flex gap-2 shrink-0 ml-2">
                          <button onClick={() => { setLForm({ ...l, groupId: l.groupId }); setLEditing(l.id); }} className="text-zinc-500 hover:text-blue-400"><Pencil className="h-3.5 w-3.5" /></button>
                          <button onClick={() => deleteLink(l.id)} className="text-zinc-500 hover:text-red-400"><Trash2 className="h-3.5 w-3.5" /></button>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </>
        )}
      </div>
    </div>
  );
}
