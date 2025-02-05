import sharp from 'sharp';
import path from 'path';
import { fileURLToPath } from 'url';

const SKIN_PARTS = {
    face: { x: 8, y: 8, w: 8, h: 8 },
    hat: { x: 40, y: 8, w: 8, h: 8 }
};

async function renderHead(skinPath, size) {
    try {
        const imageBuffer = await sharp(skinPath).toBuffer();
        const metadata = await sharp(imageBuffer).metadata();

        // Calculate HD scale factor
        const hdScale = metadata.width / 64;
        console.log('HD Scale factor:', hdScale);

        // Extract and scale layers with HD support
        const layers = {};
        for (const [part, coords] of Object.entries(SKIN_PARTS)) {
            layers[part] = await sharp(imageBuffer)
                .extract({
                    left: coords.x * hdScale,
                    top: coords.y * hdScale,
                    width: coords.w * hdScale,
                    height: coords.h * hdScale
                })
                .resize(size, size, {
                    kernel: 'nearest',
                    fit: 'fill'
                })
                .toBuffer();
        }

        // Create full-size base with transparency
        const baseImage = await sharp({
            create: {
                width: size,
                height: size,
                channels: 4,
                background: { r: 0, g: 0, b: 0, alpha: 0 }
            }
        })
        .composite([
            { input: layers.face },
            { input: layers.hat }
        ])
        .png()
        .toBuffer();

        return baseImage;
    } catch (error) {
        console.error('Head render error:', error);
        throw error;
    }
}



export default renderHead;