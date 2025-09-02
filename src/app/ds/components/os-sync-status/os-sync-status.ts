const template = document.createElement('template');
template.innerHTML = `
  <style>
    :host { display: inline-flex; align-items: center; gap: 6px; color: var(--os-color-text-muted); font-size: var(--os-font-size-sm); }
    .dot { width: 8px; height: 8px; border-radius: 50%; background: #6b7280; }
    :host([state="syncing"]) .dot { background: #f59e0b; animation: pulse 1.2s infinite ease-in-out; }
    :host([state="ok"]) .dot { background: #10b981; }
    :host([state="error"]) .dot { background: #ef4444; }
    @keyframes pulse { 0%,100% { opacity: 0.5 } 50% { opacity: 1 } }
  </style>
  <span class="dot"></span>
  <slot>Sincronizado</slot>
`;

export class OsSyncStatus extends HTMLElement {
  constructor() {
    super();
    const s = this.attachShadow({ mode: 'open' });
    s.appendChild(template.content.cloneNode(true));
  }
}

customElements.define('os-sync-status', OsSyncStatus);
