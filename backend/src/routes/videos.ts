import { Router } from "express";
import { PrismaClient } from "@prisma/client";
import { authenticate, adminOnly } from "../middleware/auth.js";

const router = Router();
const prisma = new PrismaClient();

// Public: list all videos
router.get("/", async (_req, res) => {
  const videos = await prisma.video.findMany({ orderBy: { id: "asc" } });
  res.json(videos);
});

// Admin: create video
router.post("/", authenticate, adminOnly, async (req, res) => {
  try {
    const { title, subtitle, date, thumbnail, duration, url, category } = req.body;
    if (!title || !url) {
      res.status(400).json({ error: "Title and URL required" });
      return;
    }
    const video = await prisma.video.create({
      data: { title, subtitle, date, thumbnail, duration, url, category },
    });
    res.status(201).json(video);
  } catch {
    res.status(500).json({ error: "Internal server error" });
  }
});

// Admin: update video
router.put("/:id", authenticate, adminOnly, async (req, res) => {
  try {
    const id = parseInt(String(req.params.id));
    const { title, subtitle, date, thumbnail, duration, url, category } = req.body;
    const video = await prisma.video.update({
      where: { id },
      data: { title, subtitle, date, thumbnail, duration, url, category },
    });
    res.json(video);
  } catch {
    res.status(500).json({ error: "Internal server error" });
  }
});

// Admin: delete video
router.delete("/:id", authenticate, adminOnly, async (req, res) => {
  try {
    const id = parseInt(String(req.params.id));
    await prisma.video.delete({ where: { id } });
    res.json({ success: true });
  } catch {
    res.status(500).json({ error: "Internal server error" });
  }
});

export default router;
