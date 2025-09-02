import type { Meta, StoryObj } from '@storybook/web-components';
import './os-toast';

const meta: Meta = { title: 'Components/Toast', component: 'os-toast' };
export default meta;

export const Variants: StoryObj = {
  render: () => {
    const wrap = document.createElement('div');
    wrap.style.padding = '64px 0';
    const t1 = document.createElement('os-toast');
    t1.textContent = 'Tudo certo';
    t1.setAttribute('variant', 'success');
    const t2 = document.createElement('os-toast');
    t2.textContent = 'Atenção';
    t2.setAttribute('variant', 'warning');
    t2.style.bottom = '72px';
    const t3 = document.createElement('os-toast');
    t3.textContent = 'Falha ao salvar';
    t3.setAttribute('variant', 'danger');
    t3.style.bottom = '128px';
    wrap.append(t1, t2, t3);
    return wrap;
  },
};
