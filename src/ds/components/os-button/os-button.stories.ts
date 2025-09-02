import type { Meta, StoryObj } from '@storybook/web-components';
import './os-button';

const meta: Meta = {
  title: 'Components/Button',
  component: 'os-button',
  args: { variant: 'primary', disabled: false },
  argTypes: {
    variant: { control: 'select', options: ['primary', 'secondary', 'ghost', 'danger'] },
    disabled: { control: 'boolean' },
    defaultSlot: { control: 'text', name: 'label' },
  },
  render: (args: any) => {
    const btn = document.createElement('os-button');
    if (args.variant) btn.setAttribute('variant', args.variant);
    if (args.disabled) btn.setAttribute('disabled', '');
    btn.textContent = args.defaultSlot ?? 'Button';
    return btn;
  },
};
export default meta;

export const Primary: StoryObj = { args: { variant: 'primary', defaultSlot: 'Primary' } };
export const Secondary: StoryObj = { args: { variant: 'secondary', defaultSlot: 'Secondary' } };
export const Ghost: StoryObj = { args: { variant: 'ghost', defaultSlot: 'Ghost' } };
export const Danger: StoryObj = { args: { variant: 'danger', defaultSlot: 'Danger' } };
export const Disabled: StoryObj = { args: { disabled: true, defaultSlot: 'Disabled' } };
export const IconOnly: StoryObj = {
  render: () => {
    const btn = document.createElement('os-button');
    btn.setAttribute('variant', 'primary');
    btn.innerHTML = '<span style="font-size:20px">★</span>';
    btn.setAttribute('aria-label', 'Star');
    return btn;
  },
};
export const Loading: StoryObj = {
  render: () => {
    const btn = document.createElement('os-button');
    btn.setAttribute('variant', 'primary');
    btn.innerHTML = '<span style="font-size:20px">⏳</span> Loading';
    btn.setAttribute('disabled', '');
    return btn;
  },
};
