import type { Meta, StoryObj } from '@storybook/web-components';
import './os-field';
import '../os-input/os-input';

const meta: Meta = {
  title: 'Components/Field',
  component: 'os-field',
};
export default meta;

export const Default: StoryObj = {
  render: () => {
    const field = document.createElement('os-field');
    const label = document.createElement('span');
    label.setAttribute('slot', 'label');
    label.textContent = 'Name';
    const input = document.createElement('os-input');
    input.setAttribute('placeholder', 'Type your name');
    field.append(label, input);
    return field;
  },
};
export const WithHint: StoryObj = {
  render: () => {
    const field = document.createElement('os-field');
    const label = document.createElement('span');
    label.setAttribute('slot', 'label');
    label.textContent = 'Email';
    const input = document.createElement('os-input');
    input.setAttribute('placeholder', 'name@example.com');
    const hint = document.createElement('span');
    hint.setAttribute('slot', 'hint');
    hint.textContent = 'We will never share your email.';
    field.append(label, input, hint);
    return field;
  },
};
export const WithError: StoryObj = {
  render: () => {
    const field = document.createElement('os-field');
    const label = document.createElement('span');
    label.setAttribute('slot', 'label');
    label.textContent = 'Password';
    const input = document.createElement('os-input');
    input.setAttribute('type', 'password');
    input.setAttribute('invalid', '');
    const error = document.createElement('span');
    error.setAttribute('slot', 'error');
    error.textContent = 'Password is required.';
    field.append(label, input, error);
    return field;
  },
};
