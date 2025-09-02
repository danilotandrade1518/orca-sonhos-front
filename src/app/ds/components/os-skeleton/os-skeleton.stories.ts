import type { Meta, StoryObj } from '@storybook/web-components';
import './os-skeleton';

const meta: Meta = { title: 'Components/Skeleton', component: 'os-skeleton' };
export default meta;

export const Line: StoryObj = {
  render: () => {
    const el = document.createElement('os-skeleton');
    el.setAttribute('width', '240px');
    el.setAttribute('height', '1rem');
    return el;
  },
};

export const Circle: StoryObj = {
  render: () => {
    const el = document.createElement('os-skeleton');
    el.setAttribute('circle', '');
    el.setAttribute('size', '48px');
    return el;
  },
};
