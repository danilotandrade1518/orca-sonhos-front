const template = document.createElement('template');

template.innerHTML = `
  <style>
    :host {
      display: inline-flex;
      align-items: center;
      justify-content: center;
      font-family: var(--os-font-sans);
      font-size: var(--os-font-size-md);
      height: 40px;
      padding: 0 var(--os-space-4);
      border-radius: var(--os-radius-md);
      border: none;
      cursor: pointer;
      user-select: none;
      transition: transform 120ms ease, background 120ms ease, box-shadow 120ms ease;
    }
    button {
      all: unset;
      display: inline-flex;
      align-items: center;
      gap: var(--os-space-2);
      padding: 0;
    }
    :host([variant="primary"]) {
      background: var(--os-color-primary);
      color: var(--os-color-primary-contrast);
      box-shadow: var(--os-shadow-1);
    }
    :host([variant="secondary"]) {
      background: var(--os-color-elevated);
      color: var(--os-color-text);
      box-shadow: var(--os-shadow-1);
      border: 1px solid rgba(255,255,255,0.06);
    }
    :host([variant="ghost"]) {
      background: transparent;
      color: var(--os-color-text);
    }
    :host([variant="danger"]) {
      background: var(--os-color-danger);
      color: #fff;
    }
    :host([disabled]) {
      opacity: 0.5;
      pointer-events: none;
    }
    :host(:active) { transform: translateY(1px); }
  </style>
  <button part="button" type="button"><slot></slot></button>
`;

export class OsButton extends HTMLElement {
  static get observedAttributes() {
    return ['variant', 'disabled'];
  }

  private _button!: HTMLButtonElement;

  constructor() {
    super();
    const shadow = this.attachShadow({ mode: 'open' });
    shadow.appendChild(template.content.cloneNode(true));
    this._button = shadow.querySelector('button')!;
  }

  attributeChangedCallback(name: string, _old: string | null, value: string | null) {
    if (name === 'disabled') {
      if (value !== null) this._button.setAttribute('disabled', '');
      else this._button.removeAttribute('disabled');
    }
  }
}

customElements.define('os-button', OsButton);
