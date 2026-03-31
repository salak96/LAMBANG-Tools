export interface VideoItem {
  id: number;
  title: string;
  subtitle: string;
  date: string;
  thumbnail: string;
  duration: string;
  category: string;
  url: string;
}

export interface LinkItem {
  title: string;
  deskripsi: string;
  url: string;
  thumbnail: string;
}

export interface ToolGroup {
  name: string;
  description: string;
  color: string;
  links: LinkItem[];
}