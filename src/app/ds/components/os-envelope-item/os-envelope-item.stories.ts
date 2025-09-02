import type { Meta, StoryObj } from '@storybook/web-components';
import './os-envelope-item';

const meta: Meta = { title: 'Components/Envelope Item', component: 'os-envelope-item' };
export default meta;

export const Default: StoryObj = {
  render: () => {
    const el = document.createElement('os-envelope-item');
    const name = document.createElement('div');
    name.slot = 'name';
    name.textContent = 'Alimentação';
    const meta = document.createElement('div');
    meta.slot = 'meta';
    meta.textContent = 'Restante R$ 120,00 de R$ 500,00';
    const amount = document.createElement('div');
    amount.slot = 'amount';
    amount.textContent = 'R$ 380,00';
    amount.className = 'amount positive';
    el.append(name, meta, amount);
    return el;
  },
};
