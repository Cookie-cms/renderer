import sharp from 'sharp';

const BODY_PARTS = {
    head: { x: 8, y: 8, w: 8, h: 8 },
    body: { x: 20, y: 20, w: 8, h: 12 },
    rightArm: { x: 44, y: 20, w: 4, h: 12 },
    leftArm: { x: 32, y: 52, w: 4, h: 12 },
    rightLeg: { x: 4, y: 20, w: 4, h: 12 },
    leftLeg: { x: 20, y: 52, w: 4, h: 12 }
};

async function renderBody(skinPath, size) {
    try {
        const imageBuffer = await sharp(skinPath).toBuffer();
        
        // Calculate scale based on original 8x8 head size
        const scale = Math.floor(size / 8);
        
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
                .resize(width, height, {
                    kernel: 'nearest'
                })
                .toBuffer();
        }

        const totalHeight = Math.floor(scale * 32);  // Total height in original pixels
        const totalWidth = Math.floor(scale * 16);   // Total width in original pixels

        const baseImage = await sharp({
            create: {
                width: totalWidth,
                height: totalHeight,
                channels: 4,
                background: { r: 0, g: 0, b: 0, alpha: 0 }
            }
        })
        .composite([
            { input: layers.head, top: 0, left: scale * 4 },
            { input: layers.body, top: scale * 8, left: scale * 4 },
            { input: layers.rightArm, top: scale * 8, left: 0 },
            { input: layers.leftArm, top: scale * 8, left: scale * 12 },
            { input: layers.rightLeg, top: scale * 20, left: scale * 4 },
            { input: layers.leftLeg, top: scale * 20, left: scale * 8 }
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