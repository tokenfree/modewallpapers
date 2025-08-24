import { GoogleGenAI } from "@google/genai";

const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY || "" });

export async function analyzeImageFromUrl(imageUrl: string): Promise<{
  description: string;
  width: number;
  height: number;
}> {
  try {
    // Fetch the image from URL
    const response = await fetch(imageUrl);
    if (!response.ok) {
      throw new Error(`Failed to fetch image: ${response.statusText}`);
    }
    
    const imageBuffer = await response.arrayBuffer();
    const imageBytes = Buffer.from(imageBuffer);

    // First, get accurate dimensions from JPEG header parsing
    const jpegDimensions = await getImageDimensionsFromJPEG(imageUrl);
    console.log(`JPEG header dimensions: ${jpegDimensions.width}×${jpegDimensions.height}`);

    // Then analyze the image content with Gemini for description
    const analysisResponse = await ai.models.generateContent({
      model: "gemini-2.5-flash",
      contents: [
        {
          inlineData: {
            data: imageBytes.toString("base64"),
            mimeType: "image/jpeg",
          },
        },
        `Describe this wallpaper in 15 words or less. Focus on the main subject and style. Be concise and user-friendly.`,
      ],
    });

    const description = analysisResponse.text || "Beautiful wallpaper with artistic elements";
    
    return {
      description: description.trim(),
      width: jpegDimensions.width,
      height: jpegDimensions.height,
    };
  } catch (error) {
    console.error("Error analyzing image:", error);
    // Return fallback values
    return {
      description: "Gothic wallpaper with dark atmospheric elements",
      width: 1920,
      height: 1080,
    };
  }
}

export async function getImageDimensionsFromJPEG(imageUrl: string): Promise<{ width: number; height: number }> {
  try {
    const response = await fetch(imageUrl);
    if (!response.ok) {
      throw new Error(`Failed to fetch image: ${response.statusText}`);
    }

    const imageBuffer = await response.arrayBuffer();
    const buffer = Buffer.from(imageBuffer);
    
    // Parse JPEG header to get actual dimensions
    let i = 0;
    while (i < buffer.length - 8) {
      // Look for JPEG markers
      if (buffer[i] === 0xFF) {
        const marker = buffer[i + 1];
        
        // SOF markers (Start of Frame) contain dimension info
        if (marker >= 0xC0 && marker <= 0xCF && marker !== 0xC4 && marker !== 0xC8 && marker !== 0xCC) {
          const height = buffer.readUInt16BE(i + 5);
          const width = buffer.readUInt16BE(i + 7);
          console.log(`JPEG dimensions from header: ${width}×${height}`);
          return { width, height };
        }
        
        // Skip to next marker
        if (marker === 0xD8 || marker === 0xD9) {
          i += 2;
        } else {
          const length = buffer.readUInt16BE(i + 2);
          i += 2 + length;
        }
      } else {
        i++;
      }
    }
    
    // Fallback
    console.log("Could not parse JPEG header, using fallback dimensions");
    return { width: 1920, height: 1080 };
  } catch (error) {
    console.error("Error parsing JPEG dimensions:", error);
    return { width: 1920, height: 1080 };
  }
}