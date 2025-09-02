const template = document.createElement('template');

template.innerHTML = `
  <style>
    :host {
      display: block;
      background: var(--os-color-elevated);
      color: var(--os-color-text);
      border: 1px solid var(--os-color-border);
      border-radius: var(--os-radius-md);
      box-shadow: var(--os-shadow-1);
    }
    :host([flat]) { box-shadow: none; background: var(--os-color-surface); }
    :host([outlined]) { box-shadow: none; }
    .card { padding: var(--os-space-4); }
    .header { margin-bottom: var(--os-space-3); font-weight: var(--os-font-weight-semibold); font-size: var(--os-font-size-lg); line-height: var(--os-line-height-snug); }
    .footer { margin-top: var(--os-space-3); color: var(--os-color-text-muted); font-size: var(--os-font-size-sm); }
  </style>
  <div class="card">
    <div class="header"><slot name="header"></slot></div>
    <div class="content"><slot></slot></div>
    <div class="footer"><slot name="footer"></slot></div>
  </div>
`;

export class OsCard extends HTMLElement {
  constructor() {
    super();
    const s = this.attachShadow({ mode: 'open' });
    s.appendChild(template.content.cloneNode(true));
  }
}

customElements.define('os-card', OsCard);
