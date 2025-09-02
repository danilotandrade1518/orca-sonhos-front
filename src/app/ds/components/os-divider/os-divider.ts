const template = document.createElement('template');

template.innerHTML = `
  <style>
    :host { display: block; }
    hr {
      border: none;
      border-top: 1px solid var(--os-color-divider);
      margin: var(--os-space-3) 0;
    }
    :host([spaced="none"]) hr { margin: 0; }
    :host([spaced="sm"]) hr { margin: var(--os-space-2) 0; }
    :host([spaced="lg"]) hr { margin: var(--os-space-6) 0; }
  </style>
  <hr />
`;

export class OsDivider extends HTMLElement {
  constructor() {
    super();
    const s = this.attachShadow({ mode: 'open' });
    s.appendChild(template.content.cloneNode(true));
  }
}

customElements.define('os-divider', OsDivider);
