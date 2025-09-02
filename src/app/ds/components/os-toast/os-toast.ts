const template = document.createElement('template');
template.innerHTML = `
  <style>
    :host { display: block; position: fixed; right: 16px; bottom: 16px; }
    .toast { background: var(--os-color-elevated); color: var(--os-color-text); border: 1px solid rgba(255,255,255,0.06); border-radius: var(--os-radius-md); padding: var(--os-space-3) var(--os-space-4); box-shadow: var(--os-shadow-2); min-width: 240px; }
    :host([variant="success"]) .toast { border-color: #10b981; }
    :host([variant="warning"]) .toast { border-color: #f59e0b; }
    :host([variant="danger"]) .toast { border-color: #ef4444; }
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
