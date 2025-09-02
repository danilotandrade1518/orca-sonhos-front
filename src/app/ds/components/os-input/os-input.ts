const template = document.createElement('template');

template.innerHTML = `
  <style>
    :host { display: inline-flex; width: 100%; }
    input {
      width: 100%;
      box-sizing: border-box;
      height: 40px;
      padding: 0 var(--os-space-3);
      color: var(--os-color-text);
      background: var(--os-color-elevated);
      border: 1px solid rgba(255,255,255,0.08);
      border-radius: var(--os-radius-md);
      outline: none;
    }
    input::placeholder { color: var(--os-color-text-muted); }
    input:focus { border-color: var(--os-color-primary); box-shadow: 0 0 0 3px rgba(79,70,229,0.25); }
    :host([invalid]) input { border-color: var(--os-color-danger); }
  </style>
  <input part="input" />
`;

export class OsInput extends HTMLElement {
  static get observedAttributes() {
    return ['placeholder', 'value', 'type', 'disabled'];
  }
  private _input!: HTMLInputElement;

  constructor() {
    super();
    const shadow = this.attachShadow({ mode: 'open' });
    shadow.appendChild(template.content.cloneNode(true));
    this._input = shadow.querySelector('input')!;
    this._input.addEventListener('input', () => this.dispatchEvent(new Event('input')));
    this._input.addEventListener('change', () => this.dispatchEvent(new Event('change')));
  }

  get value() {
    return this._input.value;
  }
  set value(v: string) {
    this._input.value = v ?? '';
  }

  attributeChangedCallback(name: string, _old: string | null, value: string | null) {
    if (name === 'placeholder') this._input.placeholder = value ?? '';
    if (name === 'value') this._input.value = value ?? '';
    if (name === 'type') this._input.type = value ?? 'text';
    if (name === 'disabled') this._input.disabled = value !== null;
  }
}

customElements.define('os-input', OsInput);
