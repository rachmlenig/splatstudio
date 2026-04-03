import type { AppState } from './types';

export function createCursor(): HTMLElement {
  const el = document.createElement('div');
  el.id = 'custom-cursor';
  el.style.cssText = `
    position: fixed;
    pointer-events: none;
    z-index: 9999;
    display: none;
    transform: translate(-50%, -50%);
    border-radius: 50%;
    transition: background-color 0.1s;
  `;
  document.body.appendChild(el);
  return el;
}

export function updateCursor(cursorEl: HTMLElement, state: AppState, canvasEl?: HTMLCanvasElement) {
  // Hide custom cursor — pointermove will re-show it when over canvas
  cursorEl.style.display = 'none';

  if (state.stamp) {
    // Stamp emoji follows pointer
    cursorEl.style.width = 'auto';
    cursorEl.style.height = 'auto';
    cursorEl.style.backgroundColor = 'transparent';
    cursorEl.style.border = 'none';
    cursorEl.style.borderRadius = '0';
    cursorEl.style.fontSize = '52px';
    cursorEl.style.lineHeight = '1';
    cursorEl.textContent = state.stamp;
    if (canvasEl) canvasEl.style.cursor = 'none';
  } else if (state.tool === 'fill') {
    cursorEl.textContent = '';
    if (canvasEl) canvasEl.style.cursor = 'crosshair';
  } else {
    // Paint tool
    cursorEl.style.width = '36px';
    cursorEl.style.height = '36px';
    cursorEl.style.backgroundColor = state.color;
    cursorEl.style.borderRadius = '50%';
    cursorEl.style.fontSize = '';
    cursorEl.textContent = '';
    if (canvasEl) canvasEl.style.cursor = 'none';
    if (state.color === '#FFFFFF') {
      cursorEl.style.border = '2px solid #ccc';
    } else {
      cursorEl.style.border = 'none';
    }
  }
}
