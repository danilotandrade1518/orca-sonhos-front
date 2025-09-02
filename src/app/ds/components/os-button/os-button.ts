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
  border: 1px solid transparent;
      cursor: pointer;
      user-select: none;
  transition: transform var(--os-duration-1) var(--os-ease-standard), background var(--os-duration-1) var(--os-ease-standard), box-shadow var(--os-duration-1) var(--os-ease-standard), border-color var(--os-duration-1) var(--os-ease-standard);
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
    :host([variant="primary"]:hover) {
      background: var(--os-color-primary-nuance);
    }
    :host([variant="secondary"]) {
      background: var(--os-color-elevated);
      color: var(--os-color-text);
      box-shadow: var(--os-shadow-1);
      border-color: var(--os-color-border);
    }
    :host([variant="secondary-neutral"]) {
      background: var(--os-color-elevated);
      color: var(--os-color-text);
      box-shadow: var(--os-shadow-1);
      border-color: var(--os-color-secondary-neutral);
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
    :host(:focus-visible) {
      outline: none;
      box-shadow: 0 0 0 var(--os-focus-ring-width) var(--os-focus-ring);
    }
    :host([variant="ghost"]:hover) { background: rgba(255,255,255,0.04); }
    :host([variant="secondary"]:hover) { background: var(--os-color-surface); }
    :host([variant="secondary-neutral"]:hover) {
      background: var(--os-color-surface);
      border-color: var(--os-color-secondary-neutral-nuance);
    }
    :host([variant="danger"]:hover) { background: var(--os-color-danger-nuance); }
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
