import type { Meta, StoryObj } from '@storybook/web-components';
import './os-badge';

const meta: Meta = { title: 'Components/Badge', component: 'os-badge' };
export default meta;

export const Variants: StoryObj = {
  render: () => {
    const wrap = document.createElement('div');
    wrap.style.display = 'flex';
    wrap.style.gap = '8px';
    ['neutral', 'success', 'warning', 'danger', 'info'].forEach((v) => {
      const b = document.createElement('os-badge');
      b.setAttribute('variant', v);
      b.textContent = v;
      wrap.appendChild(b);
    });
    return wrap;
  },
};
