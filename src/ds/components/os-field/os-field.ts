const template = document.createElement('template');

template.innerHTML = `
  <style>
    :host { display: block; font-family: var(--os-font-sans); }
    label { display: inline-block; margin-bottom: var(--os-space-1); color: var(--os-color-text); font-size: var(--os-font-size-sm); }
    .hint { color: var(--os-color-text-muted); font-size: var(--os-font-size-sm); margin-top: var(--os-space-1); }
    .error { color: var(--os-color-danger); font-size: var(--os-font-size-sm); margin-top: var(--os-space-1); }
  </style>
  <label part="label"><slot name="label"></slot></label>
  <div part="control"><slot></slot></div>
  <div class="hint" part="hint"><slot name="hint"></slot></div>
  <div class="error" part="error"><slot name="error"></slot></div>
`;

export class OsField extends HTMLElement {
  constructor() {
    super();
    const shadow = this.attachShadow({ mode: 'open' });
    shadow.appendChild(template.content.cloneNode(true));
  }
}

customElements.define('os-field', OsField);
