import type { Meta, StoryObj } from '@storybook/web-components';
import './os-field';

const meta: Meta = {
  title: 'Components/Field',
  component: 'os-field',
  render: (args: any) => {
    const field = document.createElement('os-field');
    if (args.label) {
      const label = document.createElement('span');
      label.setAttribute('slot', 'label');
      label.textContent = args.label;
      field.append(label);
    }
    if (args.error) {
      const error = document.createElement('span');
      error.setAttribute('slot', 'error');
      error.textContent = args.error;
      field.append(error);
    }
    if (args.content) {
      const content = document.createElement('span');
      content.textContent = args.content;
      field.append(content);
    }
    return field;
  },
  args: {
    label: 'Label',
    content: 'Field content',
    error: '',
  },
};
export default meta;

export const Default: StoryObj = { args: { label: 'Label', content: 'Field content', error: '' } };
export const WithError: StoryObj = {
  args: { label: 'Label', content: 'Field content', error: 'Error message' },
};
