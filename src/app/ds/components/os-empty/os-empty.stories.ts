import type { Meta, StoryObj } from '@storybook/web-components';
import './os-empty';

const meta: Meta = { title: 'Components/Empty', component: 'os-empty' };
export default meta;

export const Default: StoryObj = {
  render: () => {
    const el = document.createElement('os-empty');
    const t = document.createElement('div');
    t.slot = 'title';
    t.textContent = 'Nada por aqui';
    el.append(t, document.createTextNode('Tente ajustar os filtros ou criar um novo item.'));
    return el;
  },
};
