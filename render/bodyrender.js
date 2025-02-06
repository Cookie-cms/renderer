import sharp from 'sharp';

const BODY_PARTS = {
    head: { x: 8, y: 8, w: 8, h: 8 },
    body: { x: 20, y: 20, w: 8, h: 12 },
    rightArm: { x: 44, y: 20, w: 4, h: 12 },
    leftArm: { x: 32, y: 52, w: 4, h: 12 },
    rightLeg: { x: 4, y: 20, w: 4, h: 12 },
    leftLeg: { x: 20, y: 52, w: 4, h: 12 }
};

async function renderBody(skinPath, size = 300) {
    try {
        const imageBuffer = await sharp(skinPath).toBuffer();
        
        // Calculate scale based on original 8x8 head size
        const scale = size / 32; // Adjust scale to fit the entire body height into the given size
        
        // Scale all dimensions based on original pixel sizes
        const headSize = 8 * scale;
        const bodyWidth = 8 * scale;
        const bodyHeight = 12 * scale;
        const limbWidth = 4 * scale;
        const limbHeight = 12 * scale;

        const layers = {};
        for (const [part, coords] of Object.entries(BODY_PARTS)) {
            const width = coords.w * scale;
            const height = coords.h * scale;

            layers[part] = await sharp(imageBuffer)
                .extract({
                    left: coords.x,
                    top: coords.y,
                    width: coords.w,
                    height: coords.h
                })
                .resize(Math.round(width), Math.round(height), {
                    kernel: 'nearest'
                })
                .toBuffer();
        }

        const totalHeight = Math.round(32 * scale);  // Total height in original pixels
        const totalWidth = Math.round(16 * scale);   // Total width in original pixels

        const baseImage = await sharp({
            create: {
                width: totalWidth,
                height: totalHeight,
                channels: 4,
                background: { r: 0, g: 0, b: 0, alpha: 0 }
            }
        })
        .composite([
            { input: layers.head, top: 0, left: Math.round(4 * scale) },
            { input: layers.body, top: Math.round(8 * scale), left: Math.round(4 * scale) },
            { input: layers.rightArm, top: Math.round(8 * scale), left: 0 },
            { input: layers.leftArm, top: Math.round(8 * scale), left: Math.round(12 * scale) },
            { input: layers.rightLeg, top: Math.round(20 * scale), left: Math.round(4 * scale) },
            { input: layers.leftLeg, top: Math.round(20 * scale), left: Math.round(8 * scale) }
        ])
        .png()
        .toBuffer();

        return baseImage;
    } catch (error) {
        console.error('Body render error:', error);
        throw error;
    }
}

export default renderBody;