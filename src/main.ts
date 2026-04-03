import type { AppState } from './types';
import { createPalette } from './palette';
import { setupCanvas, clearCanvas } from './canvas';
import { createCursor, updateCursor } from './cursors';
import { createStampTray } from './stamps';
import { playClear, playColorPick } from './sounds';

const state: AppState = {
  color: '#E84040',
  tool: 'paint',
  stamp: null,
  painting: false,
};

// DOM elements
const paletteContainer = document.getElementById('palette')!;
const canvasEl = document.getElementById('draw-canvas') as HTMLCanvasElement;
const clearBtn = document.getElementById('clear-btn')!;
const paintBtn = document.getElementById('paint-btn')!;
const fillBtn = document.getElementById('fill-btn')!;
const stampsContainer = document.getElementById('stamps')!;

// Custom cursor
const cursorEl = createCursor();
updateCursor(cursorEl, state, canvasEl);

// Canvas
const { canvas } = setupCanvas(canvasEl, state, cursorEl);

// Palette — selecting a color deselects stamp
createPalette(paletteContainer, state, () => {
  playColorPick();
  // Clear stamp selection UI
  stampsContainer.querySelectorAll('.stamp-btn').forEach((el) => el.classList.remove('selected'));
  updateCursor(cursorEl, state, canvasEl);
});

// Stamps
createStampTray(stampsContainer, state, () => {
  updateCursor(cursorEl, state, canvasEl);
});

// Tool toggle
function setTool(tool: AppState['tool']) {
  state.tool = tool;
  state.stamp = null;
  paintBtn.classList.toggle('active', tool === 'paint');
  fillBtn.classList.toggle('active', tool === 'fill');
  stampsContainer.querySelectorAll('.stamp-btn').forEach((el) => el.classList.remove('selected'));
  updateCursor(cursorEl, state, canvasEl);
}

paintBtn.addEventListener('pointerdown', (e) => {
  e.preventDefault();
  setTool('paint');
});

fillBtn.addEventListener('pointerdown', (e) => {
  e.preventDefault();
  setTool('fill');
});

// Clear
clearBtn.addEventListener('pointerdown', (e) => {
  e.preventDefault();
  clearCanvas(canvas);
  playClear();
});
