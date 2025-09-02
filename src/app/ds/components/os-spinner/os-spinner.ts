const template = document.createElement('template');

template.innerHTML = `
  <style>
    :host { display: inline-block; }
    .spin { width: var(--size, 20px); height: var(--size, 20px); border-radius: 50%; border: 2px solid rgba(255,255,255,0.2); border-top-color: var(--os-color-primary); animation: r 1s linear infinite; }
    @keyframes r { to { transform: rotate(360deg); } }
  </style>
  <div class="spin" part="spinner"></div>
`;

export class OsSpinner extends HTMLElement {
  constructor() {
    super();
    const s = this.attachShadow({ mode: 'open' });
    s.appendChild(template.content.cloneNode(true));
  }
}

customElements.define('os-spinner', OsSpinner);
