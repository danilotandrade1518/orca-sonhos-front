import type { Meta, StoryObj } from '@storybook/web-components';
import './os-budget-picker';

const meta: Meta = { title: 'Components/Budget Picker', component: 'os-budget-picker' };
export default meta;

export const Default: StoryObj = {
  render: () => {
    const el = document.createElement('os-budget-picker');
    el.setAttribute(
      'options',
      JSON.stringify([
        { id: '2025-01', name: 'Janeiro', period: '2025-01' },
        { id: '2025-02', name: 'Fevereiro', period: '2025-02' },
        { id: '2025-03', name: 'Março', period: '2025-03' },
      ])
    );
    return el;
  },
};
