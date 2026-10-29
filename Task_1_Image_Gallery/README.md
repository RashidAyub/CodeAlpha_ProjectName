# Lumina — Professional Responsive Image Gallery Website
### CodeAlpha Frontend Development Internship — Task 1

A modern, responsive, high-definition image gallery web application built with **semantic HTML5, modern CSS3, and pure Vanilla JavaScript (ES6+)**.

---

## 🌟 Key Highlights & Features

### 1. Modern Design & Visual Polish
- **Color Palette & Glassmorphism:** Deep obsidian theme with vibrant indigo & cyan accents, subtle frosted glass panels, and ambient background lighting.
- **Dark & Light Mode:** Seamless theme toggle with local storage persistence and system preference detection.
- **Fluid Typography:** Integrated Google Fonts (`Outfit` for headings and `Plus Jakarta Sans` for body copy).
- **Interactive Animations:** Shimmer loading skeletons, card hover zoom, elevation shadow lifts, and smooth layout changes.

### 2. Functional Gallery Capabilities
- **Curated High-Res Photography:** 24 handpicked ultra-high-definition images across 5 distinct categories:
  - 🌿 **Nature** (Alpine lakes, emerald forests, auroras, dunes, waterfalls)
  - 🏛️ **Architecture** (Curved glass atriums, spiral stairs, suspension bridges, historic arches)
  - ✈️ **Travel** (Cappadocia balloons, Venice canals, Santorini, Kyoto torii gates, Amalfi coast)
  - 🦁 **Animals** (Lion portraits, winter red fox, bald eagle, Bengal tiger)
  - 💻 **Technology** (Microchips, coding terminals, robotics, VR gear, server clusters)
- **Multi-Criteria Category Filters:** Filter by `All`, `Nature`, `Architecture`, `Travel`, `Animals`, and `Technology` with real-time photo count badges.
- **Instant Live Search:** Real-time debounced keyword search across titles, descriptions, categories, and photographer names with quick-clear button.
- **Layout Switcher:** Toggle between **Grid View** and multi-column **Masonry View**.
- **Favorite System:** Interactive heart toggle on cards with `localStorage` persistence.
- **Robust Error Handling:** Automatic fallback SVG generation if an image URL fails to load.

### 3. Lightbox Modal & Navigation
- **Interactive Controls:** Working Next/Previous navigation buttons with loop-around.
- **Keyboard Shortcuts:**
  - `→` (Right Arrow): Next image
  - `←` (Left Arrow): Previous image
  - `Esc`: Close lightbox modal
  - `Z`: Toggle image zoom
  - `/`: Focus search input from anywhere on the page
- **Image Counter:** Displays active index and total filtered images (e.g. `3 / 24`).
- **Touch Swipe Gestures:** Swipe left or right on mobile devices to switch photos.
- **Full Resolution Link:** Direct button to view or save original high-res image.

### 4. Fully Responsive Design
- Optimized for desktops, laptops, tablets, and smartphones.
- Touch-friendly 44px+ buttons.
- Collapsible mobile drawer navigation menu.
- Floating back-to-top button with smooth scroll.

---

## 📁 Project Structure

```
Task_1_Image_Gallery/
├── index.html       # Semantic HTML5 markup, accessible landmarks, and modal dialog
├── style.css        # Pure Vanilla CSS3 with variables, grid, masonry, and animations
├── script.js        # Modular Vanilla JavaScript for state, filters, lightbox, and events
└── README.md        # Detailed project overview and instructions
```

---

## 🚀 How to Run Locally

1. Open the project folder `Task_1_Image_Gallery` in your file explorer or code editor.
2. Double-click `index.html` to open it directly in any modern browser (Chrome, Edge, Firefox, Safari).
3. Alternatively, serve via VS Code Live Server or Python:
   ```bash
   # From inside Task_1_Image_Gallery directory:
   python -m http.server 3000
   ```
   Then open `http://localhost:3000` in your browser.

---

## 👨‍💻 Submission Info
- **Internship:** CodeAlpha Frontend Development Internship
- **Task:** Task 1 — Image Gallery
- **Technologies:** HTML5, CSS3, Vanilla JavaScript (Zero external framework dependencies)
