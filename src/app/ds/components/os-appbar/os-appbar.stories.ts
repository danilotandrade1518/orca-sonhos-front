import type { Meta, StoryObj } from '@storybook/web-components';
import './os-appbar';
import '../os-button/os-button';

const meta: Meta = { title: 'Components/AppBar', component: 'os-appbar' };
export default meta;

export const Default: StoryObj = {
  render: () => {
    const bar = document.createElement('os-appbar');
    const start = document.createElement('div');
    start.setAttribute('slot', 'start');
    start.innerHTML = '<strong>OrçaSonhos</strong>';
    const center = document.createElement('div');
    center.setAttribute('slot', 'center');
    center.textContent = 'Dashboard';
    const end = document.createElement('div');
    end.setAttribute('slot', 'end');
    const btn = document.createElement('os-button');
    btn.textContent = 'Logout';
    end.appendChild(btn);
    bar.append(start, center, end);
    return bar;
  },
};
