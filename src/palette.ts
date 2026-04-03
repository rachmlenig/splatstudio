import type { AppState } from './types';

const COLORS = [
  { name: 'Red', hex: '#E84040' },
  { name: 'Orange', hex: '#F5833A' },
  { name: 'Yellow', hex: '#F5D020' },
  { name: 'Green', hex: '#4DBD6E' },
  { name: 'Blue', hex: '#3A9EE8' },
  { name: 'Purple', hex: '#9B59E8' },
  { name: 'Pink', hex: '#E840A0' },
  { name: 'Brown', hex: '#6D4C41' },
  { name: 'White', hex: '#FFFFFF' },
  { name: 'Black', hex: '#2C2C2C' },
];

export function createPalette(
  container: HTMLElement,
  state: AppState,
  onColorChange: () => void
) {
  COLORS.forEach(({ hex }) => {
    const swatch = document.createElement('button');
    swatch.className = 'swatch';
    swatch.dataset.color = hex;
    swatch.style.backgroundColor = hex;
    if (hex === '#FFFFFF') {
      swatch.style.border = '3px solid #ddd';
    }

    swatch.addEventListener('pointerdown', (e) => {
      e.preventDefault();
      state.color = hex;
      state.stamp = null;
      updateSelection(container, state);
      onColorChange();
    });

    container.appendChild(swatch);
  });

  updateSelection(container, state);
}

function updateSelection(container: HTMLElement, state: AppState) {
  container.querySelectorAll('.swatch').forEach((el) => {
    const btn = el as HTMLButtonElement;
    if (btn.dataset.color === state.color) {
      btn.classList.add('selected');
    } else {
      btn.classList.remove('selected');
    }
  });
}
