```markdown
# @cookie-cms/renderer

A Node.js module for rendering Minecraft character skins and capes using Sharp image processing.

## Installation

```bash
npm install @cookie-cms/renderer
```

## Features

- Render character faces, full body 2D views
- Render cape front views
- Support for HD skins (64x64) and standard skins (64x32)
- Pixel-perfect scaling with nearest-neighbor interpolation
- Transparent background support
- Configurable output sizes

## Usage

```javascript
import renderer from '@cookie-cms/renderer';

// Render character head
const headBuffer = await renderer.renderHead('path/to/skin.png', 300);

// Render full body 2D view
const bodyBuffer = await renderer.renderBody2D('path/to/skin.png', 300);

// Render cape front view
const capeBuffer = await renderer.renderCapeFront('path/to/cape.png', 300);
```

## API Reference

### `renderHead(skinPath, size = 300)`
Renders the character's head/face from a skin file.
- `skinPath`: Path to the skin PNG file
- `size`: Output size in pixels (default: 300)
- Returns: Promise<Buffer> - PNG image buffer

### `renderBody2D(skinPath, size = 300)`
Renders a 2D view of the character's full body.
- `skinPath`: Path to the skin PNG file
- `size`: Output height in pixels (default: 300)
- Returns: Promise<Buffer> - PNG image buffer

### `renderCapeFront(capePath, size = 300)`
Renders the front view of a cape.
- `capePath`: Path to the cape PNG file
- `size`: Output height in pixels (default: 300)
- Returns: Promise<Buffer> - PNG image buffer

## Dependencies

- [sharp](https://sharp.pixelplumbing.com/) ^0.33.5 - High performance Node.js image processing

## License

MIT © Cookie-cms
