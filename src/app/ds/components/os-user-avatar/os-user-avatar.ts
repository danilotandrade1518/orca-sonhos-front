const template = document.createElement('template');

template.innerHTML = `
  <style>
    :host { display: inline-flex; }
    .avatar { width: 32px; height: 32px; border-radius: 50%; background: var(--os-color-elevated); color: var(--os-color-text); display: inline-flex; align-items: center; justify-content: center; font-weight: 600; font-size: 12px; border: 1px solid rgba(255,255,255,0.08); overflow: hidden; }
    img { width: 100%; height: 100%; object-fit: cover; display: none; }
  </style>
  <div class="avatar" part="avatar">
    <img part="image"/>
    <span part="initials"><slot></slot></span>
  </div>
`;

export class OsUserAvatar extends HTMLElement {
  static get observedAttributes() {
    return ['name', 'src'];
  }
  private _img!: HTMLImageElement;
  private _initials!: HTMLElement;
  constructor() {
    super();
    const s = this.attachShadow({ mode: 'open' });
    s.appendChild(template.content.cloneNode(true));
    this._img = s.querySelector('img')!;
    this._initials = s.querySelector('span')!;
  }
  connectedCallback() {
    this._render();
  }
  attributeChangedCallback() {
    this._render();
  }
  private _render() {
    const name = this.getAttribute('name') ?? '';
    const src = this.getAttribute('src');
    if (src) {
      this._img.src = src;
      this._img.style.display = 'block';
      this._initials.style.display = 'none';
    } else {
      const initials = name
        .trim()
        .split(/\s+/)
        .slice(0, 2)
        .map((p) => p[0]?.toUpperCase() ?? '')
        .join('');
      this._initials.textContent = initials || '?';
      this._img.style.display = 'none';
      this._initials.style.display = 'inline';
    }
  }
}

customElements.define('os-user-avatar', OsUserAvatar);
