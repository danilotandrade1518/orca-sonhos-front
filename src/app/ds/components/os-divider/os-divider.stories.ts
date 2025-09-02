import type { Meta, StoryObj } from '@storybook/web-components';
import './os-divider';

const meta: Meta = { title: 'Components/Divider', component: 'os-divider' };
export default meta;

export const Basic: StoryObj = {
  render: () => document.createElement('os-divider'),
};

export const SpacedLg: StoryObj = {
  render: () => {
    const el = document.createElement('os-divider');
    el.setAttribute('spaced', 'lg');
    return el;
  },
};
