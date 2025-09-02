const template = document.createElement('template');
template.innerHTML = `
  <style>
    :host { display: block; }
    .row { display: flex; align-items: center; gap: var(--os-space-2); padding: var(--os-space-2) var(--os-space-3); border: 1px solid rgba(255,255,255,0.06); border-radius: var(--os-radius-md); background: var(--os-color-elevated); }
    .name { font-weight: 600; }
    .period { color: var(--os-color-text-muted); font-size: var(--os-font-size-sm); }
  </style>
  <div class="list"></div>
`;

export class OsBudgetPicker extends HTMLElement {
  static get observedAttributes() {
    return ['options'];
  }
  private _list!: HTMLDivElement;
  constructor() {
    super();
    const s = this.attachShadow({ mode: 'open' });
    s.appendChild(template.content.cloneNode(true));
    this._list = s.querySelector('.list')!;
  }
  connectedCallback() {
    this._render();
  }
  attributeChangedCallback() {
    this._render();
  }
  private _render() {
    const raw = this.getAttribute('options');
    if (!raw) {
      this._list.innerHTML = '';
      return;
    }
    try {
      const items = JSON.parse(raw) as Array<{ id: string; name: string; period: string }>;
      this._list.innerHTML = '';
      items.forEach((i) => {
        const row = document.createElement('div');
        row.className = 'row';
        row.innerHTML = `<div class="name">${i.name}</div><div class="period">${i.period}</div>`;
        this._list.appendChild(row);
      });
    } catch {
      /* ignore */
    }
  }
}

customElements.define('os-budget-picker', OsBudgetPicker);
