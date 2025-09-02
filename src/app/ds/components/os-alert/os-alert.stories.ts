import type { Meta, StoryObj } from '@storybook/web-components';
import './os-alert';

const meta: Meta = { title: 'Components/Alert', component: 'os-alert' };
export default meta;

export const Variants: StoryObj = {
  render: () => {
    const wrap = document.createElement('div');
    wrap.style.display = 'grid';
    wrap.style.gap = '12px';
    ['info', 'success', 'warning', 'danger'].forEach((v) => {
      const a = document.createElement('os-alert');
      a.setAttribute('variant', v);
      const t = document.createElement('div');
      t.slot = 'title';
      t.textContent = `Alerta ${v}`;
      a.append(t, document.createTextNode('Mensagem de exemplo.'));
      wrap.appendChild(a);
    });
    return wrap;
  },
};
