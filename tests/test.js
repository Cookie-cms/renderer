import { fileURLToPath } from 'url';
import { dirname } from 'path';
import { join } from 'path';
import { writeFileSync } from 'fs';
import renderHead from '../render/facerender.js';
import renderCapeFront from '../render/caperender.js';
import renderBody2D from '../render/bodyrender.js';


const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

async function cape() {
    const frontBuffer = await renderCapeFront('../tests/cape.png', 300);
    writeFileSync('./tests/output/cape-rendered.png', frontBuffer);
}

async function hdcape() {
    const frontBuffer = await renderCapeFront('../tests/hdcape.png', 300);
    writeFileSync('./tests/output/hdcape-rendered.png', frontBuffer);
}

async function head() {
    // Use path.join to create correct path relative to test file
    const skinPath = join(__dirname, 'skin.png');
    const output = await renderHead(skinPath, 300);
    writeFileSync('./tests/output/skin-rendered.png', output);
}

async function hdhead() {
    const skinPath = join(__dirname, 'hdskin.png');
    const output = await renderHead(skinPath, 300);
    writeFileSync('./tests/output/hdskin-rendered.png', output);
}


async function body() {
    const skinPath = join(__dirname, 'skin.png');
    const output = await renderBody2D(skinPath, 100);
    writeFileSync('./tests/output/skin-body.png', output);
}

async function main() {
    // await cape();
    // await hdcape();
    // await head();
    // await hdhead();
    await body();
}

main().catch(console.error);