const template = document.createElement('template');

template.innerHTML = `
  <style>
    :host { display: inline-flex; align-items: center; height: 24px; padding: 0 8px; border-radius: 999px; font-size: 12px; font-weight: 600; }
  :host([variant="neutral"]) { background: rgba(255,255,255,0.08); color: var(--os-color-text); }
  :host([variant="success"]) { background: color-mix(in oklab, var(--os-color-success) 25%, transparent); color: var(--os-color-success); }
  :host([variant="warning"]) { background: color-mix(in oklab, var(--os-color-warning) 25%, transparent); color: var(--os-color-warning); }
  :host([variant="danger"]) { background: color-mix(in oklab, var(--os-color-danger) 25%, transparent); color: var(--os-color-danger); }
  :host([variant="info"]) { background: color-mix(in oklab, var(--os-color-info) 25%, transparent); color: var(--os-color-info); }
  </style>
  <slot></slot>
`;

export class OsBadge extends HTMLElement {
  constructor() {
    super();
    const s = this.attachShadow({ mode: 'open' });
    s.appendChild(template.content.cloneNode(true));
  }
}

customElements.define('os-badge', OsBadge);
