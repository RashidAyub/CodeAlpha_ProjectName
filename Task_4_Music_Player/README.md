# Task 4: Professional Music Player — AuraBeats

A modern, responsive, and feature-rich Web Music Player built with **HTML5**, **CSS3**, and **Vanilla JavaScript** for the **CodeAlpha Frontend Development Internship**.

---

## 🎧 Features & Functionalities

### 1. Design & User Interface
- **Modern Streaming Aesthetic:** Obsidian dark theme with vibrant violet-pink-cyan gradients, fluid glassmorphism (`backdrop-filter: blur(24px)`), and modern typography (**Outfit** & **Plus Jakarta Sans**).
- **Interactive Vinyl Disc & Rotating Artwork:** Seamless rotating animation while playing, with the vinyl record smoothly sliding out from behind the album artwork during playback.
- **Harmonic Equalizer Visualizer:** Real-time animated canvas soundwaves reactive to playback state.
- **Responsive Header & Footer:** Logo branding, quick navigation, keyboard shortcuts launcher, and credits.

### 2. Audio Player Functionality (HTML5 Audio API)
- **Full Playback Controls:** Play, Pause, Next, Previous, Shuffle, and 3-stage Repeat (Off, Repeat All, Repeat One).
- **Interactive Progress Bar:** Smooth seek-on-click and seek-on-drag, with dynamic hover time tooltip and buffered audio indicator.
- **Dynamic Time Counter:** Current elapsed time and total duration formatted in `MM:SS`.
- **Comprehensive Volume System:** Range slider with live percentage indicator, mute/unmute toggle, and dynamic volume icon states.
- **Autoplay Engine:** Automatically advances to the next track when a song finishes.
- **Graceful Error Handling:** In-app warning banners and toast notifications for connection or media load issues without freezing the application.

### 3. Playlist Management & Search
- **5 High-Quality Royalty-Free Demo Tracks:** Sourced from NoCopyrightSounds (NCS) with matching high-resolution album artwork.
- **Real-Time Live Search:** Filter songs dynamically by track title, artist, or album with instant clear button.
- **Favorites / Liked Songs Tab:** Heart songs to save them to your personal favorites collection, saved in browser `localStorage`.
- **Live Track Indicator:** Playing song is highlighted with glowing violet gradient and animated 4-bar equalizer waves.

### 4. Interactive Keyboard Shortcuts
| Key | Action |
|---|---|
| <kbd>Space</kbd> | Play / Pause |
| <kbd>→</kbd> | Seek forward 5s |
| <kbd>←</kbd> | Seek backward 5s |
| <kbd>N</kbd> / <kbd>Shift</kbd> + <kbd>→</kbd> | Next Track |
| <kbd>P</kbd> / <kbd>Shift</kbd> + <kbd>←</kbd> | Previous Track |
| <kbd>↑</kbd> / <kbd>↓</kbd> | Volume Up / Down (5%) |
| <kbd>M</kbd> | Mute / Unmute |
| <kbd>S</kbd> | Toggle Shuffle |
| <kbd>R</kbd> | Cycle Repeat Mode (Off / All / One) |
| <kbd>L</kbd> | Like / Favorite Track |
| <kbd>?</kbd> | Open Keyboard Shortcuts Modal |

---

## 📁 Project Structure

```
Task_4_Music_Player/
├── assets/
│   ├── audio/
│   │   ├── royalty.mp3
│   │   ├── feel_good_funk.mp3
│   │   ├── never_knew_me.mp3
│   │   ├── mortals_funk.mp3
│   │   └── harinezumi.mp3
│   └── images/
│       ├── royalty.png
│       ├── feel_good_funk.png
│       ├── never_knew_me.png
│       ├── mortals_funk.png
│       └── harinezumi.png
├── index.html       # Semantic HTML5 markup and layout
├── style.css        # CSS3 custom properties, glassmorphism, responsive styles
├── script.js       # Vanilla JS audio engine, playlist, shortcuts, canvas visualizer
└── README.md        # Task documentation and run instructions
```

---

## 🚀 How to Run the Application

### Option 1: Direct Browser Launch
Simply double-click `index.html` or open it with any modern web browser (Google Chrome, Microsoft Edge, Mozilla Firefox, Brave, Safari).

### Option 2: Using VS Code Live Server
1. Open the project folder in VS Code.
2. Right-click `index.html` and select **"Open with Live Server"**.

### Option 3: Local HTTP Server (Node.js / Python)
```bash
# Using Node.js npx serve
npx serve Task_4_Music_Player

# OR using Python
python -m http.server 3000 --directory Task_4_Music_Player
```
Then visit `http://localhost:3000` in your web browser.

---

## 👨‍💻 Developer Information
- **Intern:** Rashid Ayub
- **Internship:** CodeAlpha Frontend Development
- **Task:** Task 4 — Professional Music Player
