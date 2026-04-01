import type { AppState, Point } from './types';

const STAMPS = [
  { emoji: '🐄', name: 'Cow' },
  { emoji: '🐟', name: 'Fish' },
  { emoji: '🦁', name: 'Lion' },
  { emoji: '🦊', name: 'Fox' },
  { emoji: '⭐', name: 'Star' },
  { emoji: '🌈', name: 'Rainbow' },
  { emoji: '🌸', name: 'Blossom' },
  { emoji: '❤️', name: 'Heart' },
];

export function createStampTray(
  container: HTMLElement,
  state: AppState,
  onStampChange: () => void
) {
  STAMPS.forEach(({ emoji }) => {
    const btn = document.createElement('button');
    btn.className = 'stamp-btn';
    btn.textContent = emoji;
    btn.dataset.stamp = emoji;

    btn.addEventListener('pointerdown', (e) => {
      e.preventDefault();
      if (state.stamp === emoji) {
        // Deselect
        state.stamp = null;
      } else {
        state.stamp = emoji;
      }
      updateStampSelection(container, state);
      onStampChange();
    });

    container.appendChild(btn);
  });
}

function updateStampSelection(container: HTMLElement, state: AppState) {
  container.querySelectorAll('.stamp-btn').forEach((el) => {
    const btn = el as HTMLButtonElement;
    if (btn.dataset.stamp === state.stamp) {
      btn.classList.add('selected');
    } else {
      btn.classList.remove('selected');
    }
  });
}

export function placeStamp(
  ctx: CanvasRenderingContext2D,
  stamp: string,
  p: Point
) {
  ctx.font = '64px serif';
  ctx.textAlign = 'center';
  ctx.textBaseline = 'middle';
  ctx.fillText(stamp, p.x, p.y);
}

export function animateStampBounce(clientX: number, clientY: number, stamp: string) {
  const el = document.createElement('div');
  el.className = 'stamp-bounce';
  el.textContent = stamp;
  el.style.left = clientX + 'px';
  el.style.top = clientY + 'px';
  document.body.appendChild(el);
  el.addEventListener('animationend', () => el.remove());
}
