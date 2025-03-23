import fs from 'fs';
import Render3d from '../render/3drender.js';

// Load skin file buffer
const skinBuffer = fs.readFileSync('./tests/skin.png');
// const capeBuffer = fs.readFileSync('./tests/cape.png');

// Create renderer instance
const renderer = new Render3d(
    skinBuffer,     // Skin file buffer
    false,         // isAlex model (slim arms)
    140,           // Output width in pixels
    // capeBuffer     // Optional cape buffer
);

// Generate 3D render
const renderBuffer = renderer.getRender();

// Save to file
fs.writeFileSync('output.png', renderBuffer);