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

    // Initialize wallpapers immediately with basic info for fast startup
    wallpaperUrls.forEach((url, index) => {
      const id = randomUUID();
      const wallpaper: Wallpaper = {
        id,
        name: `wallpaper_${String(index + 1).padStart(2, '0')}.jpg`,
        url,
        format: "jpg",
        width: 1920,
        height: 1080,
        fileSize: null,
        category: "wallpaper",
        description: "Beautiful high-quality wallpaper"
      };
      this.wallpapers.set(id, wallpaper);
    });
    
    this.initialized = true;
    console.log("✓ Wallpapers initialized with basic info for fast startup!");
    
    // Enhance wallpapers with AI analysis in background (non-blocking)
    this.enhanceWallpapersInBackground(wallpaperUrls).catch(error => {
      console.warn("Background wallpaper analysis failed:", error);
    });
  }
  
  private async enhanceWallpapersInBackground(wallpaperUrls: string[]) {
    console.log("Starting background wallpaper enhancement with Gemini API...");
    
    const wallpaperArray = Array.from(this.wallpapers.values());
    
    for (let index = 0; index < Math.min(wallpaperUrls.length, wallpaperArray.length); index++) {
      const url = wallpaperUrls[index];
      const wallpaper = wallpaperArray[index];
      
      try {
        console.log(`Enhancing wallpaper ${index + 1}/${wallpaperUrls.length} in background`);
        const analysis = await analyzeImageFromUrl(url);
        
        // Update the existing wallpaper with enhanced info
        const enhancedWallpaper: Wallpaper = {
          ...wallpaper,
          width: analysis.width,
          height: analysis.height,
          description: analysis.description
        };
        
        this.wallpapers.set(wallpaper.id, enhancedWallpaper);
        console.log(`✓ Enhanced: ${analysis.width}×${analysis.height} - ${analysis.description.substring(0, 50)}...`);
        
        // Add small delay to prevent API rate limiting
        await new Promise(resolve => setTimeout(resolve, 200));
      } catch (error) {
        console.warn(`Could not enhance wallpaper ${index + 1}:`, error);
        // Keep the basic info if enhancement fails
      }
    }
    
    console.log("✓ Background wallpaper enhancement complete!");
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
