# Task 2: Professional Modern Calculator — QuantumCalc

A modern, responsive, and fully functional web calculator built with **HTML5**, **CSS3**, and **Vanilla JavaScript** for the **CodeAlpha Frontend Development Internship**.

---

## 🧮 Features & Functionalities

### 1. Design & User Interface
- **Modern Obsidian Glassmorphism:** Deep dark theme with ambient glowing orbs, frosted glass backdrop blur (`backdrop-filter: blur(24px)`), gradient borders, and sleek rounded corners.
- **Dynamic 4-Theme Engine:**
  - 🌌 **Obsidian Neon** (Default dark luxury with electric indigo & cyan)
  - ⚡ **Cyber Glow** (Midnight with neon pink & radiant yellow)
  - 🌿 **Aurora Emerald** (Deep forest dark with mint glow)
  - 💎 **Pure Platinum** (Clean minimalist high-contrast light theme)
- **High-Tech Display Screen:**
  - Previous expression stream with smooth horizontal scrolling.
  - Large digital readout using **JetBrains Mono** font with auto-scaling font size to prevent overflow.
  - Real-time calculation preview line with live badge.
  - Active memory indicator (`M` chip).
- **Tactile Keypad:** Distinct styling for digits, operators, clear buttons, and equals, with hover elevation, active press depression, and visual feedback on keyboard press.
- **Synthesized Audio Feedback:** High-precision click and chime sound effects generated in real time using the **Web Audio API** (zero external sound files needed), with an audio mute/unmute toggle.

### 2. Core Calculator Functionality
- **Complete Arithmetic Engine:** Addition (`+`), subtraction (`−`), multiplication (`×`), and division (`÷`).
- **Safe Tokenizer & Evaluator:** Safe mathematical expression parser supporting operator precedence, parentheses, and nested operations without dangerous raw `eval()`.
- **Intelligent Percentage Handling:**
  - Additive / Subtractive: `100 + 10% = 110`, `200 - 25% = 150`
  - Multiplicative / Divisional: `50 × 20% = 10`
  - Standalone: `50% = 0.5`
- **Calculation Continuity:** Seamlessly chain further calculations using the previous result (pressing an operator after `=` continues from the answer; typing a digit starts a fresh expression).
- **Floating-Point Precision Fix:** Eliminates common JavaScript arithmetic bugs (e.g., `0.1 + 0.2 = 0.3` instead of `0.30000000000000004`).
- **Graceful Error Handling:** Catches division by zero and malformed expressions with a friendly screen warning and a subtle shake animation without crashing.
- **Input Sanitization:** Blocks consecutive invalid operators, repeated decimals within the same number, and unbalanced inputs.

### 3. Real-Time Calculation Preview
- Live calculation preview updates immediately as you type each digit and operator.
- Keeps current expression visible in the history line even after calculation.
- One-click copy result button with toast notification.

### 4. Expandable Scientific Panel
- Toggleable scientific functions drawer:
  - Square Root (`√x`)
  - Square (`x²`)
  - Power (`xʸ`)
  - Reciprocal (`¹/ₓ`)
  - Pi Constant (`π`)
  - Euler's Constant (`e`)
  - Absolute Value (`|x|`)
  - Factorial (`n!`)

### 5. Calculation History Tape
- Slide-out side drawer with all past calculations and timestamps.
- **Use Expression** & **Use Result** buttons to quickly recall numbers into the active workspace.
- One-click copy button for individual history results.
- Persistent storage using browser `localStorage`.

### 6. Full Keyboard Accessibility
| Key | Action |
|---|---|
| <kbd>0</kbd>–<kbd>9</kbd> | Number input |
| <kbd>+</kbd> <kbd>−</kbd> <kbd>*</kbd> <kbd>/</kbd> | Arithmetic operators |
| <kbd>.</kbd> or <kbd>,</kbd> | Decimal point |
| <kbd>Enter</kbd> or <kbd>=</kbd> | Calculate result |
| <kbd>Backspace</kbd> | Delete last character (DEL) |
| <kbd>Escape</kbd> or <kbd>Delete</kbd> | All Clear (AC) |
| <kbd>%</kbd> | Percentage |
| <kbd>(</kbd> <kbd>)</kbd> | Parentheses grouping |
| <kbd>^</kbd> | Exponentiation (Power) |
| <kbd>Ctrl</kbd> + <kbd>C</kbd> | Copy result to clipboard |
| <kbd>H</kbd> | Toggle history drawer |
| <kbd>Alt</kbd> + <kbd>S</kbd> | Toggle scientific panel |
| <kbd>?</kbd> | View keyboard shortcuts modal |

---

## 📁 Project Structure

```
Task_2_Calculator/
├── index.html       # Semantic HTML5 layout, screen, grid keypad, dialogs
├── style.css        # CSS3 variables, 4 color themes, glassmorphism, responsive grid
├── script.js       # Mathematical engine, tokenizer, live preview, audio, history
└── README.md        # Documentation and running instructions
```

---

## 🚀 How to Run the Application

### Option 1: Direct Browser Launch
Simply double-click `index.html` or open it with any web browser (Google Chrome, Microsoft Edge, Mozilla Firefox, Brave, Safari).

### Option 2: Using VS Code Live Server
1. Open the repository in VS Code.
2. Right-click `Task_2_Calculator/index.html` and select **"Open with Live Server"**.

### Option 3: Local HTTP Server (Python or Node.js)
```bash
# Using Python
python -m http.server 3000 --directory Task_2_Calculator

# OR using Node.js npx serve
npx serve Task_2_Calculator
```
Then visit `http://localhost:3000` in your web browser.

---

## 👨‍💻 Developer Information
- **Intern:** Rashid Ayub
- **Internship:** CodeAlpha Frontend Development
- **Task:** Task 2 — Build a Calculator
