/**
 * QuantumCalc — Modern Professional Web Calculator
 * Developed by Rashid Ayub | CodeAlpha Internship
 *
 * Core Features:
 * - Robust Tokenizer & Safe Math Evaluator (Parentheses, Unary Minus, Intelligent Percentages)
 * - Real-Time Live Calculation Preview
 * - Full Keyboard Support with Visual Feedback
 * - Synthesized Web Audio Click Effects (Zero External Files)
 * - Calculation History Tape with Persistence (localStorage)
 * - 4 Color Themes (Obsidian Neon, Cyber Glow, Aurora Emerald, Pure Platinum)
 * - Memory Registers (MC, MR, M+, M-, MS) & Scientific Panel
 * - Responsive Display with Dynamic Auto-Scaling Typography
 */

'use strict';

// ============================================================================
// 1. Calculator State Management
// ============================================================================
class CalculatorState {
  constructor() {
    this.expression = '';          // Raw math expression string (e.g. "12.5 + 4 * 2")
    this.lastResult = null;        // Last evaluated result
    this.justCalculated = false;   // Flag if '=' was just executed
    this.memory = 0;              // Memory register value
    this.history = [];             // Past calculations array
    this.soundEnabled = true;      // Audio feedback state
    this.currentTheme = 'obsidian';// Active theme
    this.isScientific = false;     // Scientific drawer state
  }
}

const state = new CalculatorState();

// ============================================================================
// 2. DOM Elements Cache
// ============================================================================
const DOM = {
  // Displays
  mainDisplay: document.getElementById('mainDisplay'),
  expressionDisplay: document.getElementById('expressionDisplay'),
  previewDisplay: document.getElementById('previewDisplay'),
  previewContainer: document.getElementById('livePreviewContainer'),
  operatorBadge: document.getElementById('operatorBadge'),
  screen: document.getElementById('calculatorScreen'),

  // Keypad & Controls
  keypad: document.getElementById('keypadGrid'),
  scientificPanel: document.getElementById('scientificPanel'),
  scientificToggleBtn: document.getElementById('scientificToggleBtn'),
  soundToggleBtn: document.getElementById('soundToggleBtn'),
  copyResultBtn: document.getElementById('copyResultBtn'),

  // Memory
  memoryBar: document.getElementById('memoryBar'),
  memoryIndicator: document.getElementById('memoryIndicator'),

  // History Drawer
  historyDrawer: document.getElementById('historyDrawer'),
  historyToggleBtn: document.getElementById('historyToggleBtn'),
  closeHistoryBtn: document.getElementById('closeHistoryBtn'),
  clearHistoryBtn: document.getElementById('clearHistoryBtn'),
  historyList: document.getElementById('historyList'),
  historyCountBadge: document.getElementById('historyCountBadge'),

  // Shortcuts Modal
  shortcutsModal: document.getElementById('shortcutsModal'),
  shortcutsToggleBtn: document.getElementById('shortcutsToggleBtn'),
  closeShortcutsBtn: document.getElementById('closeShortcutsBtn'),
  shortcutsGotItBtn: document.getElementById('shortcutsGotItBtn'),

  // Theme Picker
  themePickerBtn: document.getElementById('themePickerBtn'),
  themeMenu: document.getElementById('themeMenu'),
  themeOptions: document.querySelectorAll('.theme-option'),

  // Toasts
  toastContainer: document.getElementById('toastContainer'),
};

// ============================================================================
// 3. Audio Synthesizer (Web Audio API)
// ============================================================================
class SoundEffects {
  constructor() {
    this.ctx = null;
  }

  init() {
    if (!this.ctx && (window.AudioContext || window.webkitAudioContext)) {
      const AudioCtx = window.AudioContext || window.webkitAudioContext;
      this.ctx = new AudioCtx();
    }
    if (this.ctx && this.ctx.state === 'suspended') {
      this.ctx.resume();
    }
  }

  playClick(type = 'num') {
    if (!state.soundEnabled) return;
    try {
      this.init();
      if (!this.ctx) return;

      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();

      osc.connect(gain);
      gain.connect(this.ctx.destination);

      const now = this.ctx.currentTime;

      if (type === 'equals') {
        // High melodious chime
        osc.type = 'triangle';
        osc.frequency.setValueAtTime(587.33, now); // D5
        osc.frequency.exponentialRampToValueAtTime(880, now + 0.08); // A5
        gain.gain.setValueAtTime(0.12, now);
        gain.gain.exponentialRampToValueAtTime(0.001, now + 0.12);
        osc.start(now);
        osc.stop(now + 0.12);
      } else if (type === 'operator') {
        // Warm click
        osc.type = 'sine';
        osc.frequency.setValueAtTime(650, now);
        gain.gain.setValueAtTime(0.08, now);
        gain.gain.exponentialRampToValueAtTime(0.001, now + 0.04);
        osc.start(now);
        osc.stop(now + 0.04);
      } else if (type === 'clear') {
        // Descending low click
        osc.type = 'sine';
        osc.frequency.setValueAtTime(440, now);
        osc.frequency.exponentialRampToValueAtTime(220, now + 0.06);
        gain.gain.setValueAtTime(0.1, now);
        gain.gain.exponentialRampToValueAtTime(0.001, now + 0.06);
        osc.start(now);
        osc.stop(now + 0.06);
      } else {
        // Standard tactile tap
        osc.type = 'sine';
        osc.frequency.setValueAtTime(800, now);
        gain.gain.setValueAtTime(0.05, now);
        gain.gain.exponentialRampToValueAtTime(0.001, now + 0.025);
        osc.start(now);
        osc.stop(now + 0.025);
      }
    } catch (e) {
      // Audio playback silently ignored if blocked by autoplay policy
    }
  }
}

const sounds = new SoundEffects();

// ============================================================================
// 4. Mathematical Engine & Safe Tokenizer Evaluator
// ============================================================================
class MathEngine {
  /**
   * Sanitizes and parses human mathematical input into tokens,
   * then evaluates respecting operator precedence and parentheses.
   */
  static evaluate(expr) {
    if (!expr || typeof expr !== 'string') return 0;

    // Clean formatting
    let clean = expr
      .replace(/×/g, '*')
      .replace(/÷/g, '/')
      .replace(/−/g, '-')
      .replace(/,/g, '')
      .trim();

    if (!clean) return 0;

    // Check for balanced parentheses
    let balance = 0;
    for (const char of clean) {
      if (char === '(') balance++;
      if (char === ')') balance--;
      if (balance < 0) throw new Error('Unbalanced brackets');
    }
    // Auto-close trailing unclosed parentheses for live preview
    while (balance > 0) {
      clean += ')';
      balance--;
    }

    // Handle intelligent percentage patterns:
    // Pattern: A + B% => A + (A * (B/100))
    // Pattern: A - B% => A - (A * (B/100))
    // Pattern: A * B% => A * (B/100)
    // Pattern: A / B% => A / (B/100)
    // Standalone: B% => (B/100)
    clean = this.preprocessPercentages(clean);

    // Evaluate tokenized math safely
    const result = this.parseAndCompute(clean);

    if (!Number.isFinite(result)) {
      if (Number.isNaN(result)) throw new Error('Invalid calculation');
      throw new Error('Cannot divide by zero');
    }

    // Fix floating point imprecision (e.g. 0.1 + 0.2 = 0.3)
    return parseFloat(result.toPrecision(12));
  }

  static preprocessPercentages(str) {
    // Replace "number%" or "(expr)%" with division by 100
    // Intelligent additive/subtractive percentage: e.g. "100 + 20%" -> "100 + (100 * 0.2)"
    const addSubPercentRegex = /(-?\d+(?:\.\d+)?)\s*([\+\-])\s*(\d+(?:\.\d+)?)\%/g;
    str = str.replace(addSubPercentRegex, (match, base, op, pct) => {
      return `${base} ${op} (${base} * (${pct} / 100))`;
    });

    // Standalone percentages: "50%" -> "(50/100)"
    str = str.replace(/(\d+(?:\.\d+)?)\%/g, '($1 / 100)');

    return str;
  }

  /**
   * Safe recursive-descent math parser supporting +, -, *, /, ^, unary minus, and parentheses
   */
  static parseAndCompute(str) {
    let index = 0;

    function peek() {
      while (str[index] === ' ') index++;
      return str[index];
    }

    function get() {
      while (str[index] === ' ') index++;
      return str[index++];
    }

    function parseExpression() {
      let val = parseTerm();
      while (peek() === '+' || peek() === '-') {
        const op = get();
        const nextVal = parseTerm();
        if (op === '+') val += nextVal;
        else val -= nextVal;
      }
      return val;
    }

    function parseTerm() {
      let val = parseFactor();
      while (peek() === '*' || peek() === '/') {
        const op = get();
        const nextVal = parseFactor();
        if (op === '*') val *= nextVal;
        else {
          if (nextVal === 0) throw new Error('Cannot divide by zero');
          val /= nextVal;
        }
      }
      return val;
    }

    function parseFactor() {
      let val = parseUnary();
      if (peek() === '^') {
        get();
        const exponent = parseFactor(); // Right-associative
        val = Math.pow(val, exponent);
      }
      return val;
    }

    function parseUnary() {
      if (peek() === '-') {
        get();
        return -parseUnary();
      }
      if (peek() === '+') {
        get();
        return parseUnary();
      }
      return parsePrimary();
    }

    function parsePrimary() {
      const char = peek();

      if (char === '(') {
        get(); // consume '('
        const val = parseExpression();
        if (peek() === ')') {
          get(); // consume ')'
        }
        return val;
      }

      // Read number
      let numStr = '';
      while (peek() && /[0-9.]/.test(peek())) {
        numStr += get();
      }

      if (numStr === '') {
        throw new Error('Malformed expression');
      }

      const num = parseFloat(numStr);
      if (Number.isNaN(num)) throw new Error('Invalid number');
      return num;
    }

    const finalVal = parseExpression();
    return finalVal;
  }

  /**
   * Formats numbers cleanly with comma separators while preserving precision
   */
  static formatNumber(num) {
    if (num === null || num === undefined || Number.isNaN(num)) return '0';
    if (!Number.isFinite(num)) return num > 0 ? 'Infinity' : '-Infinity';

    // If extremely large or tiny, use scientific notation
    const absVal = Math.abs(num);
    if ((absVal >= 1e14 || (absVal > 0 && absVal < 1e-7))) {
      return num.toExponential(6).replace('e+', 'e');
    }

    const parts = num.toString().split('.');
    const integerPart = parts[0].replace(/\B(?=(\d{3})+(?!\d))/g, ',');
    return parts.length > 1 ? `${integerPart}.${parts[1]}` : integerPart;
  }

  /**
   * Pretty-prints a math expression for user display
   */
  static formatExpressionForDisplay(expr) {
    return expr
      .replace(/\*/g, ' × ')
      .replace(/\//g, ' ÷ ')
      .replace(/\+/g, ' + ')
      .replace(/(?<=\S)-(?=\S)/g, ' − ')
      .replace(/\s+/g, ' ');
  }
}

// ============================================================================
// 5. Calculator UI Controller & Logic
// ============================================================================
class CalculatorController {
  constructor() {
    this.init();
  }

  init() {
    this.loadPreferences();
    this.bindEvents();
    this.updateDisplay();
    this.updateHistoryUI();
  }

  // --- Display Updates & Live Preview ---
  updateDisplay(forceResult = null) {
    if (forceResult !== null) {
      DOM.mainDisplay.textContent = forceResult;
      DOM.previewContainer.style.opacity = '0';
      this.adjustFontSize(forceResult);
      return;
    }

    if (state.expression === '') {
      DOM.mainDisplay.textContent = '0';
      DOM.expressionDisplay.textContent = '';
      DOM.previewDisplay.textContent = '0';
      DOM.previewContainer.style.opacity = '0';
      this.adjustFontSize('0');
      return;
    }

    // Display formatted current expression in main display or active token
    const displayExp = MathEngine.formatExpressionForDisplay(state.expression);
    DOM.mainDisplay.textContent = displayExp;
    this.adjustFontSize(displayExp);

    // Compute Real-Time Live Preview
    this.calculateLivePreview();
  }

  calculateLivePreview() {
    if (!state.expression) {
      DOM.previewContainer.style.opacity = '0';
      return;
    }

    // If expression ends with an operator or bracket, try evaluating up to the operator
    let testExpr = state.expression.trim();

    // If ends with operator, test preview of prefix
    if (/[\+\-\*\/]$/.test(testExpr)) {
      testExpr = testExpr.slice(0, -1).trim();
    }

    if (!testExpr) {
      DOM.previewContainer.style.opacity = '0';
      return;
    }

    try {
      const preview = MathEngine.evaluate(testExpr);
      DOM.previewDisplay.textContent = MathEngine.formatNumber(preview);
      DOM.previewContainer.style.opacity = '1';
    } catch (e) {
      // Incomplete input is expected while typing, gently hide or preserve
      DOM.previewContainer.style.opacity = '0.4';
    }
  }

  adjustFontSize(text) {
    const len = text.length;
    DOM.mainDisplay.classList.remove('text-lg', 'text-md', 'text-sm', 'text-xs');

    if (len > 22) {
      DOM.mainDisplay.classList.add('text-xs');
    } else if (len > 16) {
      DOM.mainDisplay.classList.add('text-sm');
    } else if (len > 12) {
      DOM.mainDisplay.classList.add('text-md');
    } else if (len > 9) {
      DOM.mainDisplay.classList.add('text-lg');
    }
  }

  // --- Input Handlers ---
  inputDigit(digit) {
    sounds.playClick('num');

    if (state.justCalculated) {
      // Starting a fresh calculation after equals
      state.expression = digit.toString();
      state.justCalculated = false;
      DOM.expressionDisplay.textContent = '';
    } else {
      // Prevent multiple leading zeroes (e.g. "000")
      const tokens = state.expression.split(/[\+\-\*\/\(\)\^]/);
      const currentToken = tokens[tokens.length - 1];

      if (currentToken === '0' && digit === '0') {
        return;
      }
      if (currentToken === '0' && digit !== '0') {
        state.expression = state.expression.slice(0, -1) + digit;
      } else {
        state.expression += digit;
      }
    }

    this.updateDisplay();
  }

  inputDecimal() {
    sounds.playClick('num');

    if (state.justCalculated) {
      state.expression = '0.';
      state.justCalculated = false;
      DOM.expressionDisplay.textContent = '';
      this.updateDisplay();
      return;
    }

    // Inspect the current number token being typed
    const tokens = state.expression.split(/[\+\-\*\/\(\)\^]/);
    const currentToken = tokens[tokens.length - 1];

    // Prevent multiple decimals in the same number token
    if (currentToken.includes('.')) {
      this.triggerShake();
      return;
    }

    if (currentToken === '' || /[\+\-\*\/\(\)\^]$/.test(state.expression)) {
      state.expression += '0.';
    } else {
      state.expression += '.';
    }

    this.updateDisplay();
  }

  inputOperator(op) {
    sounds.playClick('operator');

    if (state.expression === '') {
      if (state.lastResult !== null) {
        // Continue calculation using previous result
        state.expression = state.lastResult.toString() + ' ' + op + ' ';
      } else if (op === '-') {
        // Unary minus to start negative number
        state.expression = '-';
      } else {
        return;
      }
      state.justCalculated = false;
      this.updateDisplay();
      return;
    }

    if (state.justCalculated) {
      state.justCalculated = false;
      state.expression = state.lastResult.toString() + ' ' + op + ' ';
      this.updateDisplay();
      return;
    }

    const trimmed = state.expression.trim();
    const lastChar = trimmed.slice(-1);

    // If consecutive operator is pressed:
    if (['+', '-', '*', '/'].includes(lastChar)) {
      // Allow unary minus after multiply or divide (e.g. 5 * -2)
      if ((lastChar === '*' || lastChar === '/') && op === '-') {
        state.expression += ' -';
      } else {
        // Replace previous operator smoothly
        state.expression = trimmed.slice(0, -1) + op + ' ';
      }
    } else {
      state.expression += ' ' + op + ' ';
    }

    this.updateDisplay();
  }

  inputParentheses() {
    sounds.playClick('operator');

    if (state.justCalculated) {
      state.expression = '(';
      state.justCalculated = false;
      this.updateDisplay();
      return;
    }

    // Count open vs close parentheses
    let openCount = 0;
    let closeCount = 0;
    for (const ch of state.expression) {
      if (ch === '(') openCount++;
      if (ch === ')') closeCount++;
    }

    const trimmed = state.expression.trim();
    const lastChar = trimmed.slice(-1);

    // If there are unclosed parentheses and last char is a digit, dot, or ')', close it!
    if (openCount > closeCount && (/[0-9\.\)]/.test(lastChar))) {
      state.expression += ')';
    } else {
      // Otherwise insert open parenthesis (with implicit multiplication if preceded by digit)
      if (/[0-9\.\)]/.test(lastChar)) {
        state.expression += ' * (';
      } else {
        state.expression += '(';
      }
    }

    this.updateDisplay();
  }

  inputPercent() {
    sounds.playClick('operator');
    if (!state.expression) return;

    const trimmed = state.expression.trim();
    const lastChar = trimmed.slice(-1);

    if (/[0-9]/.test(lastChar)) {
      state.expression += '%';
      this.updateDisplay();
    }
  }

  toggleNegate() {
    sounds.playClick('operator');

    if (state.justCalculated && state.lastResult !== null) {
      state.expression = (-state.lastResult).toString();
      state.lastResult = -state.lastResult;
      state.justCalculated = false;
      this.updateDisplay();
      return;
    }

    if (!state.expression) {
      state.expression = '-';
      this.updateDisplay();
      return;
    }

    // Toggle negation on the last active number token
    const match = state.expression.match(/(-?\d+(?:\.\d+)?)$/);
    if (match) {
      const numStr = match[1];
      const startIdx = match.index;
      let toggled;
      if (numStr.startsWith('-')) {
        toggled = numStr.slice(1);
      } else {
        toggled = '-' + numStr;
      }
      state.expression = state.expression.slice(0, startIdx) + toggled;
      this.updateDisplay();
    }
  }

  deleteLast() {
    sounds.playClick('operator');

    if (state.justCalculated) {
      this.clearAll();
      return;
    }

    if (state.expression.length > 0) {
      // If trailing spaces exist, remove them too
      state.expression = state.expression.trimEnd();
      state.expression = state.expression.slice(0, -1).trimEnd();
      this.updateDisplay();
    }
  }

  clearAll() {
    sounds.playClick('clear');
    state.expression = '';
    state.lastResult = null;
    state.justCalculated = false;
    DOM.expressionDisplay.textContent = '';
    this.updateDisplay();
  }

  // --- Core Calculation Execution (=) ---
  calculate() {
    if (!state.expression) return;

    try {
      const rawExpr = state.expression;
      const result = MathEngine.evaluate(rawExpr);
      sounds.playClick('equals');

      // Update Screen
      const formattedResult = MathEngine.formatNumber(result);
      const formattedExpr = MathEngine.formatExpressionForDisplay(rawExpr);

      DOM.expressionDisplay.textContent = `${formattedExpr} =`;
      this.updateDisplay(formattedResult);

      // Save to History Tape
      this.addHistoryItem(rawExpr, formattedExpr, formattedResult);

      // Update State
      state.lastResult = result;
      state.expression = result.toString();
      state.justCalculated = true;
    } catch (err) {
      this.triggerError(err.message || 'Invalid Expression');
    }
  }

  // --- Scientific Operations ---
  applyScientificFunction(action) {
    sounds.playClick('operator');

    if (!state.expression && state.lastResult !== null) {
      state.expression = state.lastResult.toString();
    }

    if (!state.expression) {
      if (action === 'pi') state.expression = Math.PI.toString();
      else if (action === 'euler') state.expression = Math.E.toString();
      this.updateDisplay();
      return;
    }

    try {
      const currentVal = MathEngine.evaluate(state.expression);
      let calculatedVal = currentVal;

      switch (action) {
        case 'sqrt':
          if (currentVal < 0) throw new Error('Invalid Input: √ negative');
          calculatedVal = Math.sqrt(currentVal);
          break;
        case 'square':
          calculatedVal = Math.pow(currentVal, 2);
          break;
        case 'power':
          state.expression = `(${state.expression}) ^ `;
          this.updateDisplay();
          return;
        case 'reciprocal':
          if (currentVal === 0) throw new Error('Cannot divide by zero');
          calculatedVal = 1 / currentVal;
          break;
        case 'pi':
          state.expression += ` * ${Math.PI}`;
          this.updateDisplay();
          return;
        case 'euler':
          state.expression += ` * ${Math.E}`;
          this.updateDisplay();
          return;
        case 'abs':
          calculatedVal = Math.abs(currentVal);
          break;
        case 'factorial':
          calculatedVal = this.factorial(currentVal);
          break;
        default:
          return;
      }

      calculatedVal = parseFloat(calculatedVal.toPrecision(12));
      const formatted = MathEngine.formatNumber(calculatedVal);

      DOM.expressionDisplay.textContent = `${action}(${MathEngine.formatNumber(currentVal)}) =`;
      this.updateDisplay(formatted);

      this.addHistoryItem(`${action}(${currentVal})`, `${action}(${currentVal})`, formatted);

      state.lastResult = calculatedVal;
      state.expression = calculatedVal.toString();
      state.justCalculated = true;
    } catch (e) {
      this.triggerError(e.message);
    }
  }

  factorial(n) {
    if (!Number.isInteger(n) || n < 0) throw new Error('Factorial requires non-negative integer');
    if (n > 170) throw new Error('Overflow: n > 170');
    if (n === 0 || n === 1) return 1;
    let res = 1;
    for (let i = 2; i <= n; i++) res *= i;
    return res;
  }

  // --- Memory Operations ---
  handleMemory(action) {
    sounds.playClick('operator');

    try {
      const currentVal = state.expression ? MathEngine.evaluate(state.expression) : (state.lastResult || 0);

      switch (action) {
        case 'mem-clear':
          state.memory = 0;
          this.showToast('Memory Cleared (MC)');
          break;
        case 'mem-recall':
          state.expression = state.memory.toString();
          state.justCalculated = false;
          this.showToast(`Memory Recall: ${MathEngine.formatNumber(state.memory)}`);
          this.updateDisplay();
          break;
        case 'mem-add':
          state.memory += currentVal;
          this.showToast(`Added to Memory (M+)`);
          break;
        case 'mem-sub':
          state.memory -= currentVal;
          this.showToast(`Subtracted from Memory (M−)`);
          break;
        case 'mem-store':
          state.memory = currentVal;
          this.showToast(`Stored to Memory: ${MathEngine.formatNumber(state.memory)}`);
          break;
      }

      DOM.memoryIndicator.classList.toggle('active', state.memory !== 0);
    } catch (e) {
      this.triggerError('Memory Error');
    }
  }

  // --- Error Handling & Shake Animation ---
  triggerError(message) {
    sounds.playClick('clear');
    DOM.mainDisplay.textContent = message;
    DOM.previewContainer.style.opacity = '0';
    this.adjustFontSize(message);
    this.triggerShake();
    state.expression = '';
    state.justCalculated = true;
  }

  triggerShake() {
    DOM.screen.classList.remove('shake');
    void DOM.screen.offsetWidth; // Force reflow
    DOM.screen.classList.add('shake');
    setTimeout(() => DOM.screen.classList.remove('shake'), 400);
  }

  // --- History Tape System ---
  addHistoryItem(rawExpr, displayExpr, result) {
    const item = {
      id: Date.now(),
      rawExpr,
      displayExpr,
      result,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' })
    };

    state.history.unshift(item);
    if (state.history.length > 50) state.history.pop();

    this.savePreferences();
    this.updateHistoryUI();
  }

  updateHistoryUI() {
    DOM.historyCountBadge.textContent = state.history.length;

    if (state.history.length === 0) {
      DOM.historyList.innerHTML = `
        <div class="history-empty">
          <svg viewBox="0 0 24 24" width="40" height="40" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
            <circle cx="12" cy="12" r="10"></circle>
            <path d="M12 6v6l4 2"></path>
          </svg>
          <p>No calculation history yet</p>
          <span>Calculations you complete will appear here</span>
        </div>
      `;
      return;
    }

    DOM.historyList.innerHTML = state.history.map(item => `
      <div class="history-card" data-id="${item.id}">
        <div class="history-item-top">
          <span class="history-time">${item.timestamp}</span>
        </div>
        <div class="history-item-exp">${item.displayExpr} =</div>
        <div class="history-item-res">${item.result}</div>
        <div class="history-actions-row">
          <button type="button" class="history-mini-btn btn-reuse-exp" data-raw="${item.rawExpr}" title="Load Expression">Use Expression</button>
          <button type="button" class="history-mini-btn btn-reuse-res" data-res="${item.result.replace(/,/g, '')}" title="Use Result">Use Result</button>
          <button type="button" class="history-mini-btn btn-copy-item" data-copy="${item.result}" title="Copy Result">Copy</button>
        </div>
      </div>
    `).join('');

    // Attach History Card Actions
    DOM.historyList.querySelectorAll('.btn-reuse-exp').forEach(btn => {
      btn.addEventListener('click', (e) => {
        e.stopPropagation();
        state.expression = btn.dataset.raw;
        state.justCalculated = false;
        this.updateDisplay();
        this.closeHistoryDrawer();
        this.showToast('Loaded Expression');
      });
    });

    DOM.historyList.querySelectorAll('.btn-reuse-res').forEach(btn => {
      btn.addEventListener('click', (e) => {
        e.stopPropagation();
        state.expression = btn.dataset.res;
        state.justCalculated = false;
        this.updateDisplay();
        this.closeHistoryDrawer();
        this.showToast('Loaded Result');
      });
    });

    DOM.historyList.querySelectorAll('.btn-copy-item').forEach(btn => {
      btn.addEventListener('click', (e) => {
        e.stopPropagation();
        this.copyToClipboard(btn.dataset.copy);
      });
    });
  }

  clearHistory() {
    state.history = [];
    this.savePreferences();
    this.updateHistoryUI();
    this.showToast('History Cleared');
  }

  openHistoryDrawer() {
    DOM.historyDrawer.hidden = false;
    // Trigger transition
    requestAnimationFrame(() => {
      DOM.historyDrawer.classList.add('open');
      DOM.historyToggleBtn.setAttribute('aria-expanded', 'true');
    });
  }

  closeHistoryDrawer() {
    DOM.historyDrawer.classList.remove('open');
    DOM.historyToggleBtn.setAttribute('aria-expanded', 'false');
    setTimeout(() => {
      DOM.historyDrawer.hidden = true;
    }, 300);
  }

  // --- Themes & Preferences ---
  setTheme(themeName) {
    state.currentTheme = themeName;
    document.documentElement.setAttribute('data-theme', themeName);

    DOM.themeOptions.forEach(opt => {
      opt.classList.toggle('active', opt.dataset.themeVal === themeName);
    });

    this.savePreferences();
    this.showToast(`Theme: ${themeName.charAt(0).toUpperCase() + themeName.slice(1)}`);
  }

  toggleSound() {
    state.soundEnabled = !state.soundEnabled;
    DOM.soundToggleBtn.setAttribute('aria-pressed', state.soundEnabled.toString());

    const iconOn = DOM.soundToggleBtn.querySelector('.icon-sound-on');
    const iconOff = DOM.soundToggleBtn.querySelector('.icon-sound-off');

    if (state.soundEnabled) {
      iconOn.style.display = 'block';
      iconOff.style.display = 'none';
      sounds.playClick('num');
      this.showToast('Sound Feedback: Enabled');
    } else {
      iconOn.style.display = 'none';
      iconOff.style.display = 'block';
      this.showToast('Sound Feedback: Muted');
    }

    this.savePreferences();
  }

  toggleScientific() {
    state.isScientific = !state.isScientific;
    DOM.scientificPanel.hidden = !state.isScientific;
    DOM.scientificToggleBtn.setAttribute('aria-pressed', state.isScientific.toString());
    sounds.playClick('operator');
  }

  copyCurrentResult() {
    const textToCopy = DOM.mainDisplay.textContent;
    this.copyToClipboard(textToCopy);
  }

  copyToClipboard(text) {
    if (!text || text === '0') return;
    navigator.clipboard.writeText(text).then(() => {
      this.showToast(`Copied: ${text}`);
    }).catch(() => {
      // Fallback
      const ta = document.createElement('textarea');
      ta.value = text;
      document.body.appendChild(ta);
      ta.select();
      document.execCommand('copy');
      document.body.removeChild(ta);
      this.showToast(`Copied: ${text}`);
    });
  }

  showToast(message) {
    const toast = document.createElement('div');
    toast.className = 'toast';
    toast.innerHTML = `
      <svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
        <path d="M20 6L9 17l-5-5"></path>
      </svg>
      <span>${message}</span>
    `;
    DOM.toastContainer.appendChild(toast);
    setTimeout(() => {
      if (toast.parentNode) toast.parentNode.removeChild(toast);
    }, 2800);
  }

  savePreferences() {
    try {
      localStorage.setItem('quantum_calc_theme', state.currentTheme);
      localStorage.setItem('quantum_calc_sound', JSON.stringify(state.soundEnabled));
      localStorage.setItem('quantum_calc_history', JSON.stringify(state.history));
    } catch (e) {
      // localStorage may fail in restricted/private modes
    }
  }

  loadPreferences() {
    try {
      const savedTheme = localStorage.getItem('quantum_calc_theme');
      if (savedTheme) {
        state.currentTheme = savedTheme;
        document.documentElement.setAttribute('data-theme', savedTheme);
        DOM.themeOptions.forEach(opt => {
          opt.classList.toggle('active', opt.dataset.themeVal === savedTheme);
        });
      }

      const savedSound = localStorage.getItem('quantum_calc_sound');
      if (savedSound !== null) {
        state.soundEnabled = JSON.parse(savedSound);
        DOM.soundToggleBtn.setAttribute('aria-pressed', state.soundEnabled.toString());
        const iconOn = DOM.soundToggleBtn.querySelector('.icon-sound-on');
        const iconOff = DOM.soundToggleBtn.querySelector('.icon-sound-off');
        if (state.soundEnabled) {
          iconOn.style.display = 'block';
          iconOff.style.display = 'none';
        } else {
          iconOn.style.display = 'none';
          iconOff.style.display = 'block';
        }
      }

      const savedHistory = localStorage.getItem('quantum_calc_history');
      if (savedHistory) {
        state.history = JSON.parse(savedHistory);
      }
    } catch (e) {
      // Fallback
    }
  }

  // --- Event Bindings ---
  bindEvents() {
    // 1. Keypad Click Delegation
    DOM.keypad.addEventListener('click', (e) => {
      const btn = e.target.closest('.calc-btn');
      if (!btn) return;

      const action = btn.dataset.action;
      const val = btn.dataset.val;

      switch (action) {
        case 'number':
          this.inputDigit(val);
          break;
        case 'decimal':
          this.inputDecimal();
          break;
        case 'operator':
          this.inputOperator(val);
          break;
        case 'parentheses':
          this.inputParentheses();
          break;
        case 'percent':
          this.inputPercent();
          break;
        case 'negate':
          this.toggleNegate();
          break;
        case 'delete':
          this.deleteLast();
          break;
        case 'clear':
          this.clearAll();
          break;
        case 'calculate':
          this.calculate();
          break;
      }
    });

    // 2. Scientific Panel Buttons
    DOM.scientificPanel.addEventListener('click', (e) => {
      const btn = e.target.closest('.btn-sci');
      if (!btn) return;
      this.applyScientificFunction(btn.dataset.action);
    });

    // 3. Memory Buttons
    DOM.memoryBar.addEventListener('click', (e) => {
      const btn = e.target.closest('.mem-btn');
      if (!btn) return;
      this.handleMemory(btn.dataset.action);
    });

    // 4. Header & Top Controls
    DOM.scientificToggleBtn.addEventListener('click', () => this.toggleScientific());
    DOM.soundToggleBtn.addEventListener('click', () => this.toggleSound());
    DOM.copyResultBtn.addEventListener('click', () => this.copyCurrentResult());

    // 5. History Drawer
    DOM.historyToggleBtn.addEventListener('click', () => {
      if (DOM.historyDrawer.classList.contains('open')) {
        this.closeHistoryDrawer();
      } else {
        this.openHistoryDrawer();
      }
    });
    DOM.closeHistoryBtn.addEventListener('click', () => this.closeHistoryDrawer());
    DOM.clearHistoryBtn.addEventListener('click', () => this.clearHistory());

    // 6. Keyboard Shortcuts Modal
    DOM.shortcutsToggleBtn.addEventListener('click', () => {
      DOM.shortcutsModal.hidden = false;
    });
    DOM.closeShortcutsBtn.addEventListener('click', () => {
      DOM.shortcutsModal.hidden = true;
    });
    DOM.shortcutsGotItBtn.addEventListener('click', () => {
      DOM.shortcutsModal.hidden = true;
    });
    DOM.shortcutsModal.addEventListener('click', (e) => {
      if (e.target === DOM.shortcutsModal) DOM.shortcutsModal.hidden = true;
    });

    // 7. Theme Dropdown
    DOM.themePickerBtn.addEventListener('click', (e) => {
      e.stopPropagation();
      const isHidden = DOM.themeMenu.hidden;
      DOM.themeMenu.hidden = !isHidden;
      DOM.themePickerBtn.setAttribute('aria-expanded', isHidden.toString());
    });

    DOM.themeOptions.forEach(opt => {
      opt.addEventListener('click', () => {
        this.setTheme(opt.dataset.themeVal);
        DOM.themeMenu.hidden = true;
        DOM.themePickerBtn.setAttribute('aria-expanded', 'false');
      });
    });

    document.addEventListener('click', (e) => {
      if (!e.target.closest('.theme-dropdown-container')) {
        DOM.themeMenu.hidden = true;
        DOM.themePickerBtn.setAttribute('aria-expanded', 'false');
      }
      if (DOM.historyDrawer.classList.contains('open') && !e.target.closest('#historyDrawer') && !e.target.closest('#historyToggleBtn')) {
        this.closeHistoryDrawer();
      }
    });

    // 8. Global Keyboard Events
    window.addEventListener('keydown', (e) => this.handleKeyboard(e));
  }

  // --- Keyboard Support ---
  handleKeyboard(e) {
    // If modal is open, let Escape close modal
    if (!DOM.shortcutsModal.hidden && e.key === 'Escape') {
      DOM.shortcutsModal.hidden = true;
      return;
    }

    // Ignore if typing inside input/textarea (if any)
    if (['INPUT', 'TEXTAREA'].includes(document.activeElement.tagName)) {
      return;
    }

    const key = e.key;

    // Numbers 0-9
    if (/^[0-9]$/.test(key)) {
      e.preventDefault();
      this.inputDigit(key);
      this.animateKeypress(`[data-key="${key}"]`);
      return;
    }

    // Decimal Point
    if (key === '.' || key === ',') {
      e.preventDefault();
      this.inputDecimal();
      this.animateKeypress('#keyDecimal');
      return;
    }

    // Arithmetic Operators
    if (['+', '-', '*', '/'].includes(key)) {
      e.preventDefault();
      this.inputOperator(key);
      const selectorMap = {
        '+': '#keyAdd',
        '-': '#keySubtract',
        '*': '#keyMultiply',
        '/': '#keyDivide'
      };
      this.animateKeypress(selectorMap[key]);
      return;
    }

    // Equals / Enter
    if (key === 'Enter' || key === '=') {
      e.preventDefault();
      this.calculate();
      this.animateKeypress('#keyEquals');
      return;
    }

    // Backspace (Delete)
    if (key === 'Backspace') {
      e.preventDefault();
      this.deleteLast();
      this.animateKeypress('#keyDelete');
      return;
    }

    // Escape / Delete (AC)
    if (key === 'Escape' || key === 'Delete') {
      e.preventDefault();
      this.clearAll();
      this.animateKeypress('#keyClear');
      return;
    }

    // Percentage
    if (key === '%') {
      e.preventDefault();
      this.inputPercent();
      this.animateKeypress('#keyPercent');
      return;
    }

    // Parentheses
    if (key === '(' || key === ')') {
      e.preventDefault();
      this.inputParentheses();
      this.animateKeypress('#keyParentheses');
      return;
    }

    // Power
    if (key === '^') {
      e.preventDefault();
      this.inputOperator('^');
      return;
    }

    // Copy Result (Ctrl+C or Cmd+C)
    if ((e.ctrlKey || e.metaKey) && (key.toLowerCase() === 'c')) {
      // Allow default copy or copy calculator result
      this.copyCurrentResult();
      return;
    }

    // Toggle Scientific (Alt + S)
    if (e.altKey && key.toLowerCase() === 's') {
      e.preventDefault();
      this.toggleScientific();
      return;
    }

    // Toggle History (H)
    if (!e.ctrlKey && !e.metaKey && !e.altKey && key.toLowerCase() === 'h') {
      e.preventDefault();
      if (DOM.historyDrawer.classList.contains('open')) {
        this.closeHistoryDrawer();
      } else {
        this.openHistoryDrawer();
      }
      return;
    }

    // Keyboard Shortcuts Cheatsheet (?)
    if (key === '?') {
      e.preventDefault();
      DOM.shortcutsModal.hidden = false;
      return;
    }
  }

  animateKeypress(selector) {
    if (!selector) return;
    const btn = document.querySelector(selector);
    if (!btn) return;
    btn.classList.add('key-active');
    setTimeout(() => btn.classList.remove('key-active'), 140);
  }
}

// ============================================================================
// 6. Application Initialization
// ============================================================================
document.addEventListener('DOMContentLoaded', () => {
  window.quantumCalc = new CalculatorController();
});
