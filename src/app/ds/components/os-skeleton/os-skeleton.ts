const template = document.createElement('template');

template.innerHTML = `
  <style>
    :host {
      display: inline-block;
      width: 100%;
      height: 1rem;
      border-radius: var(--os-radius-sm);
      background: linear-gradient(90deg,
        color-mix(in oklab, var(--os-color-surface) 85%, white 15%),
        color-mix(in oklab, var(--os-color-surface) 75%, white 25%),
        color-mix(in oklab, var(--os-color-surface) 85%, white 15%)
      );
      background-size: 200% 100%;
      animation: shimmer var(--os-duration-2) var(--os-ease-standard) infinite;
    }
    :host([circle]) { border-radius: 50%; height: var(--size, 2rem); width: var(--size, 2rem); display: inline-block; }
    :host([width]) { width: var(--width); }
    :host([height]) { height: var(--height); }
    @keyframes shimmer {
      0% { background-position: 200% 0; }
      100% { background-position: -200% 0; }
    }
  </style>
  <slot></slot>
`;

export class OsSkeleton extends HTMLElement {
  constructor() {
    super();
    const s = this.attachShadow({ mode: 'open' });
    s.appendChild(template.content.cloneNode(true));
    // reflect width/height attributes into CSS vars for flexibility
    this._reflectDim('width', '--width');
    this._reflectDim('height', '--height');
    if (this.hasAttribute('size')) this.style.setProperty('--size', this.getAttribute('size')!);
  }

  static get observedAttributes() {
    return ['width', 'height', 'size'];
  }
  attributeChangedCallback(name: string, _o: string | null, n: string | null) {
    if (name === 'width') this._reflectDim('width', '--width');
    if (name === 'height') this._reflectDim('height', '--height');
    if (name === 'size' && n) this.style.setProperty('--size', n);
  }

  private _reflectDim(attr: string, cssVar: string) {
    const v = this.getAttribute(attr);
    if (v) this.style.setProperty(cssVar, v);
  }
}

customElements.define('os-skeleton', OsSkeleton);
