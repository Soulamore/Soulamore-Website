import imagemin from 'imagemin';
import imageminWebp from 'imagemin-webp';
import { promises as fs } from 'fs';
import path from 'path';

const INPUT_DIR = 'assets/images';
const OUTPUT_DIR = 'assets/images'; // Saving alongside originals for now

async function optimizeImages() {
  console.log('🚀 Starting Image Optimization (WebP Conversion)...');

  try {
    const files = await imagemin([`${INPUT_DIR}/**/*.{jpg,png}`], {
      destination: OUTPUT_DIR,
      plugins: [
        imageminWebp({ quality: 75 })
      ]
    });

    console.log(`✅ Successfully converted ${files.length} images to WebP.`);
    
    // Log the savings if possible (optional)
    for (const file of files) {
        console.log(` - Created: ${file.destinationPath}`);
    }

  } catch (error) {
    console.error('❌ Error during optimization:', error);
  }
}

optimizeImages();
