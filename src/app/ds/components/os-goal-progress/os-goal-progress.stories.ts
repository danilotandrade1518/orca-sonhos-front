import type { Meta, StoryObj } from '@storybook/web-components';
import './os-goal-progress';

const meta: Meta = { title: 'Components/Goal Progress', component: 'os-goal-progress' };
export default meta;

export const Default: StoryObj = {
  render: () => {
    const el = document.createElement('os-goal-progress');
    el.setAttribute('name', 'Viagem');
    el.setAttribute('value', '350');
    el.setAttribute('target', '1000');
    return el;
  },
};
