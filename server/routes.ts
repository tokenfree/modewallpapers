import type { Express } from "express";
import { createServer, type Server } from "http";
import { z } from "zod";
import { storage } from "./storage";
import { insertWallpaperSchema } from "@shared/schema";

export async function registerRoutes(app: Express): Promise<Server> {
  // Health check endpoint for Render.com
  app.get("/api/health", (req, res) => {
    res.json({ status: "ok", timestamp: new Date().toISOString() });
  });

  // Get all wallpapers
  app.get("/api/wallpapers", async (req, res) => {
    try {
      const wallpapers = await storage.getAllWallpapers();
      res.json(wallpapers);
    } catch (error) {
      console.error("Error fetching wallpapers:", error);
      res.status(500).json({ message: "Failed to fetch wallpapers" });
    }
  });

  // Get wallpaper by ID
  app.get("/api/wallpapers/:id", async (req, res) => {
    try {
      const wallpaper = await storage.getWallpaper(req.params.id);
      if (!wallpaper) {
        return res.status(404).json({ message: "Wallpaper not found" });
      }
      res.json(wallpaper);
    } catch (error) {
      console.error("Error fetching wallpaper:", error);
      res.status(500).json({ message: "Failed to fetch wallpaper" });
    }
  });

  // Create new wallpaper
  app.post("/api/wallpapers", async (req, res) => {
    try {
      const validatedData = insertWallpaperSchema.parse(req.body);
      const wallpaper = await storage.createWallpaper(validatedData);
      res.status(201).json(wallpaper);
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ message: error.message });
      }
      console.error("Error creating wallpaper:", error);
      res.status(500).json({ message: "Failed to create wallpaper" });
    }
  });

  // Update wallpaper
  app.patch("/api/wallpapers/:id", async (req, res) => {
    try {
      const updateSchema = insertWallpaperSchema.partial();
      const validatedData = updateSchema.parse(req.body);
      const wallpaper = await storage.updateWallpaper(req.params.id, validatedData);
      if (!wallpaper) {
        return res.status(404).json({ message: "Wallpaper not found" });
      }
      res.json(wallpaper);
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ message: error.message });
      }
      console.error("Error updating wallpaper:", error);
      res.status(500).json({ message: "Failed to update wallpaper" });
    }
  });

  // Delete wallpaper
  app.delete("/api/wallpapers/:id", async (req, res) => {
    try {
      const success = await storage.deleteWallpaper(req.params.id);
      if (!success) {
        return res.status(404).json({ message: "Wallpaper not found" });
      }
      res.status(204).send();
    } catch (error) {
      console.error("Error deleting wallpaper:", error);
      res.status(500).json({ message: "Failed to delete wallpaper" });
    }
  });

  const httpServer = createServer(app);
  return httpServer;
}
