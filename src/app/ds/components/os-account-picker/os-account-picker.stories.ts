import type { Meta, StoryObj } from '@storybook/web-components';
import './os-account-picker';

const meta: Meta = { title: 'Components/Account Picker', component: 'os-account-picker' };
export default meta;

export const Default: StoryObj = {
  render: () => {
    const el = document.createElement('os-account-picker');
    el.setAttribute(
      'options',
      JSON.stringify([
        { id: '1', name: 'Carteira', type: 'Cash', balance: 'R$ 120,00' },
        { id: '2', name: 'Nubank', type: 'Conta', balance: 'R$ 2.350,87' },
        { id: '3', name: 'Inter', type: 'Conta', balance: 'R$ 540,12' },
      ])
    );
    return el;
  },
};
