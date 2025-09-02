import type { Meta, StoryObj } from '@storybook/web-components';
import './os-list';

const meta: Meta = { title: 'Components/List', component: 'os-list' };
export default meta;

export const Default: StoryObj = {
  render: () => {
    const list = document.createElement('os-list');
    for (let i = 1; i <= 3; i++) {
      const item = document.createElement('div');
      item.textContent = `Item ${i}`;
      list.appendChild(item);
    }
    return list;
  },
};
