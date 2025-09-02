const template = document.createElement('template');

template.innerHTML = `
  <style>
    :host { display: block; }
    .list { display: flex; flex-direction: column; gap: var(--os-space-2); }
    ::slotted(*) { background: var(--os-color-elevated); border: 1px solid rgba(255,255,255,0.06); border-radius: var(--os-radius-md); padding: var(--os-space-3); }
  </style>
  <div class="list"><slot></slot></div>
`;

export class OsList extends HTMLElement {
  constructor() {
    super();
    const s = this.attachShadow({ mode: 'open' });
    s.appendChild(template.content.cloneNode(true));
  }
}

customElements.define('os-list', OsList);
