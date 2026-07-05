book# Design

## Theme & Colors
The visual system utilizes HSL-based palettes with distinct Light (Default) and Dark modes to mimic a physical journal on a desktop pegboard.

### Primary Tokens
- **Background Pegboard**: `hsl(0, 0%, 97%)` (Light) / `hsl(240, 6%, 7%)` (Dark)
- **Ink Primary**: `hsl(0, 0%, 12%)` (Light) / `hsl(0, 0%, 92%)` (Dark)
- **Paper Background**: `#faf6ee` (Warm off-white linen texture)

### Category Accents
- **Videos**: `hsl(207, 79%, 28%)` (Light) / `hsl(207, 90%, 68%)` (Dark)
- **Nature**: `hsl(115, 39%, 25%)` (Light) / `hsl(115, 50%, 65%)` (Dark)
- **People**: `hsl(35, 95%, 45%)` (Light) / `hsl(38, 95%, 60%)` (Dark)
- **Photowalk**: `hsl(280, 50%, 35%)` (Light) / `hsl(280, 75%, 70%)` (Dark)

---

## Typography

- **Serif (Headings & Journal Accents)**: `Cormorant Garamond` (weights 300, 400, 600)
- **Sans-Serif (Body & Labels)**: `Outfit` (weights 200, 300, 400, 500, 600)

---

## Layout & Components

### Pegboard Canvas
- Subtly shifts relative to cursor position to create a 3D parallax effect on desktop.

### 3D Notebook Structure
- Central binder ring spine (`.notebook-spine`).
- Zoom/rotation states to pivot the active page (Left or Right) towards the viewer:
  - `.state-zoomed-left`: Centered Left Page (rotated `90deg` for landscape scrapbooking format).
  - `.state-zoomed-right`: Centered Right Page (rotated `270deg` for landscape layout).

### Scrapbook Photo Card (`.scrapbook-photo`)
- Simulates physical print photos taped down with translucent washi-tape strips.
- Random slight rotations (`rotate(2deg)` to `rotate(-2deg)`) to reinforce the crafted, non-rigid feel.

### Cinema Ticket Video Slider (`.movie-ticket`)
- Skeuomorphic ticket styling with ticket stub perforations, admission seat numbers, rating labels, and barcode.
- Slide track centered and animated with a 3D focus scale on active ticket.
