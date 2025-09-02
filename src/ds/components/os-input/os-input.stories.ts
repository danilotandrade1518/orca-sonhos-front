import type { Meta, StoryObj } from '@storybook/web-components';
import './os-input';
import '../os-field/os-field';

const meta: Meta = {
  title: 'Components/Input',
  component: 'os-input',
  args: { placeholder: 'Type something...' },
  render: (args: any) => {
    const field = document.createElement('os-field');
    const label = document.createElement('span');
    label.setAttribute('slot', 'label');
    label.textContent = 'Label';
    const input = document.createElement('os-input');
    if (args.placeholder) input.setAttribute('placeholder', args.placeholder);
    field.append(label, input);
    return field;
  },
};
export default meta;

export const Default: StoryObj = { args: { placeholder: 'Type something...' } };
export const Invalid: StoryObj = {
  render: () => {
    const field = document.createElement('os-field');
    const label = document.createElement('span');
    label.setAttribute('slot', 'label');
    label.textContent = 'Email';
    const input = document.createElement('os-input');
    input.setAttribute('placeholder', 'name@example.com');
    input.setAttribute('invalid', '');
    const error = document.createElement('span');
    error.setAttribute('slot', 'error');
    error.textContent = 'Invalid email';
    field.append(label, input, error);
    return field;
  },
};
export const Disabled: StoryObj = {
  render: () => {
    const field = document.createElement('os-field');
    const label = document.createElement('span');
    label.setAttribute('slot', 'label');
    label.textContent = 'Disabled';
    const input = document.createElement('os-input');
    input.setAttribute('placeholder', 'Disabled input');
    input.setAttribute('disabled', '');
    field.append(label, input);
    return field;
  },
};
export const Password: StoryObj = {
  render: () => {
    const field = document.createElement('os-field');
    const label = document.createElement('span');
    label.setAttribute('slot', 'label');
    label.textContent = 'Password';
    const input = document.createElement('os-input');
    input.setAttribute('type', 'password');
    input.setAttribute('placeholder', '••••••••');
    field.append(label, input);
    return field;
  },
};
