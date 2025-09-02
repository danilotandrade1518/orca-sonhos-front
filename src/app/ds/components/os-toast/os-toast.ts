const template = document.createElement('template');
template.innerHTML = `
  <style>
  :host { display: block; position: fixed; right: var(--os-space-4); bottom: var(--os-space-4); }
  .toast { background: var(--os-color-elevated); color: var(--os-color-text); border: 1px solid var(--os-color-border); border-radius: var(--os-radius-md); padding: var(--os-space-3) var(--os-space-4); box-shadow: var(--os-shadow-2); min-width: 240px; }
  :host([variant="info"]) .toast { border-color: var(--os-color-info); }
  :host([variant="success"]) .toast { border-color: var(--os-color-success); }
  :host([variant="warning"]) .toast { border-color: var(--os-color-warning); }
  :host([variant="danger"]) .toast { border-color: var(--os-color-danger); }
  </style>
  <div class="toast"><slot>Operação realizada</slot></div>
`;

export class OsToast extends HTMLElement {
  constructor() {
    super();
    const s = this.attachShadow({ mode: 'open' });
    s.appendChild(template.content.cloneNode(true));
  }
}

customElements.define('os-toast', OsToast);
