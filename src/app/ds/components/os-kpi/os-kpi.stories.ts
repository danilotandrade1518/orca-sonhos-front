import type { Meta, StoryObj } from '@storybook/web-components';
import './os-kpi';

const meta: Meta = { title: 'Components/KPI', component: 'os-kpi' };
export default meta;

export const Basic: StoryObj = {
  render: () => {
    const el = document.createElement('os-kpi');
    el.setAttribute('label', 'Saldo do mês');
    el.setAttribute('value', 'R$ 1.500,00');
    el.setAttribute('delta', '12');
    el.setAttribute('delta-label', '+12% vs mês anterior');
    return el;
  },
};

export const Negative: StoryObj = {
  render: () => {
    const el = document.createElement('os-kpi');
    el.setAttribute('label', 'Despesas');
    el.setAttribute('value', 'R$ 3.500,00');
    el.setAttribute('delta', '-8');
    el.setAttribute('delta-label', '-8% vs mês anterior');
    return el;
  },
};

export const Slots: StoryObj = {
  render: () => {
    const el = document.createElement('os-kpi');
    const l = document.createElement('span');
    l.slot = 'label';
    l.textContent = 'Receitas';
    const v = document.createElement('span');
    v.slot = 'value';
    v.textContent = 'R$ 5.000,00';
    const d = document.createElement('span');
    d.slot = 'delta';
    d.textContent = '+5%';
    el.append(l, v, d);
    return el;
  },
};
