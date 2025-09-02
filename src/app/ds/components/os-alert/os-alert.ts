const template = document.createElement('template');

template.innerHTML = `
  <style>
    :host { display: block; border-radius: var(--os-radius-md); padding: var(--os-space-3); border: 1px solid; }
    :host([variant="info"]) { background: #0b2948; color: #dbeafe; border-color: #2563eb; }
    :host([variant="success"]) { background: #052e27; color: #d1fae5; border-color: #10b981; }
    :host([variant="warning"]) { background: #3b2a05; color: #fef3c7; border-color: #f59e0b; }
    :host([variant="danger"]) { background: #3b0a0a; color: #fee2e2; border-color: #ef4444; }
    .title { font-weight: 600; margin-bottom: var(--os-space-1); }
  </style>
  <div class="title"><slot name="title"></slot></div>
  <div class="content"><slot></slot></div>
`;

export class OsAlert extends HTMLElement {
  constructor() {
    super();
    const s = this.attachShadow({ mode: 'open' });
    s.appendChild(template.content.cloneNode(true));
  }
}

customElements.define('os-alert', OsAlert);
