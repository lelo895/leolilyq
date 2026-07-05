# Design

## Theme & Colors
Visual system use HSL palettes with Light/Dark modes to mimic physical journal on desktop pegboard.

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

- **Serif (Headings & Journal Accents)**: `EB Garamond`
- **Sans-Serif (Body & Labels)**: `Helvetica Neue`, `Helvetica`, `Arial`

---

## Layout & Components

### Pegboard Canvas
- Subtly shift relative to cursor to create 3D parallax effect on desktop.

### 3D Notebook Structure
- Central binder ring spine (`.notebook-spine`).
- Zoom/rotation states to pivot active page (Left or Right) towards viewer:
  - `.state-zoomed-left`: Centered Left Page (rotated `90deg` for landscape scrapbooking format).
  - `.state-zoomed-right`: Centered Right Page (rotated `270deg` for landscape layout).

### Scrapbook Photo Card (`.scrapbook-photo`)
- Simulate physical print photos taped with translucent washi-tape.
- Random slight rotations (`rotate(2deg)` to `rotate(-2deg)`) reinforce crafted, non-rigid feel.

### Cinema Ticket Video Slider (`.movie-ticket`)
- Skeuomorphic ticket styling (perforations, seat numbers, rating labels, barcode).
- Slide track centered + animated with 3D focus scale on active ticket.
