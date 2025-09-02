const template = document.createElement('template');
template.innerHTML = `
  <style>
    :host { display: inline-block; }
    select { height: 40px; padding: 0 var(--os-space-3); background: var(--os-color-elevated); color: var(--os-color-text); border: 1px solid rgba(255,255,255,0.08); border-radius: var(--os-radius-md); }
  </style>
  <select part="select"><slot></slot></select>
`;
export class OsSelect extends HTMLElement {
  constructor() {
    super();
    const s = this.attachShadow({ mode: 'open' });
    s.appendChild(template.content.cloneNode(true));
  }
}
customElements.define('os-select', OsSelect);
