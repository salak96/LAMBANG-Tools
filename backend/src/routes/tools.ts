import { Router } from "express";
import { PrismaClient } from "@prisma/client";
import { authenticate, adminOnly } from "../middleware/auth.js";

const router = Router();
const prisma = new PrismaClient();

// Public: list all tool groups with links
router.get("/groups", async (_req, res) => {
  const groups = await prisma.toolGroup.findMany({
    include: { links: true },
    orderBy: { id: "asc" },
  });
  res.json(groups);
});

// Admin: create tool group
router.post("/groups", authenticate, adminOnly, async (req, res) => {
  try {
    const { name, description, color } = req.body;
    if (!name) {
      res.status(400).json({ error: "Name required" });
      return;
    }
    const group = await prisma.toolGroup.create({ data: { name, description, color } });
    res.status(201).json(group);
  } catch {
    res.status(500).json({ error: "Internal server error" });
  }
});

// Admin: update tool group
router.put("/groups/:id", authenticate, adminOnly, async (req, res) => {
  try {
    const id = parseInt(String(req.params.id));
    const { name, description, color } = req.body;
    const group = await prisma.toolGroup.update({
      where: { id },
      data: { name, description, color },
    });
    res.json(group);
  } catch {
    res.status(500).json({ error: "Internal server error" });
  }
});

// Admin: delete tool group
router.delete("/groups/:id", authenticate, adminOnly, async (req, res) => {
  try {
    const id = parseInt(String(req.params.id));
    await prisma.toolGroup.delete({ where: { id } });
    res.json({ success: true });
  } catch {
    res.status(500).json({ error: "Internal server error" });
  }
});

// Admin: create tool link
router.post("/links", authenticate, adminOnly, async (req, res) => {
  try {
    const { title, deskripsi, url, thumbnail, groupId } = req.body;
    if (!title || !url || !groupId) {
      res.status(400).json({ error: "Title, URL, and groupId required" });
      return;
    }
    const link = await prisma.toolLink.create({
      data: { title, deskripsi, url, thumbnail, groupId },
    });
    res.status(201).json(link);
  } catch {
    res.status(500).json({ error: "Internal server error" });
  }
});

// Admin: update tool link
router.put("/links/:id", authenticate, adminOnly, async (req, res) => {
  try {
    const id = parseInt(String(req.params.id));
    const { title, deskripsi, url, thumbnail, groupId } = req.body;
    const link = await prisma.toolLink.update({
      where: { id },
      data: { title, deskripsi, url, thumbnail, groupId },
    });
    res.json(link);
  } catch {
    res.status(500).json({ error: "Internal server error" });
  }
});

// Admin: delete tool link
router.delete("/links/:id", authenticate, adminOnly, async (req, res) => {
  try {
    const id = parseInt(String(req.params.id));
    await prisma.toolLink.delete({ where: { id } });
    res.json({ success: true });
  } catch {
    res.status(500).json({ error: "Internal server error" });
  }
});

export default router;
