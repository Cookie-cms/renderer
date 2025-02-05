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

    // Calculate HD-aware extraction dimensions
    const extractWidth = CAPE_DIMENSIONS.frontWidth * scaleFactor;
    const extractHeight = CAPE_DIMENSIONS.frontHeight * scaleFactor;
    const extractX = CAPE_DIMENSIONS.frontStartX * scaleFactor;
    const extractY = CAPE_DIMENSIONS.frontStartY * scaleFactor;

    // Extract front section with HD support
    const frontSection = await image
      .extract({
        left: Math.round(extractX),
        top: Math.round(extractY),
        width: Math.round(extractWidth),
        height: Math.round(extractHeight)
      })
      .toBuffer();

    // Scale to target size maintaining aspect ratio
    const finalWidth = targetSize;
    const finalHeight = Math.round(targetSize * 1.6);
    
    const output = await sharp(frontSection)
      .resize(finalWidth, finalHeight, {
        kernel: 'nearest',
        fit: 'fill'
      })
      .png()
      .toBuffer();

    return output;
  } catch (error) {
    console.error('Cape front render error:', error);
    throw error;
  }
}

export default renderCapeFront;