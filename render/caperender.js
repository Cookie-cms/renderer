import { writeFileSync } from 'fs';
import sharp from 'sharp';
import path from 'path';
import { fileURLToPath } from 'url';

const CAPE_DIMENSIONS = {
  standardWidth: 64,
  standardHeight: 32,
  frontWidth: 10,
  frontHeight: 16,
  frontStartX: 1,
  frontStartY: 1
};

export async function renderCapeFront(inputPath, targetSize = 300) {
  try {
    const __dirname = path.dirname(fileURLToPath(import.meta.url));
    const resolvedPath = path.resolve(__dirname, inputPath);

    // Load image
    const image = sharp(resolvedPath);
    const metadata = await image.metadata();
    
    // Calculate HD scale factor from source dimensions
    const scaleX = metadata.width / CAPE_DIMENSIONS.standardWidth;
    const scaleY = metadata.height / CAPE_DIMENSIONS.standardHeight;
    
    if (scaleX !== scaleY) {
      throw new Error('Cape aspect ratio must be 2:1');
    }
    
    const scaleFactor = scaleX;
    console.log('HD Scale factor:', scaleFactor); // Will be 16 for 1024x512

    // Calculate HD-aware extraction dimensions
    const extractWidth = CAPE_DIMENSIONS.frontWidth * scaleFactor;
    const extractHeight = CAPE_DIMENSIONS.frontHeight * scaleFactor;
    const extractX = CAPE_DIMENSIONS.frontStartX * scaleFactor;
    const extractY = CAPE_DIMENSIONS.frontStartY * scaleFactor;

    // Extract and scale the front section
    return await image
      .extract({
        left: Math.round(extractX),
        top: Math.round(extractY),
        width: Math.round(extractWidth),
        height: Math.round(extractHeight)
      })
      .resize(targetSize, Math.round(targetSize * (CAPE_DIMENSIONS.frontHeight / CAPE_DIMENSIONS.frontWidth)), {
        kernel: 'nearest'
      })
      .png()
      .toBuffer();

  } catch (error) {
    console.error('Cape render error:', error);
    throw error;
  }
}

export default renderCapeFront;