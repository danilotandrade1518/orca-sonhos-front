const template = document.createElement('template');

template.innerHTML = `
  <style>
  :host { display: block; border-radius: var(--os-radius-md); padding: var(--os-space-3); border: 1px solid; }
  :host([variant="info"]) { background: color-mix(in oklab, var(--os-color-info) 10%, transparent); color: var(--os-color-text); border-color: var(--os-color-info); }
  :host([variant="success"]) { background: color-mix(in oklab, var(--os-color-success) 10%, transparent); color: var(--os-color-text); border-color: var(--os-color-success); }
  :host([variant="warning"]) { background: color-mix(in oklab, var(--os-color-warning) 10%, transparent); color: var(--os-color-text); border-color: var(--os-color-warning); }
  :host([variant="danger"]) { background: color-mix(in oklab, var(--os-color-danger) 10%, transparent); color: var(--os-color-text); border-color: var(--os-color-danger); }
  .title { font-weight: var(--os-font-weight-semibold); margin-bottom: var(--os-space-1); }
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
