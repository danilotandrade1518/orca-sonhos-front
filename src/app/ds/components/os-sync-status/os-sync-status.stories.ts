import type { Meta, StoryObj } from '@storybook/web-components';
import './os-sync-status';

const meta: Meta = { title: 'Components/Sync Status', component: 'os-sync-status' };
export default meta;

export const States: StoryObj = {
  render: () => {
    const wrap = document.createElement('div');
    wrap.style.display = 'grid';
    wrap.style.gap = '8px';
    const s1 = document.createElement('os-sync-status');
    s1.setAttribute('state', 'syncing');
    s1.textContent = 'Sincronizando...';
    const s2 = document.createElement('os-sync-status');
    s2.setAttribute('state', 'ok');
    s2.textContent = 'Atualizado';
    const s3 = document.createElement('os-sync-status');
    s3.setAttribute('state', 'error');
    s3.textContent = 'Erro na sincronização';
    wrap.append(s1, s2, s3);
    return wrap;
  },
};
