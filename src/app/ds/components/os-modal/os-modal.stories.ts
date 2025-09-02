import type { Meta, StoryObj } from '@storybook/web-components';
import './os-modal';
import '../os-button/os-button';

const meta: Meta = { title: 'Components/Modal', component: 'os-modal' };
export default meta;

export const Default: StoryObj = {
  render: () => {
    const m = document.createElement('os-modal');
    m.setAttribute('open', '');
    const t = document.createElement('div');
    t.slot = 'title';
    t.textContent = 'Confirmar ação';
    const actions = document.createElement('div');
    actions.slot = 'actions';
    const cancel = document.createElement('os-button');
    cancel.textContent = 'Cancelar';
    const ok = document.createElement('os-button');
    ok.setAttribute('variant', 'primary');
    ok.textContent = 'Confirmar';
    actions.append(cancel, ok);
    m.append(t, document.createTextNode('Você tem certeza?'), actions);
    return m;
  },
};
