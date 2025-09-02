import type { Meta, StoryObj } from '@storybook/web-components';

const meta: Meta = {
  title: 'Foundations/Tokens'
};
export default meta;

const ColorBox = (name: string, label: string) => {
  const wrap = document.createElement('div');
  wrap.style.fontFamily = 'var(--os-font-sans)';
  const sw = document.createElement('div');
  sw.style.width = '120px';
  sw.style.height = '48px';
  sw.style.borderRadius = '8px';
  sw.style.border = '1px solid rgba(255,255,255,0.1)';
  // @ts-ignore
  sw.style.background = `var(${name})`;
  const cap = document.createElement('div');
  cap.style.marginTop = '8px';
  cap.style.fontSize = '12px';
  cap.style.color = 'var(--os-color-text)';
  cap.innerHTML = `${label}<br/><code>${name}</code>`;
  wrap.appendChild(sw);
  wrap.appendChild(cap);
  return wrap;
};

export const Colors: StoryObj = {
  render: () => {
    const grid = document.createElement('div');
    grid.style.display = 'grid';
    grid.style.gridTemplateColumns = 'repeat(5, 120px)';
    grid.style.gap = '16px';
    [
      ['--os-color-bg','Background'],
      ['--os-color-surface','Surface'],
      ['--os-color-elevated','Elevated'],
      ['--os-color-primary','Primary'],
      ['--os-color-danger','Danger'],
      ['--os-color-text','Text'],
      ['--os-color-text-muted','Text Muted']
    ].forEach(([name,label]) => grid.appendChild(ColorBox(name as string, label as string)));
    return grid;
  }
};

export const Spacing: StoryObj = {
  render: () => {
    const row = document.createElement('div');
    row.style.display = 'flex';
    row.style.gap = '12px';
    row.style.alignItems = 'flex-end';
    row.style.fontFamily = 'var(--os-font-sans)';
    row.style.color = 'var(--os-color-text)';
    ['--os-space-1','--os-space-2','--os-space-3','--os-space-4','--os-space-6','--os-space-8'].forEach((s) => {
      const col = document.createElement('div');
      const bar = document.createElement('div');
      bar.style.width = '40px';
      // @ts-ignore
      bar.style.height = `var(${s})`;
      bar.style.background = 'var(--os-color-primary)';
      bar.style.borderRadius = '6px';
      const cap = document.createElement('div');
      cap.style.fontSize = '12px';
      cap.style.marginTop = '6px';
      cap.innerHTML = `<code>${s}</code>`;
      col.append(bar, cap);
      row.append(col);
    });
    return row;
  }
};
