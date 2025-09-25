import { type User, type InsertUser, type Wallpaper, type InsertWallpaper } from "@shared/schema";
import { randomUUID } from "crypto";
import { analyzeImageFromUrl } from "./gemini";

export interface IStorage {
  getUser(id: string): Promise<User | undefined>;
  getUserByUsername(username: string): Promise<User | undefined>;
  createUser(user: InsertUser): Promise<User>;
  
  // Wallpaper methods
  getAllWallpapers(): Promise<Wallpaper[]>;
  getWallpaper(id: string): Promise<Wallpaper | undefined>;
  createWallpaper(wallpaper: InsertWallpaper): Promise<Wallpaper>;
  updateWallpaper(id: string, updates: Partial<InsertWallpaper>): Promise<Wallpaper | undefined>;
  deleteWallpaper(id: string): Promise<boolean>;
}

export class MemStorage implements IStorage {
  private users: Map<string, User>;
  private wallpapers: Map<string, Wallpaper>;
  private initialized: boolean = false;

  constructor() {
    this.users = new Map();
    this.wallpapers = new Map();
    this.initializeWallpapers().catch(console.error);
  }

  private async initializeWallpapers() {
    // Initialize with the original wallpaper URLs from the design
    const wallpaperUrls = [
      'https://iili.io/KJrCrJt.jpg',
      'https://iili.io/KJrCUgI.jpg',
      'https://iili.io/KJrCksR.jpg',
      'https://iili.io/KJrCfHX.jpg',
      'https://iili.io/KJrBiPV.jpg',
      'https://iili.io/KoN7HR1.jpg',
      'https://iili.io/KoN5PR9.jpg',
      'https://iili.io/KoN5rSS.jpg',
      'https://iili.io/KoN5ZVj.jpg',
      'https://iili.io/KoN73xa.jpg'
    ];


    console.log("Analyzing wallpaper images with Gemini API...");
    
    // Analyze each image with Gemini API
    for (let index = 0; index < wallpaperUrls.length; index++) {
      const url = wallpaperUrls[index];
      const id = randomUUID();
      
      try {
        console.log(`Analyzing image ${index + 1}/10: wallpaper_${String(index + 1).padStart(2, '0')}.jpg`);
        const analysis = await analyzeImageFromUrl(url);
        
        const wallpaper: Wallpaper = {
          id,
          name: `wallpaper_${String(index + 1).padStart(2, '0')}.jpg`,
          url,
          format: "jpg",
          width: analysis.width,
          height: analysis.height,
          fileSize: null,
          category: "wallpaper",
          description: analysis.description
        };
        this.wallpapers.set(id, wallpaper);
        console.log(`✓ Analyzed: ${analysis.width}×${analysis.height} - ${analysis.description.substring(0, 50)}...`);
      } catch (error) {
        console.error(`Error analyzing wallpaper ${index + 1}:`, error);
        // Fallback to basic info if analysis fails
        const wallpaper: Wallpaper = {
          id,
          name: `wallpaper_${String(index + 1).padStart(2, '0')}.jpg`,
          url,
          format: "jpg",
          width: 1920,
          height: 1080,
          fileSize: null,
          category: "wallpaper",
          description: "Beautiful wallpaper with artistic elements"
        };
        this.wallpapers.set(id, wallpaper);
      }
    }
    
    console.log("✓ Wallpaper analysis complete!");
    this.initialized = true;
  }

  // User methods
  async getUser(id: string): Promise<User | undefined> {
    return this.users.get(id);
  }

  async getUserByUsername(username: string): Promise<User | undefined> {
    return Array.from(this.users.values()).find(
      (user) => user.username === username,
    );
  }

  async createUser(insertUser: InsertUser): Promise<User> {
    const id = randomUUID();
    const user: User = { ...insertUser, id };
    this.users.set(id, user);
    return user;
  }

  private async waitForInitialization(): Promise<void> {
    while (!this.initialized) {
      await new Promise(resolve => setTimeout(resolve, 100));
    }
  }

  // Wallpaper methods
  async getAllWallpapers(): Promise<Wallpaper[]> {
    await this.waitForInitialization();
    return Array.from(this.wallpapers.values());
  }

  async getWallpaper(id: string): Promise<Wallpaper | undefined> {
    return this.wallpapers.get(id);
  }

  async createWallpaper(insertWallpaper: InsertWallpaper): Promise<Wallpaper> {
    const id = randomUUID();
    const wallpaper: Wallpaper = {
      id,
      name: insertWallpaper.name,
      url: insertWallpaper.url,
      format: insertWallpaper.format || "jpg",
      width: insertWallpaper.width || null,
      height: insertWallpaper.height || null,
      fileSize: insertWallpaper.fileSize || null,
      category: insertWallpaper.category || "gothic",
      description: insertWallpaper.description || null
    };
    this.wallpapers.set(id, wallpaper);
    return wallpaper;
  }

  async updateWallpaper(id: string, updates: Partial<InsertWallpaper>): Promise<Wallpaper | undefined> {
    const existing = this.wallpapers.get(id);
    if (!existing) return undefined;

    const updated: Wallpaper = { ...existing, ...updates };
    this.wallpapers.set(id, updated);
    return updated;
  }

  async deleteWallpaper(id: string): Promise<boolean> {
    return this.wallpapers.delete(id);
  }
}

export const storage = new MemStorage();
