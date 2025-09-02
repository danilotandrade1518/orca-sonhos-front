const template = document.createElement('template');

template.innerHTML = `
  <style>
    :host { display: inline-flex; align-items: center; height: 24px; padding: 0 8px; border-radius: 999px; font-size: 12px; font-weight: 600; }
    :host([variant="neutral"]) { background: rgba(255,255,255,0.08); color: var(--os-color-text); }
    :host([variant="success"]) { background: #065f46; color: #a7f3d0; }
    :host([variant="warning"]) { background: #78350f; color: #fcd34d; }
    :host([variant="danger"]) { background: #7f1d1d; color: #fecaca; }
    :host([variant="info"]) { background: #1e3a8a; color: #bfdbfe; }
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
