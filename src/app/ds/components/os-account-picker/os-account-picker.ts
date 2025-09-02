const template = document.createElement('template');
template.innerHTML = `
  <style>
    :host { display: block; }
    .item { display: flex; justify-content: space-between; align-items: center; padding: var(--os-space-2) var(--os-space-3); border-radius: var(--os-radius-md); border: 1px solid rgba(255,255,255,0.06); background: var(--os-color-elevated); }
    .name { font-weight: 600; }
    .type { color: var(--os-color-text-muted); font-size: var(--os-font-size-sm); }
  </style>
  <div class="list"></div>
`;
export class OsAccountPicker extends HTMLElement {
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
      const items = JSON.parse(raw) as Array<{
        id: string;
        name: string;
        type?: string;
        balance?: string;
      }>;
      this._list.innerHTML = '';
      items.forEach((i) => {
        const row = document.createElement('div');
        row.className = 'item';
        row.innerHTML = `<div><div class="name">${i.name}</div><div class="type">${
          i.type ?? ''
        }</div></div><div class="balance">${i.balance ?? ''}</div>`;
        this._list.appendChild(row);
      });
    } catch {
      /* ignore */
    }
  }
}
customElements.define('os-account-picker', OsAccountPicker);
