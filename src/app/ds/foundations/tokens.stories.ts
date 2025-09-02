import type { Meta, StoryObj } from '@storybook/web-components';

const meta: Meta = {
  title: 'Foundations/Tokens',
};
export default meta;

/* ---------- helpers ---------- */
const section = (title: string) => {
  const wrap = document.createElement('section');
  wrap.style.marginBottom = '24px';
  const h = document.createElement('h4');
  h.textContent = title;
  h.style.margin = '0 0 12px';
  h.style.fontFamily = 'var(--os-font-sans)';
  h.style.fontSize = '14px';
  h.style.fontWeight = '600';
  h.style.color = 'var(--os-color-text)';
  wrap.appendChild(h);
  return wrap;
};

const computedTokenValue = (cssVar: string) => {
  // cria um elemento temporário para resolver var(...)
  const el = document.createElement('div');
  el.style.background = `var(${cssVar})`;
  document.body.appendChild(el);
  const value = getComputedStyle(el).backgroundColor;
  document.body.removeChild(el);
  return value;
};

const ColorBox = (name: string, label: string) => {
  const wrap = document.createElement('div');
  wrap.style.fontFamily = 'var(--os-font-sans)';
  wrap.style.width = '140px';

  const sw = document.createElement('div');
  sw.style.width = '140px';
  sw.style.height = '56px';
  sw.style.borderRadius = '8px';
  sw.style.border = '1px solid var(--os-color-border)';
  // @ts-ignore
  sw.style.background = `var(${name})`;

  const cap = document.createElement('div');
  cap.style.marginTop = '8px';
  cap.style.fontSize = '12px';
  cap.style.color = 'var(--os-color-text)';
  const value = computedTokenValue(name);
  cap.innerHTML = `<strong>${label}</strong><br/><code>${name}</code><br/><span>${value}</span>`;

  wrap.appendChild(sw);
  wrap.appendChild(cap);
  return wrap;
};

const Grid = () => {
  const grid = document.createElement('div');
  grid.style.display = 'grid';
  grid.style.gridTemplateColumns = 'repeat(auto-fill, minmax(140px, 1fr))';
  grid.style.gap = '16px';
  return grid;
};

/* ---------- stories ---------- */

export const Colors: StoryObj = {
  render: () => {
    const root = document.createElement('div');

    // Base
    const base = section('Base');
    const baseGrid = Grid();
    [
      ['--os-color-bg', 'Background'],
      ['--os-color-surface', 'Surface'],
      ['--os-color-elevated', 'Elevated'],
      ['--os-color-text', 'Text'],
      ['--os-color-text-muted', 'Text Muted'],
      ['--os-color-border', 'Border'],
      ['--os-color-divider', 'Divider'],
    ].forEach(([name, label]) => baseGrid.appendChild(ColorBox(name as string, label as string)));
    base.appendChild(baseGrid);

    // Brand
    const brand = section('Brand');
    const brandGrid = Grid();
    [
      ['--os-color-primary', 'Primary'],
      ['--os-color-primary-nuance', 'Primary Nuance'],
      ['--os-color-secondary', 'Secondary'],
      ['--os-color-secondary-nuance', 'Secondary Nuance'],
      ['--os-color-secondary-neutral', 'Secondary Neutral'],
      ['--os-color-secondary-neutral-nuance', 'Secondary Neutral Nuance'],
    ].forEach(([name, label]) => brandGrid.appendChild(ColorBox(name as string, label as string)));
    brand.appendChild(brandGrid);

    // Semantic
    const sem = section('Semantic');
    const semGrid = Grid();
    [
      ['--os-color-success', 'Success'],
      ['--os-color-success-nuance', 'Success Nuance'],
      ['--os-color-warning', 'Warning'],
      ['--os-color-warning-nuance', 'Warning Nuance'],
      ['--os-color-info', 'Info'],
      ['--os-color-info-nuance', 'Info Nuance'],
      ['--os-color-danger', 'Danger'],
      ['--os-color-danger-nuance', 'Danger Nuance'],
      ['--os-color-positive', 'Positive (Valores/Receitas)'],
      ['--os-color-negative', 'Negative (Despesas)'],
    ].forEach(([name, label]) => semGrid.appendChild(ColorBox(name as string, label as string)));
    sem.appendChild(semGrid);

    root.append(base, brand, sem);
    return root;
  },
};

export const Spacing: StoryObj = {
  render: () => {
    const row = document.createElement('div');
    row.style.display = 'flex';
    row.style.flexWrap = 'wrap';
    row.style.gap = '16px';
    row.style.alignItems = 'flex-end';
    row.style.fontFamily = 'var(--os-font-sans)';
    row.style.color = 'var(--os-color-text)';

    [
      '--os-space-0',
      '--os-space-1',
      '--os-space-2',
      '--os-space-3',
      '--os-space-4',
      '--os-space-5',
      '--os-space-6',
      '--os-space-8',
      '--os-space-10',
      '--os-space-12',
      '--os-space-16',
    ].forEach((s) => {
      const col = document.createElement('div');
      col.style.width = '60px';
      const bar = document.createElement('div');
      bar.style.width = '60px';
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
  },
};

export const Radii: StoryObj = {
  render: () => {
    const row = document.createElement('div');
    row.style.display = 'flex';
    row.style.flexWrap = 'wrap';
    row.style.gap = '16px';
    row.style.fontFamily = 'var(--os-font-sans)';
    row.style.color = 'var(--os-color-text)';

    const mk = (varName: string, label: string) => {
      const card = document.createElement('div');
      card.style.width = '140px';
      const box = document.createElement('div');
      box.style.width = '140px';
      box.style.height = '56px';
      box.style.background = 'var(--os-color-surface)';
      box.style.border = '1px solid var(--os-color-border)';
      // @ts-ignore
      box.style.borderRadius = `var(${varName})`;
      box.style.boxShadow = 'var(--os-shadow-1)';
      const cap = document.createElement('div');
      cap.style.fontSize = '12px';
      cap.style.marginTop = '8px';
      cap.innerHTML = `<strong>${label}</strong><br/><code>${varName}</code>`;
      card.append(box, cap);
      return card;
    };

    [
      ['--os-radius-xs', 'Radius XS'],
      ['--os-radius-sm', 'Radius SM'],
      ['--os-radius-md', 'Radius MD'],
      ['--os-radius-lg', 'Radius LG'],
      ['--os-radius-xl', 'Radius XL'],
      ['--os-radius-pill', 'Radius Pill'],
    ].forEach(([v, l]) => row.appendChild(mk(v as string, l as string)));
    return row;
  },
};

export const Shadows: StoryObj = {
  render: () => {
    const row = document.createElement('div');
    row.style.display = 'grid';
    row.style.gridTemplateColumns = 'repeat(auto-fill, minmax(220px, 1fr))';
    row.style.gap = '16px';
    row.style.fontFamily = 'var(--os-font-sans)';
    row.style.color = 'var(--os-color-text)';

    const mk = (shadowVar: string, label: string) => {
      const card = document.createElement('div');
      card.style.padding = '16px';
      card.style.background = 'var(--os-color-surface)';
      card.style.border = '1px solid var(--os-color-border)';
      card.style.borderRadius = 'var(--os-radius-md)';
      // @ts-ignore
      card.style.boxShadow = `var(${shadowVar})`;
      const cap = document.createElement('div');
      cap.style.fontSize = '12px';
      cap.style.marginTop = '12px';
      cap.innerHTML = `<strong>${label}</strong><br/><code>${shadowVar}</code>`;
      const sample = document.createElement('div');
      sample.textContent = 'Shadow sample';
      sample.style.padding = '12px';
      sample.style.background = 'var(--os-color-elevated)';
      sample.style.borderRadius = 'var(--os-radius-sm)';
      sample.style.border = '1px solid var(--os-color-border)';
      card.append(sample, cap);
      return card;
    };

    [
      ['--os-shadow-1', 'Elevation 1'],
      ['--os-shadow-2', 'Elevation 2'],
      ['--os-shadow-3', 'Elevation 3'],
    ].forEach(([v, l]) => row.appendChild(mk(v as string, l as string)));
    return row;
  },
};
