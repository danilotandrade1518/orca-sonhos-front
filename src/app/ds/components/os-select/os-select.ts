const template = document.createElement('template');
template.innerHTML = `
  <style>
    :host { display: inline-block; }
    select {
      height: 40px;
      padding: 0 var(--os-space-3);
      background: var(--os-color-elevated);
      color: var(--os-color-text);
      border: 1px solid var(--os-color-border);
      border-radius: var(--os-radius-md);
      outline: none;
    }
    select:focus { border-color: var(--os-color-primary); box-shadow: 0 0 0 calc(var(--os-focus-ring-width) + var(--os-focus-ring-offset)) var(--os-focus-ring); }
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
