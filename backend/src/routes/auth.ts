import { Router } from "express";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { PrismaClient } from "@prisma/client";
import { authenticate, adminOnly, type AuthRequest } from "../middleware/auth.js";

const router = Router();
const prisma = new PrismaClient();
const JWT_SECRET = process.env.JWT_SECRET || "fallback-secret";

// Admin: register user
router.post("/register", authenticate, adminOnly, async (req: AuthRequest, res) => {
  try {
    const { email, password } = req.body;
    if (!email || !password) {
      res.status(400).json({ error: "Email and password required" });
      return;
    }

    const existing = await prisma.user.findUnique({ where: { email } });
    if (existing) {
      res.status(409).json({ error: "Email already registered" });
      return;
    }

    const hashed = await bcrypt.hash(password, 10);
    const user = await prisma.user.create({
      data: { email, password: hashed, role: "user" },
    });

    res.status(201).json({ id: user.id, email: user.email, role: user.role });
  } catch (err) {
    res.status(500).json({ error: "Internal server error" });
  }
});

// Login
router.post("/login", async (req, res) => {
  try {
    const { email, password } = req.body;
    if (!email || !password) {
      res.status(400).json({ error: "Email and password required" });
      return;
    }

    const user = await prisma.user.findUnique({ where: { email } });
    if (!user) {
      res.status(401).json({ error: "Invalid credentials" });
      return;
    }

    const match = await bcrypt.compare(password, user.password);
    if (!match) {
      res.status(401).json({ error: "Invalid credentials" });
      return;
    }

    const token = jwt.sign({ id: user.id, email: user.email, role: user.role }, JWT_SECRET, { expiresIn: "7d" });
    res.json({ token, user: { id: user.id, email: user.email, role: user.role } });
  } catch {
    res.status(500).json({ error: "Internal server error" });
  }
});

// Get current user
router.get("/me", authenticate, (req: AuthRequest, res) => {
  res.json({ user: req.user });
});

// Admin: list users
router.get("/users", authenticate, adminOnly, async (_req, res) => {
  const users = await prisma.user.findMany({
    select: { id: true, email: true, role: true, createdAt: true },
  });
  res.json(users);
});

// Admin: update user
router.put("/users/:id", authenticate, adminOnly, async (req, res) => {
  try {
    const id = parseInt(String(req.params.id));
    const { email, password, role } = req.body;
    const data: any = {};
    if (email) data.email = email;
    if (role) data.role = role;
    if (password) data.password = await bcrypt.hash(password, 10);

    const user = await prisma.user.update({
      where: { id },
      data,
      select: { id: true, email: true, role: true, createdAt: true },
    });
    res.json(user);
  } catch {
    res.status(500).json({ error: "Internal server error" });
  }
});

// Admin: delete user
router.delete("/users/:id", authenticate, adminOnly, async (req, res) => {
  try {
    const id = parseInt(String(req.params.id));
    await prisma.user.delete({ where: { id } });
    res.json({ success: true });
  } catch {
    res.status(500).json({ error: "Internal server error" });
  }
});

export default router;
