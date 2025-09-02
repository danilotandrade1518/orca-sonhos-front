import type { Meta, StoryObj } from '@storybook/web-components';
import './os-card';

const meta: Meta = { title: 'Components/Card', component: 'os-card' };
export default meta;

export const WithHeaderAndFooter: StoryObj = {
  render: () => {
    const card = document.createElement('os-card');
    const h = document.createElement('div');
    h.slot = 'header';
    h.textContent = 'Saldo geral';
    const f = document.createElement('div');
    f.slot = 'footer';
    f.textContent = 'Atualizado há 2 min';
    card.append(h);
    card.appendChild(document.createTextNode('Conteúdo principal do card.'));
    card.append(f);
    return card;
  },
};

export const Flat: StoryObj = {
  render: () => {
    const card = document.createElement('os-card');
    card.setAttribute('flat', '');
    card.appendChild(document.createTextNode('Card sem sombra (flat).'));
    return card;
  },
};

export const Outlined: StoryObj = {
  render: () => {
    const card = document.createElement('os-card');
    card.setAttribute('outlined', '');
    card.appendChild(document.createTextNode('Card com borda, sem sombra (outlined).'));
    return card;
  },
};
