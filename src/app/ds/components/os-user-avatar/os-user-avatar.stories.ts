import type { Meta, StoryObj } from '@storybook/web-components';
import './os-user-avatar';

const meta: Meta = { title: 'Components/User Avatar', component: 'os-user-avatar' };
export default meta;

export const Initials: StoryObj = {
  render: () => {
    const a = document.createElement('os-user-avatar');
    a.setAttribute('name', 'Maria Silva');
    return a;
  },
};
export const Image: StoryObj = {
  render: () => {
    const a = document.createElement('os-user-avatar');
    a.setAttribute('src', 'https://placehold.co/64x64');
    return a;
  },
};
