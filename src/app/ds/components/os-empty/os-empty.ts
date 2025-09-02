const template = document.createElement('template');

template.innerHTML = `
  <style>
    :host { display: grid; place-items: center; text-align: center; padding: var(--os-space-8) var(--os-space-4); color: var(--os-color-text-muted); }
    .title { font-weight: 600; margin-bottom: var(--os-space-2); color: var(--os-color-text); }
  </style>
  <div>
    <div class="title"><slot name="title"></slot></div>
    <div class="desc"><slot></slot></div>
  </div>
`;

export class OsEmpty extends HTMLElement {
  constructor() {
    super();
    const s = this.attachShadow({ mode: 'open' });
    s.appendChild(template.content.cloneNode(true));
  }
}

customElements.define('os-empty', OsEmpty);
