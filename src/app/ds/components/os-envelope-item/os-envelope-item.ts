const template = document.createElement('template');
template.innerHTML = `
  <style>
    :host { display: block; }
    .row { display: grid; grid-template-columns: 1fr auto; gap: var(--os-space-2); align-items: center; padding: var(--os-space-2) var(--os-space-3); border: 1px solid rgba(255,255,255,0.06); border-radius: var(--os-radius-md); background: var(--os-color-elevated); }
    .name { font-weight: 600; }
    .meta { color: var(--os-color-text-muted); font-size: var(--os-font-size-sm); }
    .amount.negative { color: var(--os-color-danger, #ef4444); }
    .amount.positive { color: var(--os-color-success, #10b981); }
  </style>
  <div class="row">
    <div>
      <div class="name"><slot name="name"></slot></div>
      <div class="meta"><slot name="meta"></slot></div>
    </div>
    <div class="amount"><slot name="amount"></slot></div>
  </div>
`;

export class OsEnvelopeItem extends HTMLElement {
  constructor() {
    super();
    const s = this.attachShadow({ mode: 'open' });
    s.appendChild(template.content.cloneNode(true));
  }
}

customElements.define('os-envelope-item', OsEnvelopeItem);
