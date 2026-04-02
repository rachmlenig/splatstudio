import type { AppState, Point } from './types';
import { placeStamp, animateStampBounce } from './stamps';
import { playPaintStart, playFill, playStamp } from './sounds';

function hexToRgb(hex: string): [number, number, number] {
  const n = parseInt(hex.slice(1), 16);
  return [(n >> 16) & 255, (n >> 8) & 255, n & 255];
}

function floodFill(ctx: CanvasRenderingContext2D, x: number, y: number, fillHex: string) {
  const w = ctx.canvas.width;
  const h = ctx.canvas.height;
  const imageData = ctx.getImageData(0, 0, w, h);
  const data = imageData.data;
  const [fr, fg, fb] = hexToRgb(fillHex);

  const sx = Math.floor(x);
  const sy = Math.floor(y);
  if (sx < 0 || sx >= w || sy < 0 || sy >= h) return;

  const startIdx = (sy * w + sx) * 4;
  const sr = data[startIdx];
  const sg = data[startIdx + 1];
  const sb = data[startIdx + 2];
  const sa = data[startIdx + 3];

  // Don't fill if clicking on the same color
  if (sr === fr && sg === fg && sb === fb && sa === 255) return;

  const tolerance = 30;

  function matches(i: number): boolean {
    return (
      Math.abs(data[i] - sr) <= tolerance &&
      Math.abs(data[i + 1] - sg) <= tolerance &&
      Math.abs(data[i + 2] - sb) <= tolerance &&
      Math.abs(data[i + 3] - sa) <= tolerance
    );
  }

  const stack: number[] = [sx, sy];
  const visited = new Uint8Array(w * h);

  while (stack.length > 0) {
    const cy = stack.pop()!;
    const cx = stack.pop()!;
    const pos = cy * w + cx;
    if (visited[pos]) continue;
    visited[pos] = 1;

    const idx = pos * 4;
    if (!matches(idx)) continue;

    data[idx] = fr;
    data[idx + 1] = fg;
    data[idx + 2] = fb;
    data[idx + 3] = 255;

    if (cx > 0) stack.push(cx - 1, cy);
    if (cx < w - 1) stack.push(cx + 1, cy);
    if (cy > 0) stack.push(cx, cy - 1);
    if (cy < h - 1) stack.push(cx, cy + 1);
  }

  ctx.putImageData(imageData, 0, 0);
}

function showSplash(clientX: number, clientY: number) {
  const el = document.createElement('div');
  el.className = 'splash';
  el.textContent = '💦';
  el.style.left = clientX + 'px';
  el.style.top = clientY + 'px';
  document.body.appendChild(el);
  el.addEventListener('animationend', () => el.remove());
}

export function setupCanvas(
  canvas: HTMLCanvasElement,
  state: AppState,
  cursorEl: HTMLElement
) {
  const ctx = canvas.getContext('2d')!;
  let lastPoint: Point | null = null;

  function resize() {
    const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
    canvas.width = canvas.clientWidth;
    canvas.height = canvas.clientHeight;
    ctx.putImageData(imageData, 0, 0);
  }

  resize();
  window.addEventListener('resize', resize);

  function drawDot(p: Point) {
    ctx.beginPath();
    ctx.arc(p.x, p.y, 16, 0, Math.PI * 2);
    ctx.fillStyle = state.color;
    ctx.fill();
  }

  function drawLine(from: Point, to: Point) {
    ctx.beginPath();
    ctx.moveTo(from.x, from.y);
    ctx.lineTo(to.x, to.y);
    ctx.strokeStyle = state.color;
    ctx.lineWidth = 32;
    ctx.lineCap = 'round';
    ctx.lineJoin = 'round';
    ctx.stroke();
  }

  function getPoint(e: PointerEvent): Point {
    const rect = canvas.getBoundingClientRect();
    return { x: e.clientX - rect.left, y: e.clientY - rect.top };
  }

  canvas.addEventListener('pointerdown', (e) => {
    e.preventDefault();

    if (state.stamp) {
      const p = getPoint(e);
      placeStamp(ctx, state.stamp, p);
      animateStampBounce(e.clientX, e.clientY, state.stamp);
      playStamp();
      return;
    }

    if (state.tool === 'fill') {
      const p = getPoint(e);
      floodFill(ctx, p.x, p.y, state.color);
      showSplash(e.clientX, e.clientY);
      playFill();
      return;
    }

    if (state.tool !== 'paint') return;
    state.painting = true;
    const p = getPoint(e);
    drawDot(p);
    lastPoint = p;
    playPaintStart();
    canvas.setPointerCapture(e.pointerId);
  });

  document.addEventListener('pointermove', (e) => {
    const rect = canvas.getBoundingClientRect();
    // Update custom cursor position
    cursorEl.style.left = e.clientX + 'px';
    cursorEl.style.top = e.clientY + 'px';

    // Show/hide cursor based on whether pointer is over canvas
    const overCanvas = e.target === canvas;
    cursorEl.style.display = overCanvas ? 'block' : 'none';

    if (!state.painting || state.tool !== 'paint') return;
    const p = getPoint(e);
    if (lastPoint) {
      drawLine(lastPoint, p);
    }
    lastPoint = p;
  });

  const endPaint = () => {
    state.painting = false;
    lastPoint = null;
  };

  canvas.addEventListener('pointerup', endPaint);
  canvas.addEventListener('pointercancel', endPaint);

  // Hide cursor when leaving window
  document.addEventListener('pointerleave', () => {
    cursorEl.style.display = 'none';
  });

  return { ctx, canvas };
}

export function clearCanvas(canvas: HTMLCanvasElement) {
  const ctx = canvas.getContext('2d')!;
  ctx.clearRect(0, 0, canvas.width, canvas.height);
}
