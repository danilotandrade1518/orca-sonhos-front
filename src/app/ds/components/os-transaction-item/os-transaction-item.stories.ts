import type { Meta, StoryObj } from '@storybook/web-components';
import './os-transaction-item';

const meta: Meta = { title: 'Components/Transaction Item', component: 'os-transaction-item' };
export default meta;

export const Default: StoryObj = {
  render: () => {
    const el = document.createElement('os-transaction-item');
    const title = document.createElement('div');
    title.slot = 'title';
    title.textContent = 'Supermercado';
    const date = document.createElement('div');
    date.slot = 'date';
    date.textContent = '12/03/2025';
    const amount = document.createElement('div');
    amount.slot = 'amount';
    amount.textContent = '- R$ 150,90';
    amount.className = 'amount negative';
    el.append(title, date, amount);
    return el;
  },
};
