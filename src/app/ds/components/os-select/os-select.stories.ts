import type { Meta, StoryObj } from '@storybook/web-components';
import './os-select';

const meta: Meta = { title: 'Components/Select', component: 'os-select' };
export default meta;

export const Default: StoryObj = {
  render: () => {
    const wrapper = document.createElement('div');
    const select = document.createElement('os-select');
    const native = document.createElement('option');
    native.value = '1';
    native.textContent = 'Janeiro 2025';
    const native2 = document.createElement('option');
    native2.value = '2';
    native2.textContent = 'Fevereiro 2025';
    const native3 = document.createElement('option');
    native3.value = '3';
    native3.textContent = 'Março 2025';
    select.shadowRoot?.querySelector('select')?.append(native, native2, native3);
    wrapper.appendChild(select);
    return wrapper;
  },
};
